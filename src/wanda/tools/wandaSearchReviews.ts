import { Vapi } from "@vapi-ai/server-sdk";

export function wandaSearchReviewsTool(
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
      name: "wandaSearchReviews",
      description: "Search for and retrieve all reviews for a specific place. Returns accumulated review content and average rating.",
      parameters: {
        type: "object",
        properties: {
          placeId: {
            type: "string",
            description: "The Google Place ID to search reviews for.",
          },
          placeName: {
            type: "string",
            description: "The name of the place (optional, used for better messaging).",
          },
        },
        required: ["placeId"],
      },
    },
  };
}
