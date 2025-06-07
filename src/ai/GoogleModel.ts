import { GoogleGenAI } from "@google/genai";
import { AIModel } from "./AIModel";
import { z } from "zod";
import { toGeminiSchema } from "gemini-zod";

export class GoogleModel extends AIModel {
  async generateResponse(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        config: {
          temperature: 0.1,
        },
        contents: prompt,
      });
      return response.text ?? "";
    } catch (error) {
      console.error("Error generating response in base_agent:", error);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-05-20",
        config: {
          temperature: 0.1,
        },
        contents: prompt,
      });
      return response.text ?? "";
    }
  }

  async generateStructuredResponse({
    prompt,
    schema,
  }: {
    prompt: string;
    schema: z.ZodTypeAny;
  }): Promise<z.infer<z.ZodTypeAny>> {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: toGeminiSchema(schema),
      },
      contents: prompt,
    });
    return JSON.parse(response.text ?? "{}") as z.infer<z.ZodTypeAny>;
  }
}
