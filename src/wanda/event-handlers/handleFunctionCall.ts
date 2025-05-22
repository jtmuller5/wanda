import { VapiCall } from "../../types";
import { Response } from "express";
import { wandaSearchMaps } from "../responses/wandaSearchMapsResponse";

interface VapiFunctionCallMessage {
  type: "tool-calls";
  timestamp: number;
  call: VapiCall;
  toolCallList: {
    id: string;
    type: "function";
    function: { name: string; arguments: Record<string, any> };
  }[];
  assistant?: {
    id: string;
    name: string;
    variableValues: Record<string, any>;
  };
}

export async function handleFunctionCall(
  message: VapiFunctionCallMessage,
  res: Response
) {
  console.log("Full function call message:", message);

  const func = message.toolCallList[0].function;
  // Parse function parameters
  const parameters = func.arguments;

  switch (func.name) {
    case "wandaSearchMaps":
      try {
        const { patient, newPatient, toolResult } = await wandaSearchMaps({
          location: parameters.location,
          query: parameters.query,
          radius: parameters.radius,
        });

        res.status(200).json({
          result: JSON.stringify({
            patientId: patient?.id,
          }),
        });
      } catch (error) {
        console.error("Error creating patient:", error);
        res.status(200).json({
          result: JSON.stringify({
            error: "Failed to create patient",
            success: false,
          }),
        });
      }
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
