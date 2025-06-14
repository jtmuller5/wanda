# Robust Preference Extraction from Variable Structured Data

This guide explains how to implement flexible data extraction when working with AI-generated structured data that may have inconsistent field names.

## Problem

When using AI models to extract structured data from conversations, the field names in the response can be highly variable. For example, food preferences might be returned as:
- `food_preferences`
- `foodPreferences` 
- `food`
- `Food_Preferences`
- `foodPrefs`
- Or any other variation containing "food"

## Solution

Implement a flexible field matching function that tries exact matches first, then falls back to pattern matching.

## Implementation

### 1. Create a Helper Function

```typescript
const findPreferenceField = (data: any, preferenceType: string): string[] => {
  // First try exact matches in order of preference
  const exactMatches = [
    `${preferenceType}_preferences`,
    `${preferenceType}Preferences`,
    preferenceType
  ];
  
  for (const field of exactMatches) {
    if (data[field] && Array.isArray(data[field])) {
      return data[field];
    }
  }
  
  // If no exact match, find first field containing the preference type
  const keys = Object.keys(data);
  const matchingKey = keys.find(key => 
    key.toLowerCase().includes(preferenceType.toLowerCase()) &&
    Array.isArray(data[key])
  );
  
  return matchingKey ? data[matchingKey] : [];
};
```

### 2. Use the Helper Function

```typescript
// Extract preferences using the flexible function
const foodPreferences = findPreferenceField(structuredData, 'food');
const activityPreferences = findPreferenceField(structuredData, 'activity') || 
                           findPreferenceField(structuredData, 'activities');
const shoppingPreferences = findPreferenceField(structuredData, 'shopping');
const entertainmentPreferences = findPreferenceField(structuredData, 'entertainment');
```

## Key Features

### 1. **Exact Match Priority**
- Tries exact field names first in order of preference
- Ensures predictable behavior when standard field names are used

### 2. **Fuzzy Matching Fallback**
- Uses case-insensitive substring matching as fallback
- Finds the first field containing the preference type name

### 3. **Type Safety**
- Validates that matched fields are arrays
- Returns empty array if no valid field is found

### 4. **Multiple Keyword Support**
- Can handle variations like "activity" vs "activities"
- Uses OR logic to try multiple related keywords

## Benefits

1. **Resilient to AI Variability**: Handles inconsistent field naming from AI models
2. **Predictable**: Prioritizes exact matches before fuzzy matching
3. **Maintainable**: Easy to add new preference types or modify matching logic
4. **Type Safe**: Ensures data integrity with proper validation

## Usage Examples

### Basic Usage
```typescript
const preferences = findPreferenceField(data, 'food');
```

### Multiple Keywords
```typescript
const activityPrefs = findPreferenceField(data, 'activity') || 
                     findPreferenceField(data, 'activities');
```

### Validation
```typescript
const foodPrefs = findPreferenceField(data, 'food');
if (foodPrefs.length > 0) {
  // Process the preferences
  await updateUserPreferences(foodPrefs);
}
```

## Implementation Notes

- Always validate that extracted data is an array before processing
- Consider logging field names that were matched for debugging
- Test with various AI model outputs to ensure robustness
- Use this pattern consistently across all structured data extraction

This approach ensures your application can handle the inherent variability in AI-generated structured data while maintaining predictable behavior and type safety.
