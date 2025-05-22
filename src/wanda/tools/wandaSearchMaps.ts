import { VapiTool } from "../../types";

export const wandaSearchMapsTool: VapiTool = {
  type: "function",
  async: true,
  server: {
    url: process.env.WANDA_API_URL + "/events",
    headers: {
      "Content-Type": "application/json",
    },
  },
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
          description: "The radius (in meters) around the location to search.",
        },
      },
      required: ["query", "location"],
    },
  },
};
