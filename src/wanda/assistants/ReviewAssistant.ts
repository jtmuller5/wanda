import { Vapi } from "@vapi-ai/server-sdk";
import { wandaSearchMapsTool } from "../tools/wandaSearchMaps";
import { wandaSendDirectionsTool } from "../tools/wandaSendDirections";
import { wandaGetPlaceDetailsTool } from "../tools/wandaGetPlaceDetails";
import { wandaCreateReviewTool } from "../tools/wandaCreateReview";
import * as fs from "fs";
import * as path from "path";
import { SearchTransfer } from "../transfers/SearchTransfer";

const promptFilePath = path.join(__dirname, "./prompts/review_prompt.txt");
const prompt = fs.readFileSync(promptFilePath, "utf-8");

export const createReviewAssistant = (
  model: string,
  variableValues: Record<string, any>,
  modelProvider: "google" | "openai" = "google",
  host: string
): Vapi.SquadMemberDto => ({
  assistantId: "9961e46d-69a6-43f5-87f5-07c2df78b68d",
  assistantOverrides: {
    model: {
      model,
      temperature: 0.1,
      provider: modelProvider,
      tools: [
        wandaSearchMapsTool(host),
        wandaCreateReviewTool(host),
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
      ],
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    } as Vapi.OpenAiModel,
    variableValues,
    firstMessageMode: "assistant-speaks-first-with-model-generated-message",
  },
});
