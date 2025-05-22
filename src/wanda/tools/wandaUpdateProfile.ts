import { VapiTool } from "../../types";

export const wandaUpdateProfileTool: VapiTool = {
  type: "function",
  async: true,
  server: {
    url: process.env.WANDA_API_URL + "/events",
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
