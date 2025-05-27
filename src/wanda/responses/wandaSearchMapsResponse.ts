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
  query,
  location,
  radius,
}: {
  query: string;
  location: string;
  radius?: number;
}): Promise<{
  message: string;
  error: boolean;
}> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return {
      message: "Google Maps API key is not set in environment variables.",
      error: true,
    };
  }

  // Construct the search query - combine query with location for better results
  const textQuery = location ? `${query} in ${location}` : query;

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
        return `${index + 1}. ${name}${address}`;
      })
      .join("\n");

    return {
      message: `I found the following places:\n${formattedPlaces}`,
      error: false,
    };
  } catch (e: any) {
    console.error("Exception in wandaSearchMaps:", e);
    return {
      message: `An unexpected error occurred: ${e.message}`,
      error: true,
    };
  }
}
