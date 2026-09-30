import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  learners: defineTable({
    name: v.string(),
    xp: v.number(),
  }),
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),
});
