# Wanda Auto-Preference Learning System

## Overview

This system automatically extracts and updates user preferences from phone call transcripts using Vapi's structured data analysis capabilities.

## How It Works

### 1. Structured Data Extraction
- **Location**: `src/index.ts` - Squad analysis plan configuration
- **Trigger**: Automatically runs at the end of each call
- **Schema**: Extracts 4 categories of preferences:
  - `food_preferences`: Cuisines, dietary restrictions (e.g., "Italian", "Vegetarian", "Gluten-free")
  - `activity_preferences`: Hobbies, activities (e.g., "Hiking", "Museums", "Sports")
  - `shopping_preferences`: Shopping categories (e.g., "Books", "Fashion", "Electronics")
  - `entertainment_preferences`: Entertainment types (e.g., "Live music", "Theater", "Movies")

### 2. Data Processing
- **Location**: `src/wanda/event-handlers/handleEndOfCallReport.ts`
- **Process**: 
  1. Receives structured data from Vapi analysis
  2. Validates that meaningful preferences were extracted
  3. Calls preference update function
  4. Logs success/failure for debugging

### 3. Preference Storage
- **Location**: `src/services/firebase.ts` - `updateCallerPreferencesFromCall()`
- **Logic**:
  - Merges new preferences with existing ones
  - Avoids duplicates (case-insensitive matching)
  - Preserves existing preferences while adding new ones
  - Updates `lastCalledAt` timestamp

## Key Features

- **Automatic Learning**: No manual profile updates needed
- **Intelligent Merging**: New preferences are added to existing ones without duplicates
- **Robust Error Handling**: Preference update failures don't break the call process
- **Comprehensive Logging**: Full audit trail of preference updates

## Configuration

### Schema Customization
The structured data schema can be modified in `src/index.ts`:

```typescript
schema: {
  type: "object",
  properties: {
    // Add or modify preference categories here
  },
  required: ["food_preferences", "activity_preferences", "shopping_preferences", "entertainment_preferences"]
}
```

### Analysis Messages
Custom prompts for preference extraction can be updated in the `messages` array:

```typescript
messages: [
  {
    role: "system",
    content: "You are an expert at extracting user preferences..."
  },
  {
    role: "user", 
    content: "Here is the transcript:\n\n{{transcript}}\n\n..."
  }
]
```

## Data Flow

1. **Call Starts** → Caller profile loaded with existing preferences
2. **Call Proceeds** → Wanda assists with search/recommendations using known preferences
3. **Call Ends** → Transcript analyzed for new preferences
4. **Preferences Updated** → New preferences merged with existing profile
5. **Next Call** → Enhanced profile used for better recommendations

## Database Structure

### Caller Profile
```javascript
{
  phoneNumber: "1234567890",
  name: "John Doe",
  city: "New York",
  foodPreferences: ["Italian", "Vegetarian", "Spicy food"],
  activitiesPreferences: ["Hiking", "Museums"],
  shoppingPreferences: ["Books", "Antiques"], 
  entertainmentPreferences: ["Live music", "Theater"],
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-02T00:00:00.000Z",
  lastCalledAt: "2025-01-02T00:00:00.000Z"
}
```

## Testing

Run the schema validation test:
```bash
node test-structured-data.js
```

## Benefits

1. **Improved User Experience**: More personalized recommendations over time
2. **Reduced Friction**: No need for users to manually update preferences
3. **Data-Driven Insights**: Better understanding of user preferences across calls
4. **Scalable Learning**: System gets smarter with each interaction

## Future Enhancements

- Location-based preference learning
- Temporal preference tracking (preferences by time of day/season)
- Preference confidence scoring
- Advanced deduplication with semantic similarity
