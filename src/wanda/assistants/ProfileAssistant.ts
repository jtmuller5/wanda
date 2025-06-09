import { Vapi } from "@vapi-ai/server-sdk";
import { SearchTransfer } from "../transfers/SearchTransfer";
import { wandaUpdateProfileTool } from "../tools/wandaUpdateProfile";
import { wandaGetProfileTool } from "../tools/wandaGetProfile";
import { wandaUpdatePreferencesTool } from "../tools/wandaUpdatePreferences";
import * as fs from "fs";
import * as path from "path";

const promptFilePath = path.join(__dirname, "./prompts/profile_prompt.txt");
const prompt = fs.readFileSync(promptFilePath, "utf-8");

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
        },
      ],
      messages: [
        {
          role: "system",
          content: prompt,
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
