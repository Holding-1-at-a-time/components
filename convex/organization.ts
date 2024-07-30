import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

interface Args {
    name: string;
    organizationSlug: string;
    ownerId: string;
    organizationId: Id<'organization'>;
}


export const create = mutation({
  args: {
    name: v.string(),
    organizationSlug: v.string(),
    ownerId: v.id("name"),
    organizationId: v.id("organization"),
  },
  
  handler: async (ctx, args: { name: string; slug: string; ownerId: string }) => {
    const existingOrg = await ctx.db
      .query("organizationsId")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  
    if (existingOrg) {
      throw new Error("Organization with this slug already exists");
    }
  
    const orgId = await ctx.db.insert("organizations", {
      name: args.name,
      slug: args.slug,
      ownerId: args.ownerId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  
    return orgId;
  },
  

    const orgId = await ctx.db.insert("organizations", {
      name: args.name,
      slug: args.slug,
      ownerId: args.ownerId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return orgId;
  },
});

export const getByorganizationSlug = query({
  args: { organizationSlug: v.string() },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_organizationSlug", (q) => q.eq("organizationSlug", args.slug))
      .first();

    if (!org) {
      throw new Error("Organization not found");
    }

    return org;
  },
});