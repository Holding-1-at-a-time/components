import { AnyDataModel, GenericActionCtx, GenericDatabaseWriter } from "convex/server";
import { mutation, action } from "./_generated/server";
import { v } from "convex/values";

interface CustomActionCtx extends GenericActionCtx<AnyDataModel> {
  db: GenericDatabaseWriter<AnyDataModel>;
}

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const saveFile = mutation({
  args: { 
    storageId: v.id("storage"),
    fileName: v.string(),
    fileType: v.string(),
  },
  handler: async (ctx, args) => {
    const { storageId, fileName, fileType } = args;
    
    // Save the file metadata to your database
    const fileId = await ctx.db.insert("files", {
      storageId,
      fileName,
      fileType,
      uploadedAt: new Date().toISOString()
    });

    return fileId;
  }
});

export const getFileUrl = action({
  args: { fileId: v.id("files") },
  handler: async (ctx: CustomActionCtx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }
    return ctx.storage.getUrl(file.storageId);
  }
});