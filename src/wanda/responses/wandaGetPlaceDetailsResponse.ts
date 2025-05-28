import { db, getSearchResults } from "../../services/firebase";
import twilio from "twilio";

export async function wandaGetPlaceDetails({
  callId,
  placeName,
  placeAddress,
  placeId,
  placeNumber,
}: {
  callId: string;
  placeName?: string;
  placeAddress?: string;
  placeId?: string;
  placeNumber?: number;
}): Promise<{
  message: string;
  error: boolean;
}> {
  console.log("wandaGetPlaceDetails called with parameters:", {
    callId,
    placeName,
    placeAddress,
    placeId,
    placeNumber,
  });

  try {
    // Get the caller's phone number from the call record
    const callDoc = await db.collection("calls").doc(callId).get();

    if (!callDoc.exists) {
      console.error(`Call record with ID ${callId} not found.`);
      return {
        message: "Call record not found.",
        error: true,
      };
    }

    const callData = callDoc.data();
    const callerPhoneNumber = callData?.callerPhoneNumber;

    if (!callerPhoneNumber) {
      console.error(
        `Caller phone number not found in call record with ID ${callId}.`
      );
      return {
        message: "Caller phone number not found.",
        error: true,
      };
    }

    // Resolve place information
    let finalPlaceName = placeName;
    let finalPlaceAddress = placeAddress;
    let finalPlaceId = placeId;

    // If placeNumber is provided, get the place from recent search results
    if (placeNumber && (!placeName || !placeAddress)) {
      const searchResults = await getSearchResults(callId);
      if (searchResults && searchResults.length >= placeNumber) {
        const selectedPlace = searchResults[placeNumber - 1]; // Array is 0-indexed
        finalPlaceName = selectedPlace.name;
        finalPlaceAddress = selectedPlace.address;
        finalPlaceId = selectedPlace.placeId;
      } else {
        return {
          message:
            "I couldn't find that place number in your recent search results. Could you tell me the name of the place you'd like directions to?",
          error: true,
        };
      }
    } else {
      console.log();
    }

    // Validate that we have the required information
    if (!finalPlaceName) {
      return {
        message:
          "I need the name of the place to look up. Could you tell me which place you'd like details about?",
        error: true,
      };
    }

    // Look up the place details on Google Maps and generate a reply
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error("Google Maps API key is not configured.");
        return {
          message:
            "Sorry, I'm not configured correctly to look up place details at the moment.",
          error: true,
        };
      }

      let placeIdToSearch = finalPlaceId;

      // If we don't have a placeId, we might need to do a "Find Place" request first
      // This example will primarily focus on having a placeId.
      // A "Find Place" request would look like:
      // `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(finalPlaceName)}&inputtype=textquery&fields=place_id&key=${apiKey}`
      // For simplicity, we'll assume if placeId is missing, we might not get the best result or might error.

      if (!placeIdToSearch && finalPlaceName) {
        // Attempt to find place by name if ID is missing (less reliable for details)
        // This is a simplified approach. A robust solution would first call Find Place, then Place Details.
        console.warn(
          `Attempting place details lookup without a specific placeId for: ${finalPlaceName}. Results may be less accurate or require a Find Place API call first to get a place_id.`
        );
        // For this example, we'll proceed, but Google's Place Details API strongly prefers a place_id.
        // If you *only* have name/address, you should use the "Find Place" API first to get a place_id,
        // then use that place_id for the "Place Details" request.
        // For now, we'll just inform the user if the crucial ID is missing.
        // A more robust implementation would make a Find Place call here.
      }

      if (!placeIdToSearch) {
        // If after all checks, placeIdToSearch is still undefined, we cannot proceed with Place Details API.
        // A Find Place request would be needed first.
        console.error(
          `Cannot perform Place Details lookup without a place_id. Name: "${finalPlaceName}"`
        );
        return {
          message: `I found "${finalPlaceName}", but I need a more specific identifier (a place ID) to get its full details. Sometimes this happens with general names. Could you try a more specific search or provide more context?`,
          error: true,
        };
      }

      const fields = [
        "name",
        "formatted_address",
        "international_phone_number",
        "opening_hours",
        "website",
        "rating",
        "place_id", // Good to request it to confirm, or if you got it from a different source
        "business_status", // Useful to know if it's operational
      ].join(",");

      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
        placeIdToSearch
      )}&fields=${encodeURIComponent(fields)}&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || data.status !== "OK") {
        console.error(
          `Google Places API error for placeId "${placeIdToSearch}": ${data.status}`,
          data.error_message || ""
        );
        return {
          message:
            `Sorry, I couldn't retrieve the details for "${finalPlaceName}". ${
              data.error_message || "The service reported an issue."
            }`.trim(),
          error: true,
        };
      }

      const result = data.result;

      if (!result) {
        console.error(
          `No result found in Google Places API response for placeId "${placeIdToSearch}" despite OK status.`
        );
        return {
          message: `I found information about "${finalPlaceName}", but couldn't get the specific details.`,
          error: true,
        };
      }

      const messageParts: string[] = [];
      messageParts.push(
        `Okay, here are some details for ${result.name || finalPlaceName}:`
      );

      if (result.formatted_address) {
        messageParts.push(`Address: ${result.formatted_address}.`);
      }
      if (result.international_phone_number) {
        messageParts.push(
          `Phone number: ${result.international_phone_number}.`
        );
      }
      if (result.rating) {
        messageParts.push(
          `It has a rating of ${result.rating} out of 5 stars.`
        );
      }
      if (result.business_status) {
        if (result.business_status === "OPERATIONAL") {
          messageParts.push("It's currently operational.");
        } else {
          messageParts.push(
            `Its status is: ${result.business_status
              .toLowerCase()
              .replace("_", " ")}.`
          );
        }
      }
      if (result.opening_hours) {
        if (result.opening_hours.open_now !== undefined) {
          messageParts.push(
            `Right now, it's ${
              result.opening_hours.open_now ? "open" : "closed"
            }.`
          );
        }
        if (
          result.opening_hours.weekday_text &&
          result.opening_hours.weekday_text.length > 0
        ) {
          messageParts.push("The hours are usually:");
          result.opening_hours.weekday_text.forEach((line: string) => {
            messageParts.push(`  ${line}`);
          });
        }
      }
      if (result.website) {
        messageParts.push(`You can find their website at: ${result.website}.`);
      }

      if (messageParts.length <= 1) {
        // Only the intro line was added
        return {
          message: `I found "${
            result.name || finalPlaceName
          }", but unfortunately, I couldn't get more specific details like its address or phone number right now.`,
          error: false, // It's not an error, just lack of details
        };
      }

      return {
        message: messageParts.join("\n"),
        error: false,
      };
    } catch (apiCallError: any) {
      console.error(
        `Error during Google Places API HTTP request or processing for "${finalPlaceName}":`,
        apiCallError
      );
      // Check if it's a fetch-related network error
      if (
        apiCallError instanceof TypeError &&
        apiCallError.message.includes("fetch")
      ) {
        return {
          message:
            "I'm having trouble connecting to the place details service. Please check your network connection and try again.",
          error: true,
        };
      }
      return {
        message:
          "I'm sorry, I ran into a problem while trying to fetch the place details. Please try again in a moment.",
        error: true,
      };
    }
  } catch (error: any) {
    console.error(`Error in wandaGetPlaceDetails for callId ${callId}:`, error);
    // This outer catch is for errors *before* the API call section, like DB issues.
    // The Twilio-specific logging was from a different context (sending SMS) and might not be relevant here.
    // I'll make it more generic.
    if (error.code && error.message) {
      // General error properties
      console.error("Error details:", {
        code: error.code,
        message: error.message,
      });
    }

    return {
      message:
        "I'm sorry, an unexpected error occurred while trying to process your request for place details. Please try again later.",
      error: true,
    };
  }
}
