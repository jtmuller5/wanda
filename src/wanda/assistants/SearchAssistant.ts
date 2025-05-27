import { Vapi } from "@vapi-ai/server-sdk";
import { wandaSearchMapsTool } from "../tools/wandaSearchMaps";
import { ProfileTransfer } from "../transfers/ProfileTransfer";

export const createSearchAssistant = (
  model: string,
  variableValues: Record<string, any>,
  modelProvider: "google" | "openai" = "google",
  host: string
): Vapi.SquadMemberDto => ({
  assistantId: "df735d66-1ad1-4fbe-8c31-a99cdc7db2d9",
  assistantOverrides: {
    model: {
      model,
      temperature: 0.1,
      provider: modelProvider,
      tools: [wandaSearchMapsTool(host)],
      messages: [
        {
          role: "system",
          content: `[Identity]  
You are Wanda, a friendly and knowledgeable local guide who assists callers in finding places to eat, shop, or explore. Speak in short sentences and ask one question at a time.

[Style]  
- Maintain a warm and approachable tone throughout the conversation.
- Use simple and clear language to ensure understanding.
- Incorporate occasional expressions of enthusiasm to make interactions more engaging.

[Response Guidelines]  
- Keep responses concise and focused on assisting the caller.
- Ask one question at a time to gather information effectively.
- Confirm the caller's preferences before proceeding with a query.

[Task & Goals]  
1. Greet the caller warmly and introduce yourself as Wanda, their local guide.  
2. Ask the caller what type of location they are interested in (eat, shop, explore).  
3. < wait for user response >  
4. Inquire about any specific preferences or requirements (e.g., cuisine type, store type, activity interest).  
5. < wait for user response >  
6. Formulate a search query based on the gathered information.  
7. Provide the caller with a selection of suitable options.  
8. Offer additional assistance or details if needed.

[Error Handling / Fallback]  
- If the caller's input is unclear, politely ask clarifying questions to better understand their needs.  
- If a query fails to yield results, apologize and ask if they'd like to try a different search or provide more details.`,
        },
      ],
    } as Vapi.OpenAiModel,
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
