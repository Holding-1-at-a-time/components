import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
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
  handler: async (ctx, args: {
    make: string,
    model: string,
    year: number,
    vin: string,
    mileage: number,
    exteriorColor: string,
    interiorColor: string,
    modifications?: string,
    trimLevel?: string,
    engineType?: string,
    transmissionType?: string,
    driveType: 'FWD' | 'RWD' | 'AWD',
    bodyStyle?: string,
    numberOfDoors: number,
    fuelType?: string,
    manufacturerName?: string,
    plantCountry?: string,
    plantCity?: string,
    gvwrClass?: string,
    engineDisplacement?: number,
    numberOfCylinders?: number,
    lastDetailingDate?: Date,
  }): Promise<string> => {
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
  handler: async (ctx, args: {
    id: string,
    make?: string,
    model?: string,
    year?: number,
    vin?: string,
    mileage?: number,
    exteriorColor?: string,
    interiorColor?: string,
    modifications?: string,
    trimLevel?: string,
    engineType?: string,
    transmissionType?: string,
    driveType?: 'FWD' | 'RWD' | 'AWD',
    bodyStyle?: string,
    numberOfDoors?: number,
    fuelType?: string,
    manufacturerName?: string,
    plantCountry?: string,
    plantCity?: string,
    gvwrClass?: string,
    engineDisplacement?: number,
    numberOfCylinders?: number,
    lastDetailingDate?: Date,
  }): Promise<void> => {
    const { id, ...updateFields } = args;
    await ctx.db.patch(id, updateFields);
  },
});

export const getVehicleByVIN = query({
  args: { vin: z.string() },
  handler: async (ctx, args: { vin: string }): Promise<| { vin: string } | undefined> => {
    return await ctx.db.query('vehicles').filter(q => q.eq('vin', args.vin)).first();
  },
});

export const getVehicleMakes = query({
  handler: async (ctx): Promise<string[]> => {
    return (await ctx.db.query('vehicles').collect()).map(vehicle => vehicle.make);
  }
});

export const getVehicleModels = query({
  args: { make: z.string() },
  handler: async (ctx, args: { make: string }): Promise<string[]> => {
    const models = (await ctx.db.query('vehicles').filter(q => q.eq('make', args.make)).collect()).map(vehicle => vehicle.model);
    return Array.from(new Set(models));
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
  handler: async (ctx, args: {
    vin: string,
    data: {
      make: string,
      model: string,
      year: number,
      mileage: number,
      exteriorColor: string,
      interiorColor: string,
      modifications?: string,
      trimLevel?: string,
      engineType?: string,
      transmissionType?: string,
      driveType: 'FWD' | 'RWD' | 'AWD',
      bodyStyle?: string,
      numberOfDoors: number,
      fuelType?: string,
      manufacturerName?: string,
      plantCountry?: string,
      plantCity?: string,
      gvwrClass?: string,
      engineDisplacement?: number,
      numberOfCylinders?: number,
      lastDetailingDate?: Date,
    },
  }): Promise<void> => {
    const { vin, data } = args;
    await ctx.db.insert('vehicleInfo', { vin, ...data });
  },
});

export const getVehicleInfo = query({
  args: { vin: z.string().optional(), customerId: z.string().optional() },
  handler: async (ctx, args: { vin?: string, customerId?: string }): Promise<| { vin: string } | undefined> => {
    if (args.vin) {
      return await ctx.db.query('vehicleInfo').filter(q => q.eq('vin', args.vin)).first();
    } else if (args.customerId) {
      return await ctx.db.query('vehicleInfo').filter(q => q.eq('customerId', args.customerId)).first();
    }
  },
});

export const create = mutation({
  args: {
    organizationId: v.id('organization'),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    vin: v.string(),
    licensePlate: v.string(),
  },
  handler: async (ctx, args: {
    organizationId: string,
    make: string,
    model: string,
    year: number,
    vin: string,
    licensePlate: string,
  }): Promise<string> => {
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
  handler: async (ctx, args: {
    id: string,
    make?: string,
    model?: string,
    year?: number,
    licensePlate?: string,
  }): Promise<void> => {
    const { id, ...updateFields } = args;
    await ctx.db.patch(id, { ...updateFields, updatedAt: Date.now() });
  },
});

export const list = query({
  args: {
    organizationId: v.id('organization'),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args: {
    organizationId: string,
    search?: string,
  }): Promise<{ make: string, model: string, year: number, vin: string, licensePlate: string }[]> => {
    let vehiclesQuery = ctx.db
      .query("vehicles")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId));

    if (args.search) {
      vehiclesQuery = vehiclesQuery.search("search", args.search);
    }

    return await vehiclesQuery.collect();
  }
});