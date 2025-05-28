import { db, getCallerProfile } from "../../services/firebase";

interface Place {
  displayName?: {
    text: string;
    languageCode: string;
  };
  formattedAddress?: string;
  name?: string; // Place resource name (places/PLACE_ID)
  id?: string;
  [key: string]: any; // To allow for other fields
}

interface GoogleMapsNewApiResponse {
  places: Place[];
  nextPageToken?: string;
}

export async function wandaSearchMaps({
  callId,
  query,
  location,
  radius,
}: {
  callId: string;
  query: string;
  location: string;
  radius?: number;
}): Promise<{
  message: string;
  error: boolean;
  searchResults?: Array<{
    name: string;
    address: string;
    placeId: string;
  }>;
}> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return {
      message: "Google Maps API key is not set in environment variables.",
      error: true,
    };
  }

  // Get caller profile to enhance search with preferences
  let callerProfile = null;
  try {
    const callDoc = await db.collection("calls").doc(callId).get();
    if (callDoc.exists) {
      const callData = callDoc.data();
      const callerPhoneNumber = callData?.callerPhoneNumber;
      if (callerPhoneNumber) {
        const phoneNumberId = callerPhoneNumber.replace("+1", "");
        callerProfile = await getCallerProfile(phoneNumberId);
      }
    }
  } catch (error) {
    console.log("Could not load caller profile for search enhancement:", error);
  }

  // Use caller's city if available and no location specified
  let searchLocation = location;
  if (!searchLocation && callerProfile?.city) {
    searchLocation = callerProfile.city;
    console.log(`Using caller's profile city for search: ${searchLocation}`);
  }

  // Enhance query with food preferences if it's a food-related search
  let enhancedQuery = query;
  if (callerProfile?.foodPreferences && callerProfile.foodPreferences.length > 0) {
    const isFood = /restaurant|food|eat|dining|cuisine|lunch|dinner|breakfast|cafe|coffee/i.test(query);
    if (isFood) {
      // Add preferences to help with relevance
      const preferences = callerProfile.foodPreferences.slice(0, 2).join(" "); // Limit to avoid overly long queries
      enhancedQuery = `${query} ${preferences}`;
      console.log(`Enhanced food search query with preferences: ${enhancedQuery}`);
    }
  }

  // Construct the search query - combine query with location for better results
  const textQuery = searchLocation ? `${enhancedQuery} in ${searchLocation}` : enhancedQuery;

  // Prepare the request body for the new API
  const requestBody: any = {
    textQuery,
    pageSize: 5, // Limit to 5 results initially, we'll take top 3
  };

  // If radius is provided, add location bias with circular area
  if (radius && location) {
    // For location bias, we need lat/lng coordinates
    // In a real implementation, you might want to geocode the location string first
    // For now, we'll rely on the textQuery including location information
    // The API will use IP biasing by default if no locationBias is provided
  }

  const url = "https://places.googleapis.com/v1/places:searchText";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.id",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorBody = `Failed to fetch from Google Maps API: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error && errorData.error.message) {
          errorBody += ` - ${errorData.error.message}`;
        }
      } catch (e) {
        // Ignore if parsing error body fails
      }
      return {
        message: errorBody,
        error: true,
      };
    }

    const data: GoogleMapsNewApiResponse = await response.json();

    console.log("Parsed data from Google Maps API (New):", data);

    if (!data.places || data.places.length === 0) {
      console.log("No places found for the query:", textQuery);
      return {
        message: "I found no places matching your search.",
        error: false, // Not an error, just no results
      };
    }

    // Take top 3 results
    const topResults = data.places.slice(0, 3);

    const formattedPlaces = topResults
      .map((place, index) => {
        const name = place.displayName?.text || "Unknown Place";
        const address = place.formattedAddress
          ? ` at ${place.formattedAddress}`
          : "";
        return `${name}`; // ${address}
      })
      .join(", ");

    console.log("Formatted places:", formattedPlaces);

    // Store the search results for potential directions requests
    const searchResults = topResults.map((place) => ({
      name: place.displayName?.text || "Unknown Place",
      address: place.formattedAddress || "",
      placeId: place.id || "",
    }));

    // Build personalized response message
    let responseMessage = `I found the following places:\n${formattedPlaces}`;
    
    // Add personalized context if we used profile information
    if (callerProfile) {
      if (searchLocation === callerProfile.city && location !== callerProfile.city) {
        responseMessage += `\n\n(I used ${callerProfile.city} from your profile since you didn't specify a location)`;
      }
      if (enhancedQuery !== query && callerProfile.foodPreferences?.length) {
        responseMessage += `\n\n(I factored in your food preferences to find better matches)`;
      }
    }
    
    responseMessage += `\n\nWould you like me to send you directions to any of these places?`;

    return {
      message: responseMessage,
      error: false,
      searchResults, // Include this for potential use by the assistant
    };
  } catch (e: any) {
    console.error("Exception in wandaSearchMaps:", e);
    return {
      message: `An unexpected error occurred: ${e.message}`,
      error: true,
    };
  }
}
