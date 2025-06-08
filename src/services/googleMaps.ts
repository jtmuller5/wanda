import { db, getCallerProfile } from "./firebase";

export interface Place {
  displayName?: {
    text: string;
    languageCode: string;
  };
  formattedAddress?: string;
  name?: string; // Place resource name (places/PLACE_ID)
  id?: string;
  editorialSummary?: {
    text: string;
    languageCode: string;
  };
  [key: string]: any; // To allow for other fields
}

export interface GoogleMapsSearchResponse {
  places: Place[];
  nextPageToken?: string;
}

export interface SearchResult {
  name: string;
  address: string;
  placeId: string;
  summary?: string;
}

export interface GoogleMapsSearchOptions {
  callId: string;
  query: string;
  location?: string;
  radius?: number;
  includeEditorialSummary?: boolean;
  maxResults?: number;
}

export interface GoogleMapsSearchResult {
  success: boolean;
  error?: string;
  results: SearchResult[];
  enhancedQuery?: string;
  usedProfileCity?: boolean;
  usedFoodPreferences?: boolean;
}

/**
 * Core Google Maps search functionality that can be used by multiple tools
 */
export async function searchGoogleMaps({
  callId,
  query,
  location,
  radius,
  includeEditorialSummary = false,
  maxResults = 3,
}: GoogleMapsSearchOptions): Promise<GoogleMapsSearchResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: "Google Maps API key is not set in environment variables.",
      results: [],
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
  let usedProfileCity = false;
  if (!searchLocation && callerProfile?.city) {
    searchLocation = callerProfile.city;
    usedProfileCity = true;
    console.log(`Using caller's profile city for search: ${searchLocation}`);
  }

  // Enhance query with food preferences if it's a food-related search
  let enhancedQuery = query;
  let usedFoodPreferences = false;
  if (
    callerProfile?.foodPreferences &&
    callerProfile.foodPreferences.length > 0
  ) {
    const isFood =
      /restaurant|food|eat|dining|cuisine|lunch|dinner|breakfast|cafe|coffee/i.test(
        query
      );
    if (isFood) {
      // Add preferences to help with relevance
      const preferences = callerProfile.foodPreferences.slice(0, 2).join(" "); // Limit to avoid overly long queries
      enhancedQuery = `${query} ${preferences}`;
      usedFoodPreferences = true;
      console.log(
        `Enhanced food search query with preferences: ${enhancedQuery}`
      );
    }
  }

  // Construct the search query - combine query with location for better results
  const textQuery = searchLocation
    ? `${enhancedQuery} in ${searchLocation}`
    : enhancedQuery;

  // Prepare the request body for the new API
  const requestBody: any = {
    textQuery,
    pageSize: Math.min(maxResults + 2, 5), // Get a few extra to ensure we have enough good results
  };

  // Build field mask based on what data we need
  const fieldMaskParts = [
    "places.displayName",
    "places.formattedAddress", 
    "places.id"
  ];
  
  if (includeEditorialSummary) {
    fieldMaskParts.push("places.editorialSummary");
  }

  const url = "https://places.googleapis.com/v1/places:searchText";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMaskParts.join(","),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch from Google Maps API: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error && errorData.error.message) {
          errorMessage += ` - ${errorData.error.message}`;
        }
      } catch (e) {
        // Ignore if parsing error body fails
      }
      return {
        success: false,
        error: errorMessage,
        results: [],
      };
    }

    const data: GoogleMapsSearchResponse = await response.json();

    console.log(
      "Parsed data from Google Maps API (New):",
      JSON.stringify(data)
    );

    if (!data.places || data.places.length === 0) {
      console.log("No places found for the query:", textQuery);
      return {
        success: true,
        results: [],
        enhancedQuery,
        usedProfileCity,
        usedFoodPreferences,
      };
    }

    // Take the requested number of results
    const topResults = data.places.slice(0, maxResults);

    // Convert to our standard format
    const searchResults: SearchResult[] = topResults.map((place) => ({
      name: place.displayName?.text || "Unknown Place",
      address: place.formattedAddress || "",
      placeId: place.id || "",
      summary: place.editorialSummary?.text || undefined,
    }));

    return {
      success: true,
      results: searchResults,
      enhancedQuery,
      usedProfileCity,
      usedFoodPreferences,
    };
  } catch (e: any) {
    console.error("Exception in searchGoogleMaps:", e);
    return {
      success: false,
      error: `An unexpected error occurred: ${e.message}`,
      results: [],
    };
  }
}
