// convex/selfAssessments.ts

import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { actionWithOllama } from "./actionWithOllama";
import { generateUploadUrl, storageClient } from './fileStorage';
import { loggers } from "winston";

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

export const createSelfAssessment = mutation({
  args: {
    organizationId: v.string(),
    vehicleDetails: v.object({
      make: v.string(),
      model: v.string(),
      year: v.string(),
      condition: v.string(),
    }),
    selectedServices: v.array(v.id("services")),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, vehicleDetails, selectedServices, images } = args;

    // Check if the user has permission to create a self-assessment
    const { userId } = await ctx.auth.getUserIdentity() ?? {};
    if (!userId) {
      throw new ConvexError("Unauthorized: User must be logged in");
    }

    const userRole = await ctx.db
      .query("userRoles")
      .withIndex("by_user_and_org", (q) =>
        q.eq("userId", userId).eq("organizationId", organizationId)
      )
      .unique();

    if (!userRole || !userRole.permissions.includes("create:self-assessment")) {
      throw new ConvexError("Unauthorized: User doesn't have permission to create self-assessments");
    }

    // Upload images
    const imageUrls = await Promise.all(images.map(async (image) => {
      const uploadUrl = await generateUploadUrl();
      await storageClient.uploadToUrl(uploadUrl, image);
      return storageClient.getPublicUrl(uploadUrl);
    }));

    // Create self-assessment
    const selfAssessmentId = await ctx.db.insert("selfAssessments", {
      organizationId,
      vehicleDetails,
      selectedServices,
      imageUrls,
      status: "Pending",
      createdBy: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Schedule AI estimation
    await ctx.scheduler.runAfter(0, "generateAIEstimation", { selfAssessmentId });

    return selfAssessmentId;
  },
});
export const generateAIEstimation = action({
  args: { selfAssessmentId: v.id("selfAssessments") },
  handler: async (ctx, args) => {
    const { selfAssessmentId } = args;

    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        const selfAssessment = await ctx.db.get(args.selfAssessmentId);

        if (!selfAssessment) {
          throw new Error("Self-assessment not found");
        }

        const aiEstimation = await actionWithOllama({
          model: "auto-detailing-estimator",
          prompt: JSON.stringify({
            vehicleDetails: selfAssessment.vehicleDetails,
            services: selfAssessment.selectedServices,
            imageCount: selfAssessment.imageUrls.length,
          }),
        });

        const { estimatedTotal, detailedAnalysis } = JSON.parse(aiEstimation);

        await ctx.db.patch(selfAssessmentId, {
          aiEstimation: {
            estimatedTotal,
            detailedAnalysis,
          },
          status: "Completed",
          updatedAt: Date.now(),
        });

        return;
      } catch (error) {
        retries++;
        if (retries < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        } else {
          await ctx.db.patch(selfAssessmentId, {
            status: "Failed",
            errorMessage: "AI estimation failed after multiple attempts",
            updatedAt: Date.now(),
          });
          throw new Error("AI estimation failed after maximum retries");
        }
      }
    }
  },
});

export const getSelfAssessment = query({
  args: { id: v.id("selfAssessments") },
  handler: async (ctx, args) => {
    const { userId } = await ctx.auth.getUserIdentity() ?? {};

    if (!userId) {
      throw new ConvexError("Unauthorized: User must be logged in");
    }

    const selfAssessment = await ctx.db.get(args.id);

    if (!selfAssessment) {
      throw new ConvexError("Self-assessment not found");
    }

    const userRole = await ctx.db
      .query("userRoles")
      .withIndex("by_user_and_org", (q) =>
        q.eq("userId", userId).eq("organizationId", selfAssessment.organizationId)
      )
      .unique();

    if (!userRole || (!userRole.permissions.includes("view:self-assessment") && selfAssessment.createdBy !== userId)) {
      throw new ConvexError("Unauthorized: User doesn't have permission to view this self-assessment");
    }

    return selfAssessment;
  },
});
export const listSelfAssessments = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await ctx.auth.getUserIdentity() ?? {};
    if (!userId) {
      throw new ConvexError("Unauthorized: User must be logged in");
    }

    const userRole = await ctx.db
      .query("userRoles")
      .withIndex("by_user_and_org", (q) =>
        q.eq("userId", userId).eq("organizationId", args.organizationId)
      )
      .unique();

    if (!userRole || !userRole.permissions.includes("view:self-assessment")) {
      throw new ConvexError("Unauthorized: User doesn't have permission to list self-assessments");
    }

    return await ctx.db
      .query("selfAssessments")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .order("desc")
      .collect();
  },
});

export const createSelfAssessment = mutation({
  args: {
    organizationId: v.string(),
    vehicleDetails: v.object({
      make: v.string(),
      model: v.string(),
      year: v.string(),
      condition: v.string(),
    }),
    selectedServices: v.array(v.id("services")),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, vehicleDetails, selectedServices, images } = args;

    // Upload images
    const imageUrls = await Promise.all(images.map(async (image) => {
      const uploadUrl = await generateUploadUrl();
      await storageClient.uploadToUrl(uploadUrl, image);
      return storageClient.getPublicUrl(uploadUrl);
    }));

    // Create self-assessment
    const selfAssessmentId = await ctx.db.insert("selfAssessments", {
      organizationId,
      vehicleDetails,
      selectedServices,
      imageUrls,
      status: "Pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    const aiEstimation = await actionWithOllama({
  model: "auto-detailing-estimator",
  prompt: JSON.stringify({
    vehicleDetails,
    services: selectedServices,
    imageCount: images.length,
  }),
});
    // Update self-assessment with AI estimation
    await ctx.db.patch(selfAssessmentId, {
      aiEstimation: {
        estimatedTotal,
        detailedAnalysis,
      },
      status: "Completed",
      updatedAt: Date.now(),
    });

    return selfAssessmentId;
  },
});