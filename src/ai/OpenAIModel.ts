import OpenAI from "openai";
import { AIModel } from "./AIModel";
import { ZodTypeAny, TypeOf } from "zod";

export class OpenAIModel extends AIModel {
  async generateResponse(prompt: string): Promise<string> {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-2024-11-20",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      });
      return response.choices[0].message.content ?? "";
    } catch (error) {
      console.error("Error generating response with OpenAI:", error);
      throw error;
    }
  }

  generateStructuredResponse({
    prompt,
    schema,
  }: {
    prompt: string;
    schema: ZodTypeAny;
  }): Promise<TypeOf<ZodTypeAny>> {
    throw new Error("Method not implemented.");
  }
}
