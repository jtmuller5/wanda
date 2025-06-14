import { Vapi } from "@vapi-ai/server-sdk";

export function wandaUpdatePreferencesTool(
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
      name: "wandaUpdatePreferences",
      description: "Add or remove preferences from the caller's profile. Use this for managing arrays of preferences like food types, cuisines, activities, etc.",
      parameters: {
        type: "object",
        properties: {
          preferenceType: {
            type: "string",
            enum: ["food", "activities", "shopping", "entertainment"],
            description: "The type of preferences to update (food, activities, shopping, entertainment).",
          },
          action: {
            type: "string",
            enum: ["add", "remove", "replace"],
            description: "Whether to add new preferences, remove existing ones, or replace all preferences of this type.",
          },
          preferences: {
            type: "array",
            items: {
              type: "string"
            },
            description: "List of preferences to add, remove, or use as replacement (e.g., ['Italian', 'Vegetarian', 'Spicy food']).",
          },
        },
        required: ["preferenceType", "action", "preferences"],
      },
    },
  };
}
