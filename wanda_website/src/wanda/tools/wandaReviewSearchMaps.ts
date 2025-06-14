import { Vapi } from "@vapi-ai/server-sdk";

export function wandaReviewSearchMapsTool(host: string): Vapi.OpenAiModelToolsItem {
  return {
    type: "function",
    async: false,
    server: {
      url: host + "/events",
      headers: {
        "Content-Type": "application/json",
      },
    },
    function: {
      name: "wandaReviewSearchMaps",
      description: "Search Google Maps for places and return detailed listing with names, addresses, and place IDs for review purposes.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query to find places on Google Maps (e.g., 'Italian restaurants', 'coffee shops', 'bookstores').",
          },
          location: {
            type: "string",
            description: "The location to search around (e.g., 'New York, NY', 'downtown Boston', '90210').",
          },
          radius: {
            type: "number",
            description: "The radius (in meters) around the location to search (optional).",
          },
        },
        required: ["query", "location"],
      },
    },
  };
}
