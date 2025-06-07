# Creating a New Tool for Wanda Assistants

## Overview
This guide explains how to create a new tool that can be used by Wanda assistants to perform specific actions (e.g., database operations, API calls, data processing).

## File Structure
```
src/wanda/
├── tools/
│   └── wandaNewTool.ts           # Tool definition
├── responses/
│   └── wandaNewToolResponse.ts   # Tool logic/handler
├── event-handlers/
│   └── handleFunctionCall.ts     # Route tool calls
└── assistants/
    └── TargetAssistant.ts        # Assistant that uses the tool
```

## Step 1: Create the Tool Definition

**File**: `src/wanda/tools/wandaNewTool.ts`

```typescript
import { Vapi } from "@vapi-ai/server-sdk";

export function wandaNewToolTool(
  host: string
): Vapi.OpenAiModelToolsItem {
  return {
    type: "function",
    async: true,
    server: {
      url: host + "/events",
      headers: {
        "Content-Type": "application/json",
      },
    },
    function: {
      name: "wandaNewTool",
      description: "Clear description of what this tool does and when to use it.",
      parameters: {
        type: "object",
        properties: {
          requiredParam: {
            type: "string",
            description: "Description of this required parameter.",
          },
          optionalParam: {
            type: "number",
            description: "Description of this optional parameter.",
          },
        },
        required: ["requiredParam"],
      },
    },
  };
}
```

**Key Points:**
- Function name follows pattern: `wanda[ToolName]Tool`
- Export name follows pattern: `wandaNewToolTool`
- Set `async: true` for database/API operations
- Use clear, specific descriptions for AI understanding
- Define required vs optional parameters appropriately

## Step 2: Create the Response Handler

**File**: `src/wanda/responses/wandaNewToolResponse.ts`

```typescript
import { db } from "../../services/firebase";

export async function wandaNewTool({
  callId,
  requiredParam,
  optionalParam,
}: {
  callId: string;
  requiredParam: string;
  optionalParam?: number;
}): Promise<{
  message: string;
  error: boolean;
}> {
  console.log("wandaNewTool called with parameters:", {
    callId,
    requiredParam,
    optionalParam,
  });

  try {
    // 1. Input validation
    if (!requiredParam || requiredParam.trim().length === 0) {
      return {
        message: "Please provide a valid [parameter description].",
        error: true,
      };
    }

    // 2. Get caller info from call record
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
      console.error(`Caller phone number not found in call record with ID ${callId}.`);
      return {
        message: "Caller phone number not found.",
        error: true,
      };
    }

    // 3. Process the main logic
    const phoneNumberId = callerPhoneNumber.replace("+1", "");
    
    // Your tool's main functionality here
    // Example: Database operations, API calls, data processing
    
    // 4. Return success message
    return {
      message: "Success message describing what was accomplished.",
      error: false,
    };

  } catch (error: any) {
    console.error(`Error in wandaNewTool for call ${callId}:`, error);
    
    return {
      message: "I'm sorry, I couldn't complete that action right now. Please try again later.",
      error: true,
    };
  }
}
```

**Key Points:**
- Function name matches tool name exactly
- Always include `callId` parameter for caller identification
- Validate inputs before processing
- Use consistent error handling pattern
- Return user-friendly messages
- Log parameters and errors for debugging

## Step 3: Register the Tool Handler

**File**: `src/wanda/event-handlers/handleFunctionCall.ts`

1. **Add import:**
```typescript
import { wandaNewTool } from "../responses/wandaNewToolResponse";
```

2. **Add case to switch statement:**
```typescript
case "wandaNewTool":
  try {
    const { message, error } = await wandaNewTool({
      callId,
      requiredParam: parameters.requiredParam as string,
      optionalParam: parameters.optionalParam as number | undefined,
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
    console.error("Error in wandaNewTool:", error);
    res.status(200).json({
      results: [
        {
          toolCallId: functionCall.toolCallList[0].id,
          result: "I'm sorry, I couldn't complete that action right now. Please try again later.",
        },
      ],
    });
  }
  break;
```

