import { Vapi } from "@vapi-ai/server-sdk";

export function wandaSendDirectionsTool(host: string): Vapi.OpenAiModelToolsItem {
  return {
    type: "function",
    async: false,
    server: {
      url: host + "/events",
      headers: {
        "Content-Type": "application/json",
      },
    },
    messages: [
      {
        type: "request-start",
        content: "Let me send you the directions via text message.",
      },
      {
        type: "request-failed",
        content:
          "I'm sorry, I couldn't send the directions right now. Please try again later.",
      },
    ],
    function: {
      name: "wandaSendDirections",
      description: "Send Google Maps directions link via SMS to the caller.",
      parameters: {
        type: "object",
        properties: {
          placeName: {
            type: "string",
            description: "The name of the place to send directions for.",
          },
          placeAddress: {
            type: "string",
            description: "The formatted address of the place.",
          },
          placeId: {
            type: "string",
            description: "The Google Place ID (optional, for more accurate links).",
          },
          placeNumber: {
            type: "number",
            description: "The number of the place from the search results (1, 2, 3, etc.). Use this when the user refers to a place by number from recent search results.",
          },
        },
        required: [],
      },
    },
  };
}
