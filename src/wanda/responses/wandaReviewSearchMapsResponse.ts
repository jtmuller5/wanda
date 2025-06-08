import { searchGoogleMaps } from "../../services/googleMaps";

export async function wandaReviewSearchMaps({
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
  try {
    const searchResult = await searchGoogleMaps({
      callId,
      query,
      location,
      radius,
      includeEditorialSummary: false, // Don't need summaries for review search
      maxResults: 5, // Get more results for review purposes
    });

    if (!searchResult.success) {
      return {
        message: searchResult.error || "Failed to search Google Maps",
        error: true,
      };
    }

    if (searchResult.results.length === 0) {
      return {
        message: "I found no places matching your search criteria.",
        error: false,
      };
    }

    // Format places with name, address, and place ID for review purposes
    const formattedPlaces = searchResult.results
      .map((place, index) => {
        const addressPart = place.address ? ` - ${place.address}` : "";
        return `${index + 1}. ${place.name}${addressPart}`;
      })
      .join("\n");

    console.log("Formatted places for review:", formattedPlaces);

    // Convert to the format expected by existing code
    const searchResults = searchResult.results.map((place) => ({
      name: place.name,
      address: place.address,
      placeId: place.placeId,
    }));

    // Build response message focused on the data rather than conversation
    let responseMessage = `Found ${searchResult.results.length} places:\n\n${formattedPlaces}`;

    // Add context about search enhancements
    if (searchResult.usedProfileCity) {
      responseMessage += `\n\n(Search used saved city from caller profile)`;
    }
    if (searchResult.usedFoodPreferences) {
      responseMessage += `\n\n(Search enhanced with caller's food preferences)`;
    }

    return {
      message: responseMessage,
      error: false,
      searchResults,
    };
  } catch (e: any) {
    console.error("Exception in wandaReviewSearchMaps:", e);
    return {
      message: `An unexpected error occurred: ${e.message}`,
      error: true,
    };
  }
}
