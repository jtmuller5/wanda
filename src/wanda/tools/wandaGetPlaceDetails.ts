import { Vapi } from "@vapi-ai/server-sdk";

export function wandaGetPlaceDetailsTool(
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
      name: "wandaGetPlaceDetails",
      description: "Get detailed information about a specific place including address, phone number, hours, website, and ratings.",
      parameters: {
        type: "object",
        properties: {
          placeName: {
            type: "string",
            description: "The name of the place to get details for.",
          },
          placeAddress: {
            type: "string",
            description: "The formatted address of the place (optional, helps with accuracy).",
          },
          placeId: {
            type: "string",
            description:
              "The Google Place ID (optional, for more accurate results).",
          },
          placeNumber: {
            type: "number",
            description:
              "The number of the place from the search results (1, 2, 3, etc.). Use this when the user refers to a place by number from recent search results (optional).",
          },
        },
        required: [],
      },
    },
  };
}
