# Creating Reusable Service Functions for Vapi Tools

This guide explains how to refactor existing tool logic into reusable service functions that can be shared across multiple Vapi tools.

## Overview

When building voice AI applications with Vapi, you often need similar functionality across different tools but with slight variations in behavior or response format. Rather than duplicating code, you can create a centralized service layer that handles the core logic while allowing tools to customize the presentation and behavior.

## Example: Google Maps Search Service

In this example, we refactored Google Maps search functionality from a single tool into a reusable service that supports multiple use cases.

### 1. Create the Service File

Create a new service file (e.g., `src/services/googleMaps.ts`) that contains:

- **Interface definitions** for consistent data structures
- **Core search function** that handles the API interaction
- **Configurable options** to support different use cases
- **Standardized return format** for easy consumption

```typescript
// src/services/googleMaps.ts
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

export async function searchGoogleMaps(options: GoogleMapsSearchOptions): Promise<GoogleMapsSearchResult> {
  // Core search logic here
  // Returns standardized result format
}
```

### 2. Update Existing Response Functions

Refactor existing response functions to use the new service:

```typescript
// src/wanda/responses/wandaSearchMapsResponse.ts
import { searchGoogleMaps } from "../../services/googleMaps";

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
}) {
  const searchResult = await searchGoogleMaps({
    callId,
    query,
    location,
    radius,
    includeEditorialSummary: true, // Tool-specific configuration
    maxResults: 3,
  });

  // Tool-specific formatting and response logic
  if (!searchResult.success) {
    return { message: searchResult.error, error: true };
  }

  // Format results for conversational response
  const formattedPlaces = searchResult.results
    .map((place, index) => `${index + 1} - ${place.name}: ${place.summary}`)
    .join("\\n");

  return {
    message: `I found the following places:\\n${formattedPlaces}`,
    error: false,
    searchResults: searchResult.results,
  };
}
```

### 3. Create New Response Functions

Create new response functions that use the same service with different configurations:

```typescript
// src/wanda/responses/wandaReviewSearchMapsResponse.ts
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
}) {
  const searchResult = await searchGoogleMaps({
    callId,
    query,
    location,
    radius,
    includeEditorialSummary: false, // Different configuration
    maxResults: 5, // More results for review
  });

  // Different formatting for review purposes
  const formattedPlaces = searchResult.results
    .map((place, index) => `${index + 1}. ${place.name} - ${place.address}`)
    .join("\\n");

  return {
    message: `Found ${searchResult.results.length} places:\\n\\n${formattedPlaces}`,
    error: false,
    searchResults: searchResult.results,
  };
}
```

### 4. Create Tool Definitions

Create Vapi tool definitions that use the new response functions:

```typescript
// src/wanda/tools/wandaReviewSearchMaps.ts
import { Vapi } from "@vapi-ai/server-sdk";

export function wandaReviewSearchMapsTool(host: string): Vapi.OpenAiModelToolsItem {
  return {
    type: "function",
    async: false,
    server: {
      url: host + "/events",
      headers: {
        "Content-Type": "application/json",
      },
    },
    function: {
      name: "wandaReviewSearchMaps",
      description: "Search Google Maps for places and return detailed listing with names, addresses, and place IDs for review purposes.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "The search query..." },
          location: { type: "string", description: "The location to search..." },
          radius: { type: "number", description: "The radius in meters..." },
        },
        required: ["query", "location"],
      },
    },
  };
}
```

### 5. Update Function Call Handler

Add the new tool to your function call handler:

```typescript
// src/wanda/event-handlers/handleFunctionCall.ts
import { wandaReviewSearchMaps } from "../responses/wandaReviewSearchMapsResponse";

export async function handleFunctionCall(functionCall: Vapi.ServerMessageToolCalls, res: Response) {
  switch (func.name) {
    case "wandaReviewSearchMaps":
      try {
        const { message, error, searchResults } = await wandaReviewSearchMaps({
          callId,
          location: parameters.location as string,
          query: parameters.query as string,
          radius: parameters.radius ? (parameters.radius as number) : undefined,
        });

        res.status(200).json({
          results: [{
            toolCallId: functionCall.toolCallList[0].id,
            result: message,
          }],
        });
      } catch (error) {
        // Error handling
      }
      break;
    // ... other cases
  }
}
```

## Benefits of This Pattern

1. **Code Reuse**: Core logic is written once and shared across multiple tools
2. **Maintainability**: Changes to API integration only need to be made in one place
3. **Consistency**: All tools using the service return data in consistent formats
4. **Flexibility**: Tools can customize behavior through configuration options
5. **Testing**: Service functions can be unit tested independently
6. **Separation of Concerns**: API logic is separated from presentation logic

## Best Practices

1. **Use TypeScript interfaces** to ensure type safety across all consumers
2. **Return standardized result objects** with success/error states
3. **Make services configurable** through options objects
4. **Include metadata** in responses (like whether profile data was used)
5. **Handle errors consistently** at the service level
6. **Log appropriately** at both service and tool levels
7. **Document service functions** with clear parameter descriptions

## When to Use This Pattern

- When you have similar functionality needed across multiple tools
- When you're making external API calls that could be reused
- When you want to maintain consistent data formats
- When you need to centralize error handling for a particular domain
- When you're building tools that are variations of existing functionality

This pattern helps create a more maintainable and scalable voice AI application while reducing code duplication and improving consistency across your Vapi tools.
