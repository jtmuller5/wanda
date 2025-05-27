import { Vapi } from "@vapi-ai/server-sdk";

export function wandaSearchMapsTool(host: string): Vapi.OpenAiModelToolsItem {
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
        content: "Give me a moment to search the map for you.",
      },
      {
        type: "request-failed",
        content:
          "Hmm...I couldn't find any places matching your search. Would you like to try a different query?",
      },
    ],
    function: {
      name: "wandaSearchMaps",
      description: "Search Google Maps for a given query.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query to find places on Google Maps.",
          },
          location: {
            type: "string",
            description: "The location to search around (latitude,longitude).",
          },
          radius: {
            type: "number",
            description:
              "The radius (in meters) around the location to search.",
          },
        },
        required: ["query", "location"],
      },
    },
  };
}
