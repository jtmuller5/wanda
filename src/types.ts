import { WandaVariableValues } from "./wanda/config";

export interface WandaCaller {
  createdAt: string;
  phoneNumber: number;
  lastCalledAt?: string;
  name?: string;
  age?: number;
  city?: string;
  foodPreferences?: string[];
  activitiesPreferences?: string[];
  shoppingPreferences?: string[];
  entertainmentPreferences?: string[];
}

export interface TwilioCallRequest {
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

/*
{"message":{"timestamp":1748289798737,"type":"assistant-request","call":{"id":"f8736ebe-7919-43ec-8637-21991535aab4","orgId":"5b050d60-506b-45c4-b175-76d7d6cc404f","createdAt":"2025-05-26T20:03:18.712Z","updatedAt":"2025-05-26T20:03:18.712Z","type":"inboundPhoneCall","status":"ringing","phoneCallProvider":"vapi","phoneCallProviderId":"48cfae15-639e-46ee-a2ee-d2513db65c18","phoneCallTransport":"sip","phoneNumberId":"0eac8823-cc7f-4e85-8d05-dee356a4522f","assistantId":null,"assistantOverrides":{"variableValues":{"account-sid":"c033b672-5b99-42ae-9ce2-b231e9a522fb","cid":"2361682961-3957278598-1683713742@msc1.382COM.COM","forwarded-for":"64.125.111.10","originating-carrier":"382com","voip-carrier-sid":"a5569621-84ac-49cc-a8b8-11c7fb96b905","application-sid":"79d078c8-76b2-452a-99e0-ddd5abbf6269"}},"squadId":null,"workflowId":null,"customer":{"number":"+13152716606","sipUri":"sip:+13152716606@44.229.228.186:5060"},"phoneCallProviderDetails":{"sbcCallId":"2361682961-3957278598-1683713742@msc1.382COM.COM"},"transport":{"provider":"vapi.sip","sbcCallSid":"2361682961-3957278598-1683713742@msc1.382COM.COM","callSid":"48cfae15-639e-46ee-a2ee-d2513db65c18"}},"phoneNumber":{"id":"0eac8823-cc7f-4e85-8d05-dee356a4522f","orgId":"5b050d60-506b-45c4-b175-76d7d6cc404f","assistantId":null,"number":"+18436489138","createdAt":"2025-05-26T19:04:15.042Z","updatedAt":"2025-05-26T20:03:12.364Z","stripeSubscriptionId":null,"twilioAccountSid":null,"twilioAuthToken":null,"stripeSubscriptionStatus":null,"stripeSubscriptionCurrentPeriodStart":null,"name":"Wanda Staging","credentialId":null,"serverUrl":null,"serverUrlSecret":null,"twilioOutgoingCallerId":null,"sipUri":null,"provider":"vapi","fallbackForwardingPhoneNumber":null,"fallbackDestination":null,"squadId":null,"credentialIds":null,"numberE164CheckEnabled":null,"authentication":null,"server":{"url":"https://b53f-2601-140-8f00-4ba0-1de5-57f2-1a04-4268.ngrok-free.app/wanda"},"useClusterSip":null,"status":"active","providerResourceId":"787d5a52-98dc-45de-947f-98462237e341","hooks":null,"twilioApiKey":null,"twilioApiSecret":null,"smsEnabled":true,"workflowId":null},"customer":{"number":"+13152716606","sipUri":"sip:+13152716606@44.229.228.186:5060"}}}
*/
export interface VapiCallRequest {
  message: {
    timestamp: number; // e.g., 1748289798737
    type: "assistant-request"; // Assuming this is a fixed type
    call: {
      id: string; // UUID format
      orgId: string; // UUID format
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
      type: "inboundPhoneCall"; // Assuming fixed type
      status: "ringing" | "answered" | "completed" | "failed"; // Example statuses
      phoneCallProvider: string; // e.g., 'vapi'
      phoneCallProviderId: string; // UUID format
      phoneCallTransport: "sip" | "websocket"; // Example transports
      phoneNumberId: string; // UUID format
      assistantId?: string | null; // Optional, can be null if not assigned
      assistantOverrides?: {
        variableValues: WandaVariableValues;
      };
      squadId?: string | null; // Optional, can be null if not assigned
      workflowId?: string | null; // Optional, can be null if not assigned
      customer: {
        number: string; // E.164 format, e.g., +13152716606
        sipUri?: string; // Optional SIP URI, if applicable
      };
      phoneCallProviderDetails?: {
        sbcCallId?: string; // Optional SBC call ID, if applicable
      };
      transport?: {
        provider: string; // e.g., 'vapi.sip'
        sbcCallSid?: string; // Optional SBC call SID, if applicable
        callSid?: string; // Call SID for the transport layer
      };
    };
    phoneNumber: {
      id: string; // UUID format
      orgId: string; // UUID format
      assistantId?: string | null; // Optional, can be null if not assigned
      number: string; // E.164 format, e.g., +18436489138
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
      stripeSubscriptionId?: string | null;
      twilioAccountSid?: string | null;
      twilioAuthToken?: string | null;
      stripeSubscriptionStatus?: string | null;
      stripeSubscriptionCurrentPeriodStart?: Date | null;
      name?: string | null;
      credentialId?: string | null;
      serverUrl?: string | null; // Optional server URL
      serverUrlSecret?: string | null; // Optional secret for the server URL
      twilioOutgoingCallerId?: string | null; // Optional Twilio outgoing caller ID
      sipUri?: string | null; // Optional SIP URI
      provider: string; // e.g., 'vapi'
      fallbackForwardingPhoneNumber?: string | null; // Optional fallback number
      fallbackDestination?: string | null; // Optional fallback destination
      squadId?: string | null; // Optional, can be null if not assigned
      credentialIds?: string[] | null; // Optional array of credential IDs
      numberE164CheckEnabled?: boolean | null; // Optional E.164 check enabled flag
      authentication?: string | null; // Optional authentication method
      server?: {
        url: string; // e.g., 'https://example.com/wanda'
      };
      useClusterSip?: boolean | null; // Optional flag for cluster SIP usage
      status: "active" | "inactive"; // Example statuses
      providerResourceId?: string | null; // Optional provider resource ID
      hooks?: string | null; // Optional hooks configuration
      twilioApiKey?: string | null; // Optional Twilio API key
      twilioApiSecret?: string | null; // Optional Twilio API secret
      smsEnabled: boolean; // Flag indicating if SMS is enabled

      workflowId?: string | null; // Optional workflow ID
      // Note: 'server' is an object with a URL, not a string
      // Add other fields as necessary based on your schema
    };
    customer: {
      number: string; // E.164 format, e.g., +13152716606
      sipUri?: string; // Optional SIP URI, if applicable
    };
  };
}

export interface AgentTransfer {
  destinationAgent: "Wanda_Intro" | "Wanda_Search" | "Wanda_Profile" | "Wanda_Review";
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
  knowledgeBase?: KnowledgeBase; // Optional: Seen in the second
  messages?: {
    role: "system" | "user" | "assistant" | "tool" | "function";
    content: string;
  }[];
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

/* export interface CallAnalysisStructuredData {
  food_preferences: string[];
  activity_preferences: string[];
  shopping_preferences: string[];
  entertainment_preferences: string[];
} */

export interface WandaReview {
  placeId: string;
  comment: string;
  rating: number;
  phoneNumber: string;
  createdAt: string;
  callId: string;
}
