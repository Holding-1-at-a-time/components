import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    organizationId: v.string(),
    clientId: v.id("clients"),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    vin: v.string(),
    color: v.string(),
    licensePlate: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const vehicleId = await ctx.db.insert("vehicles", {
      ...args,
      lastServiceDate: Date.now(),
    });
    return vehicleId;
  },
});

export const update = mutation({
  args: {
    id: v.id("vehicles"),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    year: v.optional(v.number()),
    vin: v.optional(v.string()),
    color: v.optional(v.string()),
    licensePlate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args;
    await ctx.db.patch(id, updateFields);
  },
});

export const remove = mutation({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const get = query({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listByOrganization = query({
  args: {
    organizationId: v.optional(v.string()),
    search: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    if (!args.organizationId) {
      throw new Error('Organization ID is required');
    }

    let vehiclesQuery = ctx.db
      .query("vehicles")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId as string));

    if (args.search) {
      vehiclesQuery = vehiclesQuery.filter((q) => q.eq("make", args.search) || q.eq("model", args.search));
    }

    return await vehiclesQuery.collect().catch((err) => {
      throw new Error(`Error retrieving vehicles: ${err.message}`);
    });
  },
});
export const listByClient = query({
  args: {
    clientId: v.id("clients"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vehicles")
      .collect();
  },
});