// File: convex/analytics.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const logEvent = mutation({
  args: {
    eventName: v.string(),
    properties: v.optional(v.record(v.any())),
  },
  handler: async (ctx, args) => {
    // Your logging logic here
    console.log("Event logged:", args.eventName, args.properties);
  },
});