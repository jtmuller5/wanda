import { GoogleModel } from "./GoogleModel";
import { OpenAIModel } from "./OpenAIModel";
import { z } from "zod";

export async function generateAIResponse({
  prompt,
  provider,
}: {
  prompt: string;
  provider: "google" | "openai";
}): Promise<string> {
  let response = "";
  switch (provider) {
    case "google":
      response = await new GoogleModel().generateResponse(prompt);
      break;
    case "openai":
      response = await new OpenAIModel().generateResponse(prompt);
      break;
    default:
      console.error("Unsupported provider:", provider);
      response = await new GoogleModel().generateResponse(prompt);
      break;
  }

  return response;
}

export function generateStructuredAIResponse({
  prompt,
  schema,
  provider,
}: {
  prompt: string;
  schema: z.ZodTypeAny;
  provider: "google" | "openai";
}): Promise<z.infer<z.ZodTypeAny>> {
  switch (provider) {
    case "google":
      return new GoogleModel().generateStructuredResponse({ prompt, schema });
    case "openai":
      return new OpenAIModel().generateStructuredResponse({ prompt, schema });
    default:
      console.error("Unsupported provider:", provider);
      return new GoogleModel().generateStructuredResponse({ prompt, schema });
  }
}
