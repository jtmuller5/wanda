import { Vapi } from "@vapi-ai/server-sdk";

export function wandaCreateReviewTool(
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
      name: "wandaCreateReview",
      description: "Create a review for a place on the Wanda platform. Use this when the caller wants to leave a review or rating for a business or location.",
      parameters: {
        type: "object",
        properties: {
          placeId: {
            type: "string",
            description: "The Google Place ID of the place being reviewed.",
          },
          comment: {
            type: "string",
            description: "The caller's review comment or feedback about the place.",
          },
          rating: {
            type: "number",
            description: "A star rating from 1 to 5 derived from the caller's feedback.",
          },
        },
        required: ["placeId", "comment", "rating"],
      },
    },
  };
}
