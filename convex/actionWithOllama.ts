import { action } from "./_generated/server";
import { v } from "convex/values";
import { Configuration, ollamaApi } from "ollama";

const configuration = new Configuration({
  apiKey: process.env.OLLAMA_API_KEY,
});

const ollama = new ollamaApi(configuration);

export const actionWithOllama = action({
  args: {
    model: v.string(),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const { model, prompt } = args;

    try {
      const response = await ollama.createCompletion({
        model: model,
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.data.choices[0].text?.trim() || "";
    } catch (error) {
      console.error("Error calling Ollama API:", error);
      throw new Error("Failed to generate AI analysis");
    }
  },
});