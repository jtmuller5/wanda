import { Response } from "express";
import { wandaSearchMaps } from "../responses/wandaSearchMapsResponse";
import { wandaSendDirections } from "../responses/wandaSendDirectionsResponse";
import { storeSearchResults } from "../../services/firebase";
import { Vapi } from "@vapi-ai/server-sdk";
import { wandaGetPlaceDetails } from "../responses/wandaGetPlaceDetailsResponse";
import { wandaUpdateProfile } from "../responses/wandaUpdateProfileResponse";
import { wandaGetProfile } from "../responses/wandaGetProfileResponse";
import { wandaUpdatePreferences } from "../responses/wandaUpdatePreferencesResponse";
import { wandaCreateReview } from "../responses/wandaCreateReviewResponse";

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
        const { message, error, searchResults } = await wandaSearchMaps({
          callId,
          location: parameters.location as string,
          query: parameters.query as string,
          radius: parameters.radius ? (parameters.radius as number) : undefined,
        });

        // Store search results for potential directions requests
        if (searchResults && searchResults.length > 0) {
          await storeSearchResults({
            callId,
            searchResults,
          });
        }

        res.status(200).json({
          results: [
            {
              toolCallId: functionCall.toolCallList[0].id,
              result: message,
            },
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
      try {
        const { message, error } = await wandaSendDirections({
          callId,
          placeName: parameters.placeName as string | undefined,
          placeAddress: parameters.placeAddress as string | undefined,
          placeId: parameters.placeId as string | undefined,
          placeNumber: parameters.placeNumber as number | undefined,
        });

        res.status(200).json({
          results: [
            {
              toolCallId: functionCall.toolCallList[0].id,
              result: message,
            },
          ],
        });
      } catch (error) {
        console.error("Error sending directions:", error);
        res.status(200).json({
          results: [
            {
              toolCallId: functionCall.toolCallList[0].id,
              result:
                "I'm sorry, I couldn't send the directions right now. Please try again later.",
            },
          ],
        });
      }
      break;
    case "wandaGetPlaceDetails":
      try {
        const { message, error } = await wandaGetPlaceDetails({
          callId,
          placeName: parameters.placeName as string | undefined,
          placeAddress: parameters.placeAddress as string | undefined,
          placeId: parameters.placeId as string | undefined,
          placeNumber: parameters.placeNumber as number | undefined,
        });

        res.status(200).json({
          results: [
            {
              toolCallId: functionCall.toolCallList[0].id,
              result: message,
            },
          ],
        });
      } catch (error) {
        console.error("Error getting place details:", error);
        res.status(200).json({
          results: [
            {
              toolCallId: functionCall.toolCallList[0].id,
              result:
                "I'm sorry, I couldn't search for the place details right now. Please try again later.",
            },
          ],
        });
      }
      break;
    case "wandaUpdateProfile":
      try {
        const { message, error } = await wandaUpdateProfile({
          callId,
          name: parameters.name as string | undefined,
          age: parameters.age as number | undefined,
          city: parameters.city as string | undefined,
        });

        res.status(200).json({
          results: [
            {
              toolCallId: functionCall.toolCallList[0].id,
              result: message,
            },
          ],
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        res.status(200).json({
          results: [
            {
              toolCallId: functionCall.toolCallList[0].id,
              result:
                "I'm sorry, I couldn't update your profile right now. Please try again later.",
            },
          ],
        });
      }
      break;
    case "wandaUpdatePreferences":
      try {
        const { message, error } = await wandaUpdatePreferences({
          callId,
          preferenceType: parameters.preferenceType as "food" | "activities" | "shopping" | "entertainment",
          action: parameters.action as "add" | "remove" | "replace",
          preferences: parameters.preferences as string[],
        });

        res.status(200).json({
          results: [
            {
              toolCallId: functionCall.toolCallList[0].id,
              result: message,
            },
          ],
        });
      } catch (error) {
        console.error("Error updating preferences:", error);
        res.status(200).json({
          results: [
            {
              toolCallId: functionCall.toolCallList[0].id,
              result:
                "I'm sorry, I couldn't update your preferences right now. Please try again later.",
            },
          ],
        });
      }
      break;
    case "wandaGetProfile":
      try {
        const { message, error } = await wandaGetProfile({
          callId,
        });

        res.status(200).json({
          results: [
            {
              toolCallId: functionCall.toolCallList[0].id,
              result: message,
            },
          ],
        });
      } catch (error) {
        console.error("Error getting profile:", error);
        res.status(200).json({
          results: [
            {
              toolCallId: functionCall.toolCallList[0].id,
              result:
                "I'm sorry, I couldn't retrieve your profile right now. Please try again later.",
            },
          ],
        });
      }
      break;
    case "wandaCreateReview":
      try {
        const { message, error } = await wandaCreateReview({
          callId,
          placeId: parameters.placeId as string,
          comment: parameters.comment as string,
          rating: parameters.rating as number,
        });

        res.status(200).json({
          results: [
            {
              toolCallId: functionCall.toolCallList[0].id,
              result: message,
            },
          ],
        });
      } catch (error) {
        console.error("Error creating review:", error);
        res.status(200).json({
          results: [
            {
              toolCallId: functionCall.toolCallList[0].id,
              result:
                "I'm sorry, I couldn't save your review right now. Please try again later.",
            },
          ],
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
