import { internal } from "./_generated/api";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Saves the signed-in Clerk user in the users table (once per user). */
export const store = mutation({
  args: { name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (existing !== null) {
      await ctx.db.patch(existing._id, {
        email: identity.email ?? existing.email,
        name: args.name ?? existing.name,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      name: args.name ?? identity.name,
    });
  },
});

export const getOnboarding = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const onboarding = await ctx.db
      .query("onboarding")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    return {
      userId: identity.subject,
      answers: onboarding === null
        ? null
        : {
            language: onboarding.language ?? null,
            level: onboarding.level,
            hebrewReading: onboarding.hebrewReading,
            reasons: onboarding.reasons,
            startPath: onboarding.startPath,
            completed: onboarding.completed,
          },
    };
  },
});

export const saveOnboarding = mutation({
  args: {
    language: v.union(v.string(), v.null()),
    level: v.number(),
    hebrewReading: v.union(v.string(), v.null()),
    reasons: v.array(v.string()),
    startPath: v.union(v.string(), v.null()),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("onboarding")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (existing !== null) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("onboarding", {
      tokenIdentifier: identity.tokenIdentifier,
      ...args,
    });
  },
});

/** Deletes the users rows (and their onboarding answers) for an email. Called by removeByEmail. */
export const deleteRowsByEmail = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();
    for (const row of rows) {
      const onboardingRows = await ctx.db
        .query("onboarding")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", row.tokenIdentifier))
        .collect();
      for (const onboarding of onboardingRows) {
        await ctx.db.delete(onboarding._id);
      }
      await ctx.db.delete(row._id);
    }
    return rows.length;
  },
});

/**
 * Dev cleanup: deletes an email from Convex AND Clerk so it can sign up again.
 * Internal, so only runnable from the CLI or dashboard, never from the app:
 *   npx convex run users:removeByEmail '{"email":"you@example.com"}'
 */
export const removeByEmail = internalAction({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Set CLERK_SECRET_KEY in the Convex environment variables.");
    }
    const headers = { Authorization: `Bearer ${secretKey}` };

    const found = await fetch(
      `https://api.clerk.com/v1/users?email_address[]=${encodeURIComponent(args.email)}`,
      { headers },
    );
    if (!found.ok) {
      throw new Error(`Clerk lookup failed (${found.status}).`);
    }
    const clerkUsers = (await found.json()) as { id: string }[];

    for (const clerkUser of clerkUsers) {
      const deleted = await fetch(`https://api.clerk.com/v1/users/${clerkUser.id}`, {
        method: "DELETE",
        headers,
      });
      if (!deleted.ok) {
        throw new Error(`Clerk delete failed (${deleted.status}).`);
      }
    }

    const rows: number = await ctx.runMutation(internal.users.deleteRowsByEmail, {
      email: args.email,
    });
    return { clerkUsersDeleted: clerkUsers.length, convexRowsDeleted: rows };
  },
});
