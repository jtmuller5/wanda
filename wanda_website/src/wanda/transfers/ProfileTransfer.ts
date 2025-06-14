import type { AssistantTransferDestination } from "@vapi-ai/web/dist/api";

export const ProfileTransfer: AssistantTransferDestination = {
  assistantName: "Wanda_Profile",
  type: "assistant",
  message: "",
  description:
    'When the user mentions any intention of updating their profile, preferences, or settings, transfer them immediately.\n\nExamples of user responses: "I want to update my profile", "Can you help me change my preferences", "I need to adjust my settings", "I wanna modify my account information."',
};
