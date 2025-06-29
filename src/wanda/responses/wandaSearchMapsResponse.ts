import { searchGoogleMaps } from "../../services/googleMaps";
import { storeSearchResults } from "../../services/firebase";

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
  try {
    const searchResult = await searchGoogleMaps({
      callId,
      query,
      location,
      radius,
      includeEditorialSummary: true,
      maxResults: 3,
    });

    if (!searchResult.success) {
      return {
        message: searchResult.error || "Failed to search Google Maps",
        error: true,
      };
    }

    if (searchResult.results.length === 0) {
      return {
        message: "I found no places matching your search.",
        error: false,
      };
    }

    // Format places with summaries for conversational response
    const formattedPlaces = searchResult.results
      .map((place, index) => {
        const summary = place.summary || "";
        return `${index + 1} - ${place.name}: ${summary}`;
      })
      .join("\n");

    console.log("Formatted places:", formattedPlaces);

    // Convert to the format expected by existing code
    const searchResults = searchResult.results.map((place) => ({
      name: place.name,
      address: place.address,
      placeId: place.placeId,
    }));

    // Store search results for potential directions requests
    if (searchResults.length > 0) {
      await storeSearchResults({
        callId,
        searchResults,
      });
    }

    // Build personalized response message
    let responseMessage = `I found the following places:\n${formattedPlaces}`;

    // Add personalized context if we used profile information
    if (searchResult.usedProfileCity) {
      responseMessage += `\n\n(I used your saved city from your profile since you didn't specify a location)`;
    }
    if (searchResult.usedFoodPreferences) {
      responseMessage += `\n\n(I factored in your food preferences to find better matches)`;
    }

    responseMessage += `\n\nWould you like me to send you directions to any of these places?`;

    return {
      message: responseMessage,
      error: false,
      searchResults,
    };
  } catch (e: any) {
    console.error("Exception in wandaSearchMaps:", e);
    return {
      message: `An unexpected error occurred: ${e.message}`,
      error: true,
    };
  }
}
