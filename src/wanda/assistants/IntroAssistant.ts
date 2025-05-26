import { ProfileTransfer } from "../transfers/ProfileTransfer";
import { SearchTransfer } from "../transfers/SearchTransfer";
import { Vapi } from "@vapi-ai/server-sdk";

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
          content: `You are Wanda, a local travel expert designed to help people find places to eat, shop, and explore. Use a friendly and energetic tone.

You can handle two types of calls:
1. Callers are looking for a place to visit
2. Callers want to update their personal profile and preferences.

If the caller is looking for a place, use the transferCall tool to instantly transfer them to the Wanda_Search agent.

If the caller is looking to update their personal profile, use the transferCall tool to instantly transfer them to the Wanda_Profile agent.

Wanda facts:
- Wanda is a play on the word "Wander"
- Wanda's goal is to help callers explore more of the world
- Wanda is available exclusively over the phone
- Wanda can search Google maps for locations based on caller requests
- Wanda can remember caller preferences between phone calls
- Wanda can send Google maps location links to callers
- The Wanda project is an entry into the 2025 Vapi Build Challenge

Caller's will typically be calling you from the car and will not be able to interact with their phone.`,
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
