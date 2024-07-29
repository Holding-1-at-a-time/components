import { query, mutation} from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: { 
    name: v.string(),
    description: v.string(),
    price: v.number(),
    tenantId: v.id("organization"),
  },
    /**
     * Executes a query to retrieve all services from the database and returns them.
     *
     * @param {object} ctx - The context object containing the database connection.
     * @param {object} _serviceArgs - The arguments for the service. Currently unused.
     * @return {Promise<Array>} A promise that resolves to an array of services.
     */
  handler: async (ctx, _serviceArgs) => {
    const service = await ctx.db.query("services");
    return service;
  },
});



export const listServices = query({
  args: { tenantId: v.id('organization') },
  /**
   * Retrieves a list of services associated with a given tenant ID.
   *
   * @param {GenericQueryCtx} ctx - The context object for the query.
   * @param {Object} args - The arguments object containing the tenant ID.
   * @param {string} args.tenantId - The ID of the tenant.
   * @return {Promise<Array<Service>>} - A promise that resolves to an array of services.
   */
  handler: async (ctx, args) => {
    const services = await ctx.db
      .query("services")
      .filter((q) => q.eq(q.field('organizationId'), args.tenantId))
      .collect();
    
    return services;
  },
});


      /**
       * Retrieves a list of services based on the provided tenant ID.
       *
       * @param {Object} ctx - The context object containing the database connection.
       * @param {Object} args - The arguments object containing the tenant ID.
       * @param {string} args.tenantId - The ID of the tenant.
       * @return {Promise<Array>} A promise that resolves to an array of services.
       */
export const listByTenant = query({
  args: { tenantId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('services')
      .filter((q) => q.eq(q.field('organizationId'), args.tenantId))
      .collect();
  },
});