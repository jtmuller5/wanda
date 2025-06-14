import { Vapi } from "@vapi-ai/server-sdk";
import { wandaSearchMapsTool } from "../tools/wandaSearchMaps";
import { wandaCreateReviewTool } from "../tools/wandaCreateReview";
import { wandaSearchReviewsTool } from "../tools/wandaSearchReviews";
import { SearchTransfer } from "../transfers/SearchTransfer";
import { reviewPrompt } from "./prompts/review_prompt";

export const createReviewAssistant = (
  model: string,
  variableValues: Record<string, any>,
  modelProvider: "google" | "openai" = "google",
  host: string
): Vapi.SquadMemberDto => ({
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
          destinations: [
            {
              message: "",
              description: SearchTransfer.transferDescription,
              type: "assistant",
              assistantName: SearchTransfer.destinationAgent,
              transferMode: "swap-system-message-in-history",
            },
          ],
        },
        {
          type: "endCall",
          messages: [
            {
              type: "request-start",
              content: "Have a great day! Wanda, out."
            }
          ]
        },
      ],
      messages: [
        {
          role: "system",
          content: reviewPrompt,
        },
      ],
    } as Vapi.OpenAiModel,
    variableValues,
    firstMessageMode: "assistant-speaks-first-with-model-generated-message",
  },
});
