import { Vapi } from "@vapi-ai/server-sdk";

export function wandaGetProfileTool(host: string): Vapi.OpenAiModelToolsItem {
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
      name: "wandaGetProfile",
      description: "Get the caller's current profile information to show what's saved.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  };
}
