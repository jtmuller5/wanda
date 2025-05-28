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
      description: "Update the caller's profile with new information.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The caller's name.",
          },
          city: {
            type: "string",
            description: "The caller's city.",
          },
        },
        required: [],
      },
    },
  };
}
