# Wanda API Documentation

## Overview

The Wanda API serves as the backend for the voice-first local discovery platform. It handles phone calls through Vapi, manages user profiles, integrates with Google Maps for location search, and provides SMS functionality through Twilio.

## Base URLs

- **Production**: `https://api.wanda.app`
- **Development**: `https://dev-api.wanda.app`

## Authentication

Wanda uses Firebase Authentication with phone number verification for the web dashboard. Voice calls are authenticated through Vapi's secure webhook system.

### Phone Authentication Flow

```typescript
// 1. Request OTP
POST /auth/request-otp
{
  "phoneNumber": "+15551234567"
}

// 2. Verify OTP
POST /auth/verify-otp
{
  "phoneNumber": "+15551234567",
  "otp": "123456"
}
```

## Core Endpoints

### 1. Voice Call Handler

#### Incoming Call Processing
```
POST /wanda
```

**Description**: Main webhook endpoint for Vapi voice calls. Creates squad configuration and manages caller profile loading.

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```typescript
interface VapiCallRequest {
  message: {
    timestamp: number;
    type: "assistant-request";
    call: {
      id: string;
      customer: {
        number: string; // E.164 format
      };
    };
    phoneNumber: {
      id: string;
      number: string;
    };
  };
}
```

**Response**:
```typescript
interface VapiSquadResponse {
  phoneNumberId: string;
  phoneCallProviderBypassEnabled: boolean;
  customer: {
    number: string;
  };
  squad: {
    members: SquadMember[];
    membersOverrides: {
      transcriber: TranscriberConfig;
      voice: VoiceConfig;
      serverMessages: string[];
      server: { url: string };
      analysisPlan: AnalysisPlan;
    };
  };
}
```

**Example**:
```bash
curl -X POST https://api.wanda.app/wanda \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "call": {
        "id": "call_123",
        "customer": {
          "number": "+15551234567"
        }
      }
    }
  }'
```

### 2. Event Handler

#### Server Message Processing
```
POST /events
```

**Description**: Handles all server messages from Vapi including tool calls, status updates, and call reports.

**Message Types**:

##### Tool Calls
```typescript
interface ToolCallMessage {
  type: "tool-calls";
  call: VapiCall;
  toolCallList: Array<{
    id: string;
    function: {
      name: string;
      arguments: Record<string, any>;
    };
  }>;
}
```

##### Status Updates
```typescript
interface StatusUpdateMessage {
  type: "status-update";
  call: VapiCall;
  status: "queued" | "in-progress" | "forwarding" | "ended";
}
```

##### End of Call Report
```typescript
interface EndOfCallReportMessage {
  type: "end-of-call-report";
  call: VapiCall;
  endedReason: string;
  summary?: string;
  transcript?: string;
  recordingUrl?: string;
}
```

## Tool Functions

### 1. Map Search Tool

#### Search Google Maps
```
Function: wandaSearchMaps
```

**Parameters**:
```typescript
{
  query: string;        // Search query (required)
  location: string;     // Lat,lng or city name (required)
  radius?: number;      // Search radius in meters (optional)
}
```

**Implementation**:
```typescript
// Google Maps API Call
POST https://places.googleapis.com/v1/places:searchText
Headers: {
  'X-Goog-Api-Key': API_KEY,
  'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.id'
}
Body: {
  textQuery: `${query} in ${location}`,
  pageSize: 5
}
```

**Response**:
```typescript
{
  message: string;
  error: boolean;
  searchResults?: Array<{
    name: string;
    address: string;
    placeId: string;
  }>;
}
```

**Example Usage**:
```javascript
// User says: "Find Italian restaurants in downtown"
await wandaSearchMaps({
  query: "Italian restaurants",
  location: "downtown San Francisco",
  radius: 2000
});
```

### 2. Directions Tool

#### Send SMS Directions
```
Function: wandaSendDirections
```

**Parameters**:
```typescript
{
  placeName?: string;     // Name of the place
  placeAddress?: string;  // Formatted address
  placeId?: string;       // Google Place ID
  placeNumber?: number;   // Reference to search result number
}
```

