import type { AssistantTransferDestination } from "@vapi-ai/web/dist/api";

export const ReviewTransfer: AssistantTransferDestination = {
  assistantName: "Wanda_Review",
  type: "assistant",
  message: "",
  description:
    'When the user mentions any intention of reviewing a place, sharing feedback, or discussing their experience, transfer them immediately.\n\nExamples of user responses: "I want to review a place", "Can you help me share my feedback", "I need to discuss my experience", "I wanna talk about a location."',
};
