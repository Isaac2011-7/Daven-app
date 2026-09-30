import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addLearner = mutation({
  args: { name: v.string(), xp: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.insert("learners", { name: args.name, xp: args.xp });
  },
});

export const listLearners = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("learners").order("desc").take(50);
  },
});
