import { Vapi } from "@vapi-ai/server-sdk";
import { SearchTransfer } from "../transfers/SearchTransfer";
import { wandaUpdateProfileTool } from "../tools/wandaUpdateProfile";
import { wandaGetProfileTool } from "../tools/wandaGetProfile";
import { wandaUpdatePreferencesTool } from "../tools/wandaUpdatePreferences";
import { profilePrompt } from "./prompts/profile_prompt";

export const createProfileAssistant = (
  model: string,
  variableValues: Record<string, any>,
  modelProvider: string,
  host: string
): Vapi.SquadMemberDto => ({
  assistantId: "956defaf-a85c-4223-8e52-b6c4a7904ff0",
  assistantOverrides: {
    model: {
      model,
      temperature: 0.1,
      provider: modelProvider,
      tools: [
        wandaUpdateProfileTool(host),
        wandaGetProfileTool(host),
        wandaUpdatePreferencesTool(host),
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
          content: profilePrompt,
        },
      ],
    } as Vapi.OpenAiModel,
    firstMessageMode: "assistant-speaks-first-with-model-generated-message",
    variableValues,
  },
  /* assistantDestinations: [
    {
      message: "",
      description: SearchTransfer.transferDescription,
      type: "assistant",
      assistantName: SearchTransfer.destinationAgent,
      transferMode: "swap-system-message-in-history",
    },
  ], */
});
