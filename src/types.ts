import { WandaVariableValues } from "./wanda/config";

export interface CallRequest {
  Called: string;
  ToState: string;
  CallerCountry: string;
  Direction: string;
  CallerState: string;
  ToZip: string;
  CallSid: string;
  To: string;
  CallerZip: string;
  ToCountry: string;
  StirVerstat: string;
  CallToken: string;
  CalledZip: string;
  ApiVersion: string;
  CalledCity: string;
  CallStatus: string;
  From: string;
  AccountSid: string;
  CalledCountry: string;
  CallerCity: string;
  ToCity: string;
  FromCountry: string;
  Caller: string;
  FromCity: string;
  CalledState: string;
  FromZip: string;
  FromState: string;
}

export interface AgentTransfer {
  destinationAgent: "Wanda_Intro" | "Wanda_Search" | "Wanda_Profile";
  transferDescription: string;
}

/**
 * Represents the AI model configuration override.
 */
interface ModelOverride {
  model: string;
  temperature: number;
  provider: string; // Could potentially be a literal type like 'openai' if known
  tools?: VapiTool[]; // Optional: Seen in the second member
  knowledgeBase?: KnowledgeBase; // Optional: Seen in the second member
}

/**
 * Represents the definition of a function parameter for a tool.
 * This is similar to a subset of JSON Schema definition.
 */
interface ToolParameterProperty {
  description: string;
  type: string; // e.g., 'string', 'object', 'number', 'boolean'
  format?: string; // e.g., 'date'
  enum?: string[];
  pattern?: string;
  // Add other JSON Schema properties if needed (e.g., properties, required for nested objects)
}

/**
 * Represents the parameters structure for a tool's function.
 */
interface ToolFunctionParameters {
  type: "object";
  properties: Record<string, ToolParameterProperty>;
  required: string[];
}

/**
 * Represents the function definition within a tool.
 */
interface ToolFunction {
  name: "wandaUpdateProfile" | "wandaSearchMaps";
  description: string;
  parameters: ToolFunctionParameters;
  strict?: boolean; // Optional: Seen in load_workflow tools
}

/**
 * Represents a condition for displaying a tool message.
 */
interface ToolMessageCondition {
  param: string;
  value: string;
  operator: string; // e.g., 'eq'
}

/**
 * Represents a message associated with a tool's execution lifecycle.
 */
interface ToolMessage {
  content: string;
  type: string; // e.g., 'request-response-delayed', 'request-start'
  timingMilliseconds?: number; // Optional: Only for delayed types
  conditions?: ToolMessageCondition[]; // Optional
}

/**
 * Represents the knowledge base configuration override.
 */
interface KnowledgeBase {
  provider: string; // e.g., 'canonical'
  topK: number;
  fileIds: string[]; // Assuming string IDs, adjust if different
}

/**
 * Represents overrides for a specific assistant within the squad.
 */
interface AssistantOverrides {
  model: ModelOverride;
  firstMessage?: string; // Optional: Not present in the second member
  firstMessageMode?: string; // Optional: Present in second/third member
  variableValues: WandaVariableValues;
  // Note: 'tools' and 'knowledgeBase' are inside 'model' in the second/third member example
}

// --- Nested Type for Assistant Destinations ---

/**
 * Represents a potential destination to transfer the call to another assistant.
 */
interface AssistantDestination {
  message: string;
  description: string;
  type: "assistant"; // Assuming only 'assistant' type for now
  assistantName: string;
  transferMode: string; // e.g., 'swap-system-message-in-history'
}

// --- Main Interface for a Squad Member ---

/**
 * Represents a single member within the 'squad.members' array.
 */
export interface Assistant {
  assistantId: string; // UUID format
  assistantOverrides: AssistantOverrides;
  assistantDestinations: AssistantDestination[];
}

/**
 * Represents a tool that the assistant can use.
 */
export interface VapiTool {
  async: boolean;
  function: ToolFunction;
  messages?: ToolMessage[];
  type: "function";
  server: {
    url: string; // e.g., 'https://api.example.com'
    headers: Record<string, string>; // e.g., {
  };
}

export interface VapiCall {
  id: string;
  assistantId: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  orgId: string;
  cost: number;
  status: string;
  transport: {
    provider: string;
    websocketCallUrl?: string;
  };
  destination?: {
    number: string;
  };
  messages?: {
    role: "assistant" | "user" | "tool";
    content: string;
    timestamp: number;
  }[];
}
