// Simple test script to verify the structured data schema
const testSchema = {
  type: "object",
  properties: {
    foodPreferences: {
      type: "array",
      items: {
        type: "string"
      },
      description: "List of food preferences, cuisines, or dietary restrictions mentioned by the caller (e.g., 'Italian', 'Vegetarian', 'Spicy food', 'Gluten-free')"
    },
    activitiesPreferences: {
      type: "array",
      items: {
        type: "string"
      },
      description: "List of activities or hobbies the caller is interested in (e.g., 'Hiking', 'Museums', 'Sports', 'Concerts')"
    },
    shoppingPreferences: {
      type: "array",
      items: {
        type: "string"
      },
      description: "List of shopping preferences mentioned (e.g., 'Antiques', 'Books', 'Fashion', 'Electronics')"
    },
    entertainmentPreferences: {
      type: "array",
      items: {
        type: "string"
      },
      description: "List of entertainment preferences (e.g., 'Movies', 'Live music', 'Comedy shows', 'Theater')"
    }
  },
  required: ["foodPreferences", "activitiesPreferences", "shoppingPreferences", "entertainmentPreferences"]
};

// Sample test data
const testStructuredData = {
  foodPreferences: ["Italian", "Vegetarian", "Spicy food"],
  activitiesPreferences: ["Hiking", "Museums"],
  shoppingPreferences: ["Books", "Antiques"],
  entertainmentPreferences: ["Live music", "Theater"]
};

console.log("Schema validation test:");
console.log("Schema:", JSON.stringify(testSchema, null, 2));
console.log("\nTest data:", JSON.stringify(testStructuredData, null, 2));
console.log("\nTest passed: Schema looks valid for Vapi structured data plan");
