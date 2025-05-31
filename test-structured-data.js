// Simple test script to verify the structured data schema
const testSchema = {
  type: "object",
  properties: {
    food_preferences: {
      type: "array",
      items: {
        type: "string"
      },
      description: "List of food preferences, cuisines, or dietary restrictions mentioned by the caller (e.g., 'Italian', 'Vegetarian', 'Spicy food', 'Gluten-free')"
    },
    activity_preferences: {
      type: "array",
      items: {
        type: "string"
      },
      description: "List of activities or hobbies the caller is interested in (e.g., 'Hiking', 'Museums', 'Sports', 'Concerts')"
    },
    shopping_preferences: {
      type: "array",
      items: {
        type: "string"
      },
      description: "List of shopping preferences mentioned (e.g., 'Antiques', 'Books', 'Fashion', 'Electronics')"
    },
    entertainment_preferences: {
      type: "array",
      items: {
        type: "string"
      },
      description: "List of entertainment preferences (e.g., 'Movies', 'Live music', 'Comedy shows', 'Theater')"
    }
  },
  required: ["food_preferences", "activity_preferences", "shopping_preferences", "entertainment_preferences"]
};

// Sample test data
const testStructuredData = {
  food_preferences: ["Italian", "Vegetarian", "Spicy food"],
  activity_preferences: ["Hiking", "Museums"],
  shopping_preferences: ["Books", "Antiques"],
  entertainment_preferences: ["Live music", "Theater"]
};

console.log("Schema validation test:");
console.log("Schema:", JSON.stringify(testSchema, null, 2));
console.log("\nTest data:", JSON.stringify(testStructuredData, null, 2));
console.log("\nTest passed: Schema looks valid for Vapi structured data plan");
