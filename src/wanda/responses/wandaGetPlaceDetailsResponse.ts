import { db, getSearchResults } from "../../services/firebase";

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

    // Get search results for potential matching
    const searchResults = await getSearchResults(callId);

    // If placeNumber is provided, get the place from recent search results by index
    if (placeNumber && searchResults && searchResults.length >= placeNumber) {
      const selectedPlace = searchResults[placeNumber - 1]; // Array is 0-indexed
      finalPlaceName = selectedPlace.name;
      finalPlaceAddress = selectedPlace.address;
      finalPlaceId = selectedPlace.placeId;
    }
    // If we have a place name but missing address/placeId, try to find it in search results
    else if (finalPlaceName && (!finalPlaceAddress || !finalPlaceId) && searchResults) {
      // Try to find a matching place by name (case-insensitive partial match)
      const matchingPlace = searchResults.find(place => 
        place.name.toLowerCase().includes(finalPlaceName!.toLowerCase()) ||
        finalPlaceName!.toLowerCase().includes(place.name.toLowerCase())
      );
      
      if (matchingPlace) {
        console.log(`Found matching place in search results: ${matchingPlace.name}`);
        finalPlaceName = matchingPlace.name;
        finalPlaceAddress = matchingPlace.address;
        finalPlaceId = matchingPlace.placeId;
      } else {
        console.log(`No matching place found for "${finalPlaceName}" in recent search results`);
      }
    }
    // Handle case where placeNumber was provided but not found
    else if (placeNumber && (!searchResults || searchResults.length < placeNumber)) {
      return {
        message:
          "I couldn't find that place number in your recent search results. Could you tell me the name of the place you'd like details about?",
        error: true,
      };
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

      // If we don't have a placeId, try to find one using the Find Place API
      if (!placeIdToSearch && finalPlaceName) {
        console.log(`No placeId available, attempting to find place ID for: ${finalPlaceName}`);
        
        const findPlaceQuery = finalPlaceAddress 
          ? `${finalPlaceName} ${finalPlaceAddress}` 
          : finalPlaceName;
        
        const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(findPlaceQuery)}&inputtype=textquery&fields=place_id&key=${apiKey}`;
        
        try {
          const findPlaceResponse = await fetch(findPlaceUrl);
          const findPlaceData = await findPlaceResponse.json();
          
          if (findPlaceResponse.ok && findPlaceData.status === "OK" && findPlaceData.candidates && findPlaceData.candidates.length > 0) {
            placeIdToSearch = findPlaceData.candidates[0].place_id;
            console.log(`Found place ID: ${placeIdToSearch}`);
          } else {
            console.warn(`Find Place API did not return a place ID for: ${findPlaceQuery}. Status: ${findPlaceData.status}`);
          }
        } catch (findPlaceError) {
          console.error(`Error calling Find Place API for "${findPlaceQuery}":`, findPlaceError);
        }
      }

      // If we still don't have a placeId, we cannot proceed with Place Details API
      if (!placeIdToSearch) {
        console.error(
          `Cannot perform Place Details lookup without a place_id. Name: "${finalPlaceName}"`
        );
        return {
          message: `I found "${finalPlaceName}", but I couldn't get a specific identifier to fetch its full details. This sometimes happens with general names. Could you try a more specific search or provide the address?`,
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
        "place_id",
        "business_status",
        "user_ratings_total",
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
        `Here are the details for ${result.name || finalPlaceName}:`
      );

      if (result.formatted_address) {
        messageParts.push(`\nAddress: ${result.formatted_address}`);
      }
      
      if (result.international_phone_number) {
        messageParts.push(`\nPhone: ${result.international_phone_number}`);
      }
      
      if (result.rating) {
        const ratingText = result.user_ratings_total 
          ? `\nRating: ${result.rating}/5 stars (${result.user_ratings_total} reviews)`
          : `\nRating: ${result.rating}/5 stars`;
        messageParts.push(ratingText);
      }
      
      if (result.business_status) {
        if (result.business_status === "OPERATIONAL") {
          messageParts.push(`\nStatus: Currently operational`);
        } else {
          messageParts.push(
            `\nStatus: ${result.business_status
              .toLowerCase()
              .replace("_", " ")}`
          );
        }
      }
      
      if (result.opening_hours) {
        if (result.opening_hours.open_now !== undefined) {
          messageParts.push(
            `\nCurrently: ${
              result.opening_hours.open_now ? "Open" : "Closed"
            }`
          );
        }
        if (
          result.opening_hours.weekday_text &&
          result.opening_hours.weekday_text.length > 0
        ) {
          messageParts.push(`\nHours:`);
          result.opening_hours.weekday_text.forEach((line: string) => {
            messageParts.push(`  ${line}`);
          });
        }
      }
      
      if (result.website) {
        messageParts.push(`\nWebsite: ${result.website}`);
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
        message: messageParts.join(""),
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
    
    if (error.code && error.message) {
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
