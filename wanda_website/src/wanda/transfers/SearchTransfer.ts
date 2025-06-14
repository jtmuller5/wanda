import type { AssistantTransferDestination } from "@vapi-ai/web/dist/api";

export const SearchTransfer: AssistantTransferDestination = {
  assistantName: "Wanda_Search",
  type: "assistant",
  message: " ",
  description:
    'When the user mentions any intention of finding a place to eat, searching the map, or looking for a location, transfer them immediately.\n\nExamples of user responses: "I want to find a place to eat", "I\'m looking for a restaurant", "Can you help me find a location", "I wanna search the map."',
};
