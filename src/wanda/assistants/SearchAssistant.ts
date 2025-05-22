import { Assistant } from "../../types";
import { wandaSearchMapsTool } from "../tools/wandaSearchMaps";
import { ProfileTransfer } from "../transfers/ProfileTransfer";

export const createSearchAssistant = (
  model: string,
  variableValues: Record<string, any>,
  modelProvider: "google" | "openai" = "google"
): Assistant => ({
  assistantId: "df735d66-1ad1-4fbe-8c31-a99cdc7db2d9",
  assistantOverrides: {
    model: {
      model,
      temperature: 0.1,
      provider: modelProvider,
      tools: [wandaSearchMapsTool],
    },
    variableValues,
    firstMessageMode: "assistant-speaks-first-with-model-generated-message",
  },
  assistantDestinations: [
    {
      message: "",
      description: ProfileTransfer.transferDescription,
      type: "assistant",
      assistantName: ProfileTransfer.destinationAgent,
      transferMode: "swap-system-message-in-history",
    },
  ],
});