**Implementation**:
```typescript
// Twilio SMS API
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json
Auth: Basic {AccountSid}:{AuthToken}
Body: {
  To: callerPhoneNumber,
  From: twilioPhoneNumber,
  Body: `Here are the directions to ${placeName}:\n\n${placeAddress}\n\nSent by Wanda 🗺️`
}
```

**Response**:
```typescript
{
  message: string;
  error: boolean;
}
```

### 3. Place Details Tool

#### Get Detailed Place Information
```
Function: wandaGetPlaceDetails
```

**Parameters**:
```typescript
{
  placeName?: string;
  placeAddress?: string;
  placeId?: string;
  placeNumber?: number;
}
```

**Implementation**:
```typescript
// Google Places API Details
GET https://maps.googleapis.com/maps/api/place/details/json
Params: {
  place_id: placeId,
  fields: 'name,formatted_address,international_phone_number,opening_hours,website,rating',
  key: API_KEY
}
```

**Response**:
```typescript
{
  message: string; // Formatted place details
  error: boolean;
}
```

### 4. Profile Management Tools

#### Update User Profile
```
Function: wandaUpdateProfile
```

**Parameters**:
```typescript
{
  name?: string;
  age?: number;
  city?: string;
}
```

**Firebase Operation**:
```typescript
// Update caller document
const docRef = doc(db, "callers", phoneNumberId);
await updateDoc(docRef, {
  name: trimmedName,
  age: validatedAge,
  city: trimmedCity,
  updatedAt: new Date().toISOString()
});
```

#### Update Preferences
```
Function: wandaUpdatePreferences
```

**Parameters**:
```typescript
{
  preferenceType: "food" | "activities" | "shopping" | "entertainment";
  action: "add" | "remove" | "replace";
  preferences: string[];
}
```

**Example**:
```javascript
// Add food preferences
await wandaUpdatePreferences({
  preferenceType: "food",
  action: "add",
  preferences: ["Italian", "Vegetarian", "Spicy"]
});
```

#### Get User Profile
```
Function: wandaGetProfile
```

**Parameters**: None

**Response**: Complete user profile including all preferences

## Data Models

### User Profile (Caller)
```typescript
interface WandaCaller {
  phoneNumber: string;
  name?: string;
  age?: number;
  city?: string;
  foodPreferences?: string[];
  activitiesPreferences?: string[];
  shoppingPreferences?: string[];
  entertainmentPreferences?: string[];
  createdAt: string;
  lastCalledAt?: string;
}
```

### Call Record
```typescript
interface CallRecord {
  id: string;
  callerPhoneNumber: string;
  createdAt: string;
  status?: string;
  endedReason?: string;
  summary?: string;
  transcript?: string;
  directionsSent?: boolean;
  directionsPlaceName?: string;
  directionsPlaceAddress?: string;
  directionsMessageSid?: string;
  lastSearchResults?: SearchResult[];
  lastSearchAt?: string;
}
```

### Search Result
```typescript
interface SearchResult {
  name: string;
  address: string;
  placeId: string;
}
```

## Error Handling

### Standard Error Response
```typescript
interface ErrorResponse {
  error: boolean;
  message: string;
  code?: string;
  details?: any;
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_PHONE_NUMBER` | Phone number format invalid | 400 |
| `CALLER_NOT_FOUND` | Caller profile doesn't exist | 404 |
| `GOOGLE_MAPS_ERROR` | Google Maps API failure | 502 |
| `TWILIO_ERROR` | SMS delivery failure | 502 |
| `FIREBASE_ERROR` | Database operation failure | 500 |
| `VALIDATION_ERROR` | Input validation failure | 400 |

### Error Examples
```typescript
// Google Maps API Error
{
  error: true,
  message: "Failed to search places: API quota exceeded",
  code: "GOOGLE_MAPS_ERROR",
  details: {
    apiResponse: "OVER_QUERY_LIMIT"
  }
}

// Validation Error
{
  error: true,
  message: "Age must be between 1 and 120",
  code: "VALIDATION_ERROR",
  details: {
    field: "age",
    value: 150
  }
}
```

