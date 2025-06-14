import { ProfileTransfer } from "../transfers/ProfileTransfer";
import { SearchTransfer } from "../transfers/SearchTransfer";
import { ReviewTransfer } from "../transfers/ReviewTransfer";
import type { SquadMemberDTO, OpenAIModel } from "@vapi-ai/web/dist/api";
import prompt from "./prompts/intro_prompt.txt?raw";

export const createIntroAssistant = (
  model: string,
  variableValues: Record<string, any>,
  modelProvider: string
): SquadMemberDTO => ({
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
          destinations: [SearchTransfer, ProfileTransfer, ReviewTransfer],
        },
      ],
      provider: modelProvider,
    } as OpenAIModel,
    variableValues,
    firstMessage: "Hello, this is Wanda. How can I help you today?",
  },
});
