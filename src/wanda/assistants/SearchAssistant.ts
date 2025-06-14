import { Vapi } from "@vapi-ai/server-sdk";
import { wandaSearchMapsTool } from "../tools/wandaSearchMaps";
import { wandaSendDirectionsTool } from "../tools/wandaSendDirections";
import { ProfileTransfer } from "../transfers/ProfileTransfer";
import { ReviewTransfer } from "../transfers/ReviewTransfer";
import { wandaGetPlaceDetailsTool } from "../tools/wandaGetPlaceDetails";
import { searchPrompt } from "./prompts/search_prompt";

export const createSearchAssistant = (
  model: string,
  variableValues: Record<string, any>,
  modelProvider: "google" | "openai" = "google",
  host: string
): Vapi.SquadMemberDto => ({
  assistantId: "df735d66-1ad1-4fbe-8c31-a99cdc7db2d9",
  assistantOverrides: {
    model: {
      model,
      temperature: 0.1,
      provider: modelProvider,
      tools: [
        wandaSearchMapsTool(host),
        wandaSendDirectionsTool(host),
        wandaGetPlaceDetailsTool(host),
        {
          type: "transferCall",
          destinations: [
            {
              message: "",
              description: ProfileTransfer.transferDescription,
              type: "assistant",
              assistantName: ProfileTransfer.destinationAgent,
              transferMode: "swap-system-message-in-history",
            },
            {
              message: "",
              description: ReviewTransfer.transferDescription,
              type: "assistant",
              assistantName: ReviewTransfer.destinationAgent,
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
          content: searchPrompt,
        },
      ],
    } as Vapi.OpenAiModel,
    variableValues,
    firstMessageMode: "assistant-speaks-first-with-model-generated-message",
  },
});
