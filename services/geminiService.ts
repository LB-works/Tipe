
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants.tsx";

export const refineTranscript = async (rawText: string): Promise<string> => {
  if (!rawText.trim()) return "";

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure the environment is configured correctly.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const model = ai.models.get('gemini-1.5-flash');
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: rawText }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text?.trim() || "Could not refine the text. Please try again.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to refine the transcript. " + (error.message || "Please check your connection."));
  }
};