## Step 4: Add Tool to Target Assistant

**File**: `src/wanda/assistants/TargetAssistant.ts`

1. **Add import:**
```typescript
import { wandaNewToolTool } from "../tools/wandaNewTool";
```

2. **Add to tools array:**
```typescript
tools: [
  // ... existing tools
  wandaNewToolTool(host),
  // ... other tools
],
```

## Step 5: Update Assistant Registration (if new assistant)

**File**: `src/index.ts`

If creating a tool for a new assistant, add the assistant to the squad:

```typescript
import { createNewAssistant } from "./wanda/assistants/NewAssistant";

// In both /wanda and /wanda-twilio routes:
const members: Vapi.SquadMemberDto[] = [
  // ... existing assistants
  createNewAssistant(
    model,
    variableValues,
    modelProvider,
    `https://${req.headers.host}`
  ),
];
```

## Step 6: Configure Transfers (Optional)

If other assistants should transfer to your assistant:

1. **Create transfer file**: `src/wanda/transfers/NewTransfer.ts`
```typescript
import { AgentTransfer } from "../../types";

export const NewTransfer: AgentTransfer = {
  destinationAgent: "Wanda_New",
  transferDescription: "When the user wants to [describe trigger condition], transfer them immediately.",
};
```

2. **Add to destination agent types**: `src/types.ts`
```typescript
export interface AgentTransfer {
  destinationAgent: "Wanda_Intro" | "Wanda_Search" | "Wanda_Profile" | "Wanda_Review" | "Wanda_New";
  transferDescription: string;
}
```

3. **Add transfer destinations to other assistants**

## Step 7: Add Type Definitions (Optional)

**File**: `src/types.ts`

If your tool works with specific data structures:

```typescript
export interface NewToolData {
  property1: string;
  property2: number;
  createdAt: string;
}
```

## Best Practices

### Tool Design
- **Single Responsibility**: Each tool should do one thing well
- **Clear Naming**: Use descriptive names that indicate the tool's purpose
- **Consistent Parameters**: Always include `callId`, follow established patterns

### Error Handling
- **Input Validation**: Validate all inputs before processing
- **Graceful Failures**: Return helpful error messages to users
- **Logging**: Log parameters and errors for debugging
- **Fallback Messages**: Provide generic fallback for unexpected errors

### Database Operations
- **Caller Identification**: Always link actions to the caller's phone number
- **Atomic Operations**: Use transactions for multi-step database operations
- **Consistent Data**: Follow established patterns for timestamps, IDs, etc.

### User Experience
- **Natural Language**: Write responses as if speaking to the user
- **Confirmation**: Confirm successful actions clearly
- **Help Text**: Provide guidance when operations fail

## Testing Checklist

- [ ] Tool definition exports correctly
- [ ] Response handler validates inputs
- [ ] Function call routing works
- [ ] Assistant includes the tool
- [ ] Error cases return helpful messages
- [ ] Success cases provide clear confirmation
- [ ] Database operations complete successfully
- [ ] Logging captures necessary information

## Common Patterns

### Database Write Operations
```typescript
const docRef = await db.collection("collectionName").add({
  field1: value1,
  phoneNumber: phoneNumberId,
  createdAt: new Date().toISOString(),
  callId: callId,
});
```

### Database Read Operations
```typescript
const doc = await db.collection("collectionName").doc(docId).get();
if (doc.exists) {
  const data = doc.data();
  // Process data
}
```

### Parameter Type Casting
```typescript
// In handleFunctionCall.ts
stringParam: parameters.stringParam as string,
numberParam: parameters.numberParam as number,
optionalParam: parameters.optionalParam as string | undefined,
```

This guide provides a complete framework for adding new tools to the Wanda platform while maintaining consistency and following established patterns.