import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Adds a sample learner row. Internal so the app can't write arbitrary names
 * or XP; run it from the CLI or dashboard. Real XP will come from server-side
 * lesson progress once that exists.
 */
export const addLearner = internalMutation({
  args: { name: v.string(), xp: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.insert("learners", { name: args.name, xp: args.xp });
  },
});

export const listLearners = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.query("learners").order("desc").take(50);
  },
});
