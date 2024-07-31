import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
// File: convex/vehicles.ts

import { mutation, query } from './_generated/server';
import { z } from 'zod';

export const createVehicle = mutation({
  args: {
    make: z.string(),
    model: z.string(),
    year: z.number(),
    vin: z.string(),
    mileage: z.number(),
    exteriorColor: z.string(),
    interiorColor: z.string(),
    modifications: z.string().optional(),
    trimLevel: z.string().optional(),
    engineType: z.string().optional(),
    transmissionType: z.string().optional(),
    driveType: z.enum(['FWD', 'RWD', 'AWD']),
    bodyStyle: z.string().optional(),
    numberOfDoors: z.number(),
    fuelType: z.string().optional(),
    manufacturerName: z.string().optional(),
    plantCountry: z.string().optional(),
    plantCity: z.string().optional(),
    gvwrClass: z.string().optional(),
    engineDisplacement: z.number().optional(),
    numberOfCylinders: z.number().optional(),
    lastDetailingDate: z.date().optional(),
  },
  handler: async (ctx, args) => {
    const vehicleId = await ctx.db.insert('vehicles', args);
    return vehicleId;
  },
});

export const updateVehicle = mutation({
  args: {
    id: z.string(),
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.number().optional(),
    vin: z.string().optional(),
    mileage: z.number().optional(),
    exteriorColor: z.string().optional(),
    interiorColor: z.string().optional(),
    modifications: z.string().optional(),
    trimLevel: z.string().optional(),
    engineType: z.string().optional(),
    transmissionType: z.string().optional(),
    driveType: z.enum(['FWD', 'RWD', 'AWD']).optional(),
    bodyStyle: z.string().optional(),
    numberOfDoors: z.number().optional(),
    fuelType: z.string().optional(),
    manufacturerName: z.string().optional(),
    plantCountry: z.string().optional(),
    plantCity: z.string().optional(),
    gvwrClass: z.string().optional(),
    engineDisplacement: z.number().optional(),
    numberOfCylinders: z.number().optional(),
    lastDetailingDate: z.date().optional(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args;
    await ctx.db.patch(id, updateFields);
  },
});

export const getVehicleByVIN = query({
  args: { vin: z.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query('vehicles').filter(q => q.eq('vin', args.vin)).first();
  },
});

export const getVehicleMakes = query({
  handler: async (ctx) => {
    // Fetch and return vehicle makes
  },
});

export const getVehicleModels = query({
  args: { make: z.string() },
  handler: async (ctx, args) => {
    // Fetch and return vehicle models for the given make
  },
});

export const storeVehicleInfo = mutation({
  args: {
    vin: z.string(),
    data: z.object({
      make: z.string(),
      model: z.string(),
      year: z.number(),
      mileage: z.number(),
      exteriorColor: z.string(),
      interiorColor: z.string(),
      modifications: z.string().optional(),
      trimLevel: z.string().optional(),
      engineType: z.string().optional(),
      transmissionType: z.string().optional(),
      driveType: z.enum(['FWD', 'RWD', 'AWD']),
      bodyStyle: z.string().optional(),
      numberOfDoors: z.number(),
      fuelType: z.string().optional(),
      manufacturerName: z.string().optional(),
      plantCountry: z.string().optional(),
      plantCity: z.string().optional(),
      gvwrClass: z.string().optional(),
      engineDisplacement: z.number().optional(),
      numberOfCylinders: z.number().optional(),
      lastDetailingDate: z.date().optional(),
    }),
  },
  handler: async (ctx, args) => {
    const { vin, data } = args;
    await ctx.db.insert('vehicleInfo', { vin, ...data });
  },
});

export const getVehicleInfo = query({
  args: { vin: z.string().optional(), customerId: z.string().optional() },
  handler: async (ctx, args) => {
    if (args.vin) {
      return await ctx.db.query('vehicleInfo').filter(q => q.eq('vin', args.vin)).first();
    } else if (args.customerId) {
      return await ctx.db.query('vehicleInfo').filter(q => q.eq('customerId', args.customerId)).first();
    }
  },
});

export const updateVehicleInfo = mutation({
  args: {
    vin: z.string(),
    data: z.object({
      make: z.string().optional(),
      model: z.string().optional(),
      year: z.number().optional(),
      mileage: z.number().optional(),
      exteriorColor: z.string().optional(),
      interiorColor: z.string().optional(),
      modifications: z.string().optional(),
      trimLevel: z.string().optional(),
      engineType: z.string().optional(),
      transmissionType: z.string().optional(),
      driveType: z.enum(['FWD', 'RWD', 'AWD']).optional(),
      bodyStyle: z.string().optional(),
      numberOfDoors: z.number().optional(),
      fuelType: z.string().optional(),
      manufacturerName: z.string().optional(),
      plantCountry: z.string().optional(),
      plantCity: z.string().optional(),
      gvwrClass: z.string().optional(),
      engineDisplacement: z.number().optional(),
      numberOfCylinders: z.number().optional(),
      lastDetailingDate: z.date().optional(),
    }),
  },
  handler: async (ctx, args) => {
    const { vin, data } = args;
    await ctx.db.patch('vehicleInfo', { vin, ...data });
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    vin: v.string(),
    licensePlate: v.string(),
  },
  handler: async (ctx, args) => {
    const existingVehicle = await ctx.db
      .query("vehicles")
      .withIndex("by_vin", (q) => q.eq("vin", args.vin))
      .first();

    if (existingVehicle) {
      throw new Error("Vehicle with this VIN already exists");
    }

    const vehicleId = await ctx.db.insert("vehicles", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
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
    licensePlate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args;
    await ctx.db.patch(id, { ...updateFields, updatedAt: Date.now() });
  },
});

export const list = query({
  args: { 
    organizationId: v.string(),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let vehiclesQuery = ctx.db
      .query("vehicles")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId));

    if (args.search) {
      vehiclesQuery = vehiclesQuery.search("search", args.search);
    }

    return await vehiclesQuery.collect();
  },
});

export const getById = query({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

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

export const getUserVehicles = query({
  args: { userId: z.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query('vehicles').filter(q => q.eq('userId', args.userId)).collect();
  },
});