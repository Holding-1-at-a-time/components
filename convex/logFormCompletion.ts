// File: convex/actions/logFormCompletion.ts

import { action } from './_generated/server';

export const logFormCompletion = action({
  args: { userId: 'string', formId: 'string', status: 'string' },
  handler: async (ctx, args) => {
    await ctx.db.insert('formLogs', args);
  },
});