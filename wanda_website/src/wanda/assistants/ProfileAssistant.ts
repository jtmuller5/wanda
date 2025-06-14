import { SearchTransfer } from "../transfers/SearchTransfer";
import { wandaUpdateProfileTool } from "../tools/wandaUpdateProfile";
import { wandaGetProfileTool } from "../tools/wandaGetProfile";
import { wandaUpdatePreferencesTool } from "../tools/wandaUpdatePreferences";
import type { OpenAIModel, SquadMemberDTO } from "@vapi-ai/web/dist/api";
import prompt from "./prompts/profile_prompt.txt?raw";

export const createProfileAssistant = (
  model: string,
  variableValues: Record<string, any>,
  modelProvider: string,
  host: string
): SquadMemberDTO => ({
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
    firstMessage: "I can help with that. What would you like to update in your profile?",
    firstMessageMode: "assistant-speaks-first",
    variableValues,
  },
});
