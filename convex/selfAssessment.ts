import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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
    customizations: v.array(v.object({
      name: v.string(),
      price: v.number(),
    })),
    hotspots: v.array(v.object({
      part: v.string(),
      issue: v.string(),
    })),
    images: v.array(v.id("_storage")),
    videos: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { organizationId, vehicleDetails, selectedServices, customizations, hotspots, images, videos } = args;

    // Check if the user has permission to create a self-assessment
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized: User must be logged in");
    }
    const userId = identity.subject;

    const userRole = await ctx.db
      .query("userRoles")
      .withIndex("by_user_and_org", (q) =>
        q.eq("userId", userId).eq("organizationId", organizationId)
      )
      .unique();

    if (!userRole || !userRole.permissions.includes("create:self-assessment")) {
      throw new ConvexError("Unauthorized: User doesn't have permission to create self-assessments");
    }

    // Validate services
    const validServices = await ctx.db
      .query("services")
      .filter((q) => q.in(q.field("_id"), selectedServices))
      .collect();

    if (validServices.length !== selectedServices.length) {
      throw new ConvexError("Invalid services selected");
    }

    // Create self-assessment
    const selfAssessmentId = await ctx.db.insert("selfAssessments", {
      organizationId,
      vehicleDetails,
      selectedServices,
      customizations,
      hotspots,
      imageIds: images,
      videoIds: videos,
      status: "Pending",
      createdBy: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Schedule AI estimation
    const aiEstimation = await ctx.scheduler.runAfter(0, "generateAIEstimation", { selfAssessmentId });

    // Store AI estimation result in form data
    ctx.db.patch(selfAssessmentId, { estimatedTotal: aiEstimation.estimatedTotal });

    return selfAssessmentId;
  },
});