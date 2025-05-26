import { Assistant } from "../../types";
import { ProfileTransfer } from "../transfers/ProfileTransfer";
import { SearchTransfer } from "../transfers/SearchTransfer";

export const createIntroAssistant = (
  model: string,
  variableValues: Record<string, any>,
  modelProvider: "google" | "openai" = "google"
): Assistant => ({
  assistantId: "411ea1f5-bfae-4cfc-bf04-9dcfcdb5ddfd",
  assistantOverrides: {
    model: {
      model,
      temperature: 0,
      provider: modelProvider,
    },
    variableValues,
    firstMessage: "Hello, this is Wanda. How can I help you today?",
  },
  assistantDestinations: [
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
  ],
});
