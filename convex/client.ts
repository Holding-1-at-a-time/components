

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    organizationId: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const clientId = await ctx.db.insert("clients", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return clientId;
  },
});

export const update = mutation({
  args: {
    id: v.id("clients"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args;
    await ctx.db.patch(id, {
      ...updateFields,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const get = query({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});import { v } from 'convex/values'; // Make sure to import the necessary module

export const list = query({
  args: { 
    organizationId: v.id('organization'), // Adjusted to accept an Id type
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let clientsQuery = ctx.db
      .query('clients')
      .withIndex('by_organizationId', (q) => q.eq('organization', args.organizationId));

    if (args.search) {
      clientsQuery = clientsQuery.filter((q) => q.eq('search_clients', args.search));
    }

    try {
      const clients = await clientsQuery.collect();
      return clients;
    } catch (error) {
      console.error('Failed to fetch clients', error);
      throw error;
    }
  },
});

export const listQuery = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('clients')
      .filter((q) => q.eq(q.field('organizationId'), args.orgId))
      .collect();
  },
});


export const deleteClient = mutation({
  args: { clientId: v.id('clients') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.clientId);
  },
});