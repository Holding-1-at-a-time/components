
import { query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('invoices')
      .filter((q) => q.eq(q.field('organizationId'), args.orgId))
      .collect();
  },
});


export const list = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('invoices')
      .filter((q) => q.eq(q.field('organizationId'), args.orgId))
      .collect();
  },
});