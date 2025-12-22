
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
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(rawText);
    const response = result.response;
    const text = response.text();

    return text?.trim() || "Could not refine the text. Please try again.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to refine the transcript. " + (error.message || "Please check your connection."));
  }
};
