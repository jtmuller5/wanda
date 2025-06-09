# Adding New Tools to Wanda Voice Assistants

This guide explains how to add new tools/functions to Wanda's voice assistants using the `wandaSearchReviews` tool as an example.

## Overview

Wanda uses a modular architecture where tools are defined separately and then integrated into assistants. Each tool consists of:

1. **Tool Definition** - Defines the function schema and parameters
2. **Response Handler** - Implements the business logic and database operations
3. **Assistant Integration** - Adds the tool to specific assistants
4. **Event Handler Registration** - Registers the function in the main event handler

## Implementation Steps

### 1. Create the Tool Definition

Create a new file in `src/wanda/tools/` following the naming pattern `wanda{FunctionName}.ts`:

```typescript
// src/wanda/tools/wandaSearchReviews.ts
import { Vapi } from "@vapi-ai/server-sdk";

export function wandaSearchReviewsTool(
  host: string
): Vapi.OpenAiModelToolsItem {
  return {
    type: "function",
    async: true, // Set to true for async operations like database queries
    server: {
      url: host + "/events",
      headers: {
        "Content-Type": "application/json",
      },
    },
    function: {
      name: "wandaSearchReviews", // Must match the case in handleFunctionCall
      description: "Clear description of what the tool does",
      parameters: {
        type: "object",
        properties: {
          parameterName: {
            type: "string",
            description: "Description of the parameter",
          },
          // Add more parameters as needed
        },
        required: ["parameterName"], // List required parameters
      },
    },
  };
}
```

### 2. Create the Response Handler

Create a corresponding response handler in `src/wanda/responses/` following the pattern `wanda{FunctionName}Response.ts`:

```typescript
// src/wanda/responses/wandaSearchReviewsResponse.ts
import { db } from "../../services/firebase";

export async function wandaSearchReviews({
  callId,
  placeId,
  placeName,
}: {
  callId: string;
  placeId: string;
  placeName?: string;
}): Promise<{
  message: string;
  error: boolean;
  // Add any additional return data
}> {
  try {
    // Validate input parameters
    if (!placeId || placeId.trim().length === 0) {
      return {
        message: "Error message for invalid input",
        error: true,
      };
    }

    // Perform database operations
    const querySnapshot = await db
      .collection("reviews")
      .where("placeId", "==", placeId.trim())
      .get();

    // Process results and format response
    const message = "Formatted response for the user";
    
    return {
      message,
      error: false,
    };
  } catch (error: any) {
    console.error(`Error in function:`, error);
    return {
      message: "User-friendly error message",
      error: true,
    };
  }
}
```

### 3. Add Tool to Assistant

Import and add the tool to the appropriate assistant(s) in `src/wanda/assistants/`:

```typescript
// src/wanda/assistants/ReviewAssistant.ts
import { wandaSearchReviewsTool } from "../tools/wandaSearchReviews";

export const createReviewAssistant = (
  // ... parameters
): Vapi.SquadMemberDto => ({
  assistantOverrides: {
    model: {
      tools: [
        // ... existing tools
        wandaSearchReviewsTool(host),
      ],
    },
  },
});
```

### 4. Register in Event Handler

Add the function to the switch statement in `src/wanda/event-handlers/handleFunctionCall.ts`:

```typescript
// Add import
import { wandaSearchReviews } from "../responses/wandaSearchReviewsResponse";

// Add case in switch statement
case "wandaSearchReviews":
  try {
    const { message, error } = await wandaSearchReviews({
      callId,
      placeId: parameters.placeId as string,
      placeName: parameters.placeName as string | undefined,
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
    console.error("Error description:", error);
    res.status(200).json({
      results: [
        {
          toolCallId: functionCall.toolCallList[0].id,
          result: "User-friendly error message",
        },
      ],
    });
  }
  break;
```

## Best Practices

### Parameter Validation
- Always validate input parameters before processing
- Provide clear error messages for invalid inputs
- Handle edge cases gracefully

### Error Handling
- Use try-catch blocks for all async operations
- Log detailed errors for debugging
- Return user-friendly error messages
- Always return a response to avoid hanging calls

### Database Operations
- Use appropriate Firestore queries and indexes
- Handle empty result sets gracefully
- Consider pagination for large datasets
- Use transactions when modifying multiple documents

### Response Formatting
- Keep messages conversational and friendly
- Provide actionable information to users
- Consider response length for voice interactions
- Include follow-up questions when appropriate

### Testing
- Test with various input scenarios
- Verify error handling paths
- Test with empty/invalid data
- Ensure proper response formatting

## File Structure

```
src/wanda/
├── tools/
│   └── wandaSearchReviews.ts          # Tool definition
├── responses/
│   └── wandaSearchReviewsResponse.ts  # Business logic
├── assistants/
│   └── ReviewAssistant.ts             # Tool integration
└── event-handlers/
    └── handleFunctionCall.ts          # Event routing
```

## Common Patterns

### Firebase Queries
```typescript
// Simple query
const snapshot = await db.collection("collectionName").where("field", "==", value).get();

// Ordered query
const snapshot = await db.collection("collectionName")
  .where("field", "==", value)
  .orderBy("createdAt", "desc")
  .get();

// Limited results
const snapshot = await db.collection("collectionName")
  .limit(10)
  .get();
```

### Response Formatting
```typescript
// Success response
return {
  message: "Operation completed successfully",
  error: false,
  data: processedData, // Optional additional data
};

// Error response
return {
  message: "User-friendly error message",
  error: true,
};
```

### Async Tool Configuration
```typescript
{
  type: "function",
  async: true, // Important for database operations
  server: {
    url: host + "/events",
    headers: {
      "Content-Type": "application/json",
    },
  },
  // ... function definition
}
```
