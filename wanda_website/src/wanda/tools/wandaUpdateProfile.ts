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
      description: "Update the caller's basic profile information like name, age, and city. Use wandaUpdatePreferences for managing preference arrays.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The caller's name.",
          },
          age: {
            type: "number",
            description: "The caller's age.",
          },
          city: {
            type: "string",
            description: "The caller's city or location.",
          },
        },
        required: [],
      },
    },
  };
}
