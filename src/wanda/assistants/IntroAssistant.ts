import { ProfileTransfer } from "../transfers/ProfileTransfer";
import { SearchTransfer } from "../transfers/SearchTransfer";
import { ReviewTransfer } from "../transfers/ReviewTransfer";
import { Vapi } from "@vapi-ai/server-sdk";
import * as fs from "fs";
import * as path from "path";

const promptFilePath = path.join(__dirname, "./prompts/intro_prompt.txt");
const prompt = fs.readFileSync(promptFilePath, "utf-8");

export const createIntroAssistant = (
  model: string,
  variableValues: Record<string, any>,
  modelProvider: string
): Vapi.SquadMemberDto => ({
  assistantId: "411ea1f5-bfae-4cfc-bf04-9dcfcdb5ddfd",
  assistantOverrides: {
    model: {
      model,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      tools: [
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
      ],
      provider: modelProvider,
    } as Vapi.OpenAiModel,
    variableValues,
    firstMessage: "Hello, this is Wanda. How can I help you today?",
  },
  /*  assistantDestinations: [
    {
      message: "",
      description: SearchTransfer.transferDescription,
      type: "assistant",
      assistantName: SearchTransfer.destinationAgent,
      transferMode: "swap-system-message-in-history",
    },
    {
      message: "",
      description: ProfileTransfer.transferDescription,
      type: "assistant",
      assistantName: ProfileTransfer.destinationAgent,
      transferMode: "swap-system-message-in-history",
    },
  ], */
});
