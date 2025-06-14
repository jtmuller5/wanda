import { wandaSearchMapsTool } from "../tools/wandaSearchMaps";
import { wandaSendDirectionsTool } from "../tools/wandaSendDirections";
import { ProfileTransfer } from "../transfers/ProfileTransfer";
import { ReviewTransfer } from "../transfers/ReviewTransfer";
import { wandaGetPlaceDetailsTool } from "../tools/wandaGetPlaceDetails";
import type { OpenAIModel, SquadMemberDTO } from "@vapi-ai/web/dist/api";
import prompt from "./prompts/search_prompt.txt?raw";


export const createSearchAssistant = (
  model: string,
  variableValues: Record<string, any>,
  modelProvider: "google" | "openai" = "google",
  host: string
): SquadMemberDTO => ({
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
          destinations: [ProfileTransfer, ReviewTransfer, ProfileTransfer],
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
    firstMessageMode: "assistant-speaks-first",
  },
});
