import { wandaSearchMapsTool } from "../tools/wandaSearchMaps";
import { wandaCreateReviewTool } from "../tools/wandaCreateReview";
import { wandaSearchReviewsTool } from "../tools/wandaSearchReviews";
import { SearchTransfer } from "../transfers/SearchTransfer";
import type { OpenAIModel, SquadMemberDTO } from "@vapi-ai/web/dist/api";
import prompt from "./prompts/review_prompt.txt?raw";


export const createReviewAssistant = (
  model: string,
  variableValues: Record<string, any>,
  modelProvider: "google" | "openai" = "google",
  host: string
): SquadMemberDTO => ({
  assistantId: "9961e46d-69a6-43f5-87f5-07c2df78b68d",
  assistantOverrides: {
    model: {
      model,
      temperature: 0.1,
      provider: modelProvider,
      tools: [
        wandaSearchMapsTool(host),
        wandaCreateReviewTool(host),
        wandaSearchReviewsTool(host),
        {
          type: "transferCall",
          destinations: [SearchTransfer],
        },
        {
          type: "endCall",
          messages: [
            {
              type: "request-start",
              content: "Have a great day! Wanda, out.",
            },
          ],
        },
      ],
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    } as OpenAIModel,
    variableValues,
    firstMessage: "",
    firstMessageMode: "assistant-speaks-first",
  },
});
