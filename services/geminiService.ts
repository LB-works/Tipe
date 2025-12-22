
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../constants.tsx";

export const refineTranscript = async (rawText: string): Promise<string> => {
  if (!rawText.trim()) return "";

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure the environment is configured correctly.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const modelName = "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(rawText);
    const response = result.response;
    return response.text()?.trim() || "Could not refine the text.";
  } catch (error: any) {
    if (error.message?.includes("404") || error.message?.includes("not found")) {
      console.warn("Gemini 1.5 Flash failed, falling back to Gemini Pro");
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        // gemini-pro doesn't support systemInstruction in the same way sometimes, so we include it in prompt
        const fallbackPrompt = `${SYSTEM_PROMPT}\n\nUser Input:\n${rawText}`;
        const result = await fallbackModel.generateContent(fallbackPrompt);
        return result.response.text()?.trim() || "Could not refine text (fallback).";
      } catch (fallbackError: any) {
        throw new Error("Both Gemini Flash and Pro failed. " + fallbackError.message);
      }
    }
    throw new Error("Failed to refine: " + error.message);
  }
};
