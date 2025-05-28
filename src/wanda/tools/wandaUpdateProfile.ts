import { Vapi } from "@vapi-ai/server-sdk";

export function wandaUpdateProfileTool(
  host: string
): Vapi.OpenAiModelToolsItem {
  return {
    type: "function",
    async: true,
    server: {
      url: host + "/events",
      headers: {
        "Content-Type": "application/json",
      },
    },
    function: {
      name: "wandaUpdateProfile",
      description: "Update the caller's profile with new information like name, city, or food preferences.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The caller's name.",
          },
          city: {
            type: "string",
            description: "The caller's city or location.",
          },
          foodPreferences: {
            type: "array",
            items: {
              type: "string"
            },
            description: "List of food preferences or cuisines the caller likes (e.g., 'Italian', 'Vegetarian', 'Spicy food').",
          },
          addToFoodPreferences: {
            type: "boolean",
            description: "Whether to add to existing food preferences (true) or replace them (false). Defaults to true.",
          },
        },
        required: [],
      },
    },
  };
}
