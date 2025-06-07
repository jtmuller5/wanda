import { z } from "zod";

export abstract class AIModel {
  abstract generateResponse(prompt: string): Promise<string>;
  abstract generateStructuredResponse({
    prompt,
    schema,
  }: {
    prompt: string;
    schema: z.ZodTypeAny;
  }): Promise<z.infer<z.ZodTypeAny>>;
}
