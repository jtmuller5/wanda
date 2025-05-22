import { Assistant } from "../../types";
import { SearchTransfer } from "../transfers/SearchTransfer";

export const createProfileAssistant = (
  model: string,
  variableValues: Record<string, any>,
  modelProvider: "google" | "openai" = "google"
): Assistant => ({
  assistantId: "956defaf-a85c-4223-8e52-b6c4a7904ff0",
  assistantOverrides: {
    model: {
      model,
      temperature: 0.1,
      provider: modelProvider,
    },
    firstMessageMode: "assistant-speaks-first-with-model-generated-message",
    variableValues,
  },
  assistantDestinations: [
    {
      message: "",
      description: SearchTransfer.transferDescription,
      type: "assistant",
      assistantName: SearchTransfer.destinationAgent,
      transferMode: "swap-system-message-in-history",
    },
  ],
});