## Rate Limits

### API Quotas
- **Google Maps**: 1000 requests/day (development), 10,000/day (production)
- **Twilio SMS**: 1 message/second per phone number
- **Firebase**: 50,000 reads/day, 20,000 writes/day
- **Vapi**: Unlimited (based on subscription)

### Rate Limiting Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Vapi Webhook Configuration
```typescript
interface VapiWebhookConfig {
  url: "https://api.wanda.app/events";
  headers: {
    "Content-Type": "application/json";
  };
  events: [
    "tool-calls",
    "status-update", 
    "end-of-call-report",
    "hang"
  ];
}
```

### Webhook Security
- **Signature Verification**: HMAC-SHA256 verification of webhook payloads
- **IP Whitelisting**: Restrict to Vapi's IP ranges
- **Timeout Handling**: 30-second timeout for webhook responses

## Testing

### Test Environment
```bash
# Development server
npm run dev

# Test with ngrok for webhook testing
ngrok http 3000

# Update Vapi webhook URL
curl -X PATCH https://api.vapi.ai/phone-number/{id} \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -d '{"server": {"url": "https://abc123.ngrok.io/events"}}'
```

### Mock Data
```typescript
// Mock caller for testing
const mockCaller: WandaCaller = {
  phoneNumber: "5551234567",
  name: "Test User",
  age: 30,
  city: "San Francisco",
  foodPreferences: ["Italian", "Vegetarian"],
  activitiesPreferences: ["Hiking", "Museums"],
  shoppingPreferences: ["Books", "Electronics"],
  entertainmentPreferences: ["Movies", "Concerts"],
  createdAt: "2024-01-01T00:00:00Z"
};
```

### Test Cases
```typescript
// Integration test example
describe('wandaSearchMaps', () => {
  it('should return personalized results', async () => {
    const result = await wandaSearchMaps({
      callId: 'test_call_123',
      query: 'restaurants',
      location: 'San Francisco'
    });
    
    expect(result.error).toBe(false);
    expect(result.searchResults).toHaveLength(3);
    expect(result.message).toContain('Italian'); // Preference enhancement
  });
});
```

## Monitoring & Analytics

### Health Check Endpoint
```
GET /health
```

**Response**:
```typescript
{
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  services: {
    firebase: "healthy" | "unhealthy";
    googleMaps: "healthy" | "unhealthy"; 
    twilio: "healthy" | "unhealthy";
  };
  metrics: {
    uptime: number;
    requestCount: number;
    averageResponseTime: number;
  };
}
```

### Metrics Collection
```typescript
// Custom metrics tracked
interface Metrics {
  callMetrics: {
    totalCalls: number;
    averageDuration: number;
    completionRate: number;
    transferSuccess: number;
  };
  searchMetrics: {
    totalSearches: number;
    averageResults: number;
    directionsRequested: number;
    preferenceEnhancement: number;
  };
  profileMetrics: {
    profileUpdates: number;
    preferenceUpdates: number;
    completionRates: number;
  };
}
```

## SDK & Client Libraries

### JavaScript/TypeScript SDK
```bash
npm install @wanda/sdk
```

```typescript
import { WandaClient } from '@wanda/sdk';

const client = new WandaClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Search places
const results = await client.search({
  query: 'coffee shops',
  location: 'San Francisco'
});

// Update profile
await client.profile.update({
  name: 'John Doe',
  preferences: {
    food: ['Coffee', 'Pastries']
  }
});
```

### Python SDK
```bash
pip install wanda-sdk
```

```python
from wanda import WandaClient

client = WandaClient(api_key='your-api-key')

# Search places
results = client.search(
    query='coffee shops',
    location='San Francisco'
)

# Update profile
client.profile.update(
    name='John Doe',
    preferences={
        'food': ['Coffee', 'Pastries']
    }
)
```

This comprehensive API documentation provides developers with everything they need to integrate with Wanda's voice-first local discovery platform. The documentation covers authentication, all endpoints, data models, error handling, testing, and monitoring capabilities.
