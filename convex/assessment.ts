import { uploadFile } from "@/lib/fileUpload";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { actionWithOllama } from "./actionWithOllama";
import { analyzeVehicleImage, generateQuote } from "./ai";

export const createAssessment = mutation({
  args: {
    organizationId: v.id("organization"),
    vehicleDetails: v.object({
      make: v.string(),
      model: v.string(),
      year: v.number(),
      vin: v.string(),
      color: v.string(),
      bodyType: v.string(),
      condition: v.string(),
    }),
    selectedServices: v.array(v.id("services")),
    customizations: v.array(v.object({
      name: v.string(),
      price: v.number(),
    })),
    images: v.array(v.string()),
    videos: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, vehicleDetails, selectedServices, customizations, images, videos } = args;

    // Generate AI estimation
    const aiEstimation = await actionWithOllama({
      model: "auto-detailing-estimator",
      prompt: JSON.stringify({
        vehicleDetails,
        services: selectedServices,
        customizations,
        fileCount: images.length + videos.length,
      }),
    });

    const { estimatedTotal, detailedAnalysis } = JSON.parse(aiEstimation);

    // Create assessment
    const assessmentId = await ctx.db.insert("assessments", {
      organizationId,
      vehicleDetails,
      selectedServices,
      customizations,
      images,
      videos,
      aiEstimation: {
        estimatedTotal,
        detailedAnalysis,
      },
      createdAt: () => new Date().toISOString(),
    });

    // Save AI analysis
    await ctx.db.insert("aiAnalyses", {
      organizationId,
      vehicleId: vehicleDetails.vin,
      analysis: detailedAnalysis,
      estimatedTotal,
      createdAt: () => new Date().toISOString(),
    });

    return assessmentId;
  },
});

export const create = mutation({
  args: {
    organizationId: v.id("organization"),
    vehicleMake: v.string(),
    vehicleModel: v.string(),
    vehicleYear: v.number(),
    imageUrl: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const condition = await analyzeVehicleImage(args.imageUrl);
    const estimatedPrice = generateQuote(condition, args.vehicleMake, args.vehicleModel, args.vehicleYear);

    const assessmentId = await ctx.db.insert("assessments", {
      ...args,
      condition,
      estimatedPrice,
      createdBy: args.userId,
      createdAt: () => new Date().toISOString(),
      updatedAt: () => new Date().toISOString(),
    });

    return assessmentId;
  },
});

export const getByOrganization = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    const assessments = await ctx.db
      .query("assessments")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect();

    return assessments;
  },
});