import { Response } from "express";
import { wandaSearchMaps } from "../responses/wandaSearchMapsResponse";
import { Vapi } from "@vapi-ai/server-sdk";

export async function handleFunctionCall(
  functionCall: Vapi.ServerMessageToolCalls,
  res: Response
) {
  console.log("Full function call message:", functionCall);

  const callId = functionCall.call?.id ?? "missing";
  const func = functionCall.toolCallList[0].function;
  // Parse function parameters
  const parameters = func.arguments;

  switch (func.name) {
    case "wandaSearchMaps":
      try {
        const { message, error } = await wandaSearchMaps({
          callId,
          location: parameters.location as string,
          query: parameters.query as string,
          radius: parameters.radius ? (parameters.radius as number) : undefined,
        });

        res.status(200).json({
          results: [
            JSON.stringify({
              toolCallId: functionCall.toolCallList[0].id,
              result: message,
            }),
          ],
        });
      } catch (error) {
        console.error("Error searching maps:", error);
        res.status(200).json({
          result: JSON.stringify({
            error: "Failed to search maps",
            success: false,
          }),
        });
      }
      break;
    case "wandaSendDirections":
      console.log("Function 'wandaSendDirections' is not implemented yet.");
      res.status(200).json({
        result: JSON.stringify({
          error: "Function 'wandaSendDirections' is not implemented yet.",
          success: false,
        }),
      });
      break;
    default:
      console.log(`Unknown function: ${func.name}`);
      res.status(200).json({
        result: JSON.stringify({
          error: `Unknown function: ${func.name}`,
          success: false,
        }),
      });
  }
}
