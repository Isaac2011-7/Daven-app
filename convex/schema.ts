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
  onboarding: defineTable({
    tokenIdentifier: v.string(),
    // Optional so rows saved before language selection existed stay valid.
    language: v.optional(v.union(v.string(), v.null())),
    level: v.number(),
    hebrewReading: v.union(v.string(), v.null()),
    reasons: v.array(v.string()),
    startPath: v.union(v.string(), v.null()),
    completed: v.boolean(),
  }).index("by_token", ["tokenIdentifier"]),
});
