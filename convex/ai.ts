// import * as tf from '@tensorflow/tfjs-node';
import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
// import { actionWithOllama } from "./actionWithOllama";
import { fileStorage } from "@/convex/fileStorage";


export const getAnalysis = mutation({
  args: {
    organizationId: v.string(),
    vehicleDetails: v.object({
      id: v.string(),
      make: v.string(),
      model: v.string(),
      year: v.number(),
      condition: v.string(),
    }),
    selectedServices: v.array(v.id("services")),
    customizations: v.array(v.id("customizations")),
    uploadedFileIds: v.array(v.id("files")),
  },
  handler: async (ctx, args) => {
    const { organizationId, vehicleDetails, selectedServices, customizations, uploadedFileIds } = args;

    // Fetch additional data
    const services = await Promise.all(selectedServices.map(id => ctx.db.get(id)));
    const customizationDetails = await Promise.all(customizations.map(id => ctx.db.get(id)));
    const files = await Promise.all(uploadedFileIds.map(id => ctx.db.get(id)));

    // Prepare input for AI model
    const input = {
      vehicleDetails,
      services: services.map(s => ({ name: s?.name, price: s?.basePrice })),
      customizations: customizationDetails.map(c => ({ name: c?.name, price: c?.price })),
      fileCount: files.length,
    };

    // Call AI model
    const analysis = await actionWithOllama({
      model: "auto-detailing-estimator",
      prompt: JSON.stringify(input),
    });

    // Parse AI model output
    const { estimatedTotal, detailedAnalysis } = JSON.parse(analysis);

    // Save analysis to database
    await ctx.db.insert("aiAnalyses", {
      organizationId,
      vehicleId: vehicleDetails.id,
      analysis: detailedAnalysis,
      estimatedTotal,
      createdAt: new Date().toISOString(),
    });

    return { estimatedTotal, analysis: detailedAnalysis };
  },
});

export const getCachedAnalysis = query({
  args: {
    organizationId: v.string(),
    vehicleId: v.string(),
  },
  handler: async (ctx, args) => {
    const { organizationId, vehicleId } = args;

    const cachedAnalysis = await ctx.db
      .query("aiAnalyses")
      .withIndex("by_org_and_vehicle", (q) => 
        q.eq("organizationId", organizationId).eq("vehicleId", vehicleId)
      )
      .order("desc")
      .first();

    return cachedAnalysis;
  },
});


let model: tf.LayersModel;

export const loadModel = action({
  handler: async () => {
    model = await tf.loadLayersModel('https://storage.googleapis.com/your-bucket/model.json');
  },
});

export const analyzeVehicleImage = action({
  args: { imageUrl: v.string() },
  handler: async (ctx, args) => {
    if (!model) {
      await loadModel();
    }

    const [file] = await fileStorage.file(args.imageUrl).download();
    const image = await tf.node.decodeImage(file, 3);
    const resized = tf.image.resizeBilinear(image, [224, 224]);
    const expanded = resized.expandDims(0);
    const normalized = expanded.div(255.0);

    const prediction = model.predict(normalized) as tf.Tensor;
    const conditionIndex = prediction.argMax(1).dataSync()[0];
    const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

    return conditions[conditionIndex];
  },
});

export const generateQuote = action({
  args: {
    condition: v.string(),
    make: v.string(),
    model: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    // This is a simplified pricing model. In a real-world scenario, you'd want to use
    // a more sophisticated algorithm or machine learning model for pricing.
    const basePrice = 100;
    const conditionMultiplier = {
      'Excellent': 1.5,
      'Good': 1.2,
      'Fair': 1,
      'Poor': 0.8,
    }[args.condition] || 1;

    const yearFactor = Math.max(0, (new Date().getFullYear() - args.year) / 10);
    const agePriceAdjustment = basePrice * yearFactor * 0.1;

    const estimatedPrice = (basePrice + agePriceAdjustment) * conditionMultiplier;

    return Math.round(estimatedPrice);
  },
});