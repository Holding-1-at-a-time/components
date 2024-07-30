import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    organizationId: v.string(),
    vehicleId: v.id("vehicles"),
    service: v.string(),
    date: v.string(),
    time: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appointmentId = await ctx.db.insert("appointments", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return appointmentId;
  },
});

export const update = mutation({
  args: {
    id: v.id("appointments"),
    service: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args;
    await ctx.db.patch(id, { ...updateFields, updatedAt: Date.now() });
  },
});

export const listByDate = query({
  args: { 
    organizationId: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_date", (q) => q.eq("organizationId", args.organizationId).eq("date", args.date))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});