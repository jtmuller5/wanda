import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
import { WandaCaller } from "../types";

dotenv.config();

const { privateKey } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY!);

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  }),
});

/* const firebaseConfig = {
  apiKey: "AIzaSyCZ0gc2lqqW5iQ_lYG-fWbmJPUr8z9zWt8",
  authDomain: "wanda-74cc9.firebaseapp.com",
  projectId: "wanda-74cc9",
  storageBucket: "wanda-74cc9.firebasestorage.app",
  messagingSenderId: "619111313715",
  appId: "1:619111313715:web:e36dd199a5ce2df6610e46",
  measurementId: "G-X16PYMLPFB",
}; */

// const app = initializeApp(firebaseConfig);

export const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

export async function updateCallRecordingUrl({
  callSid,
  url,
}: {
  callSid: string;
  url: string;
}) {
  console.log("Updating call recording URL:", url);
  console.log("Call SID:", callSid);

  try {
    // Update the Firestore document with the recording URL
    await db.collection("calls").doc(callSid).update({
      recordingUrl: url,
    });

    return {
      success: true,
      url: url,
    };
  } catch (error) {
    console.error("Error updating call recording URL:", error);
    throw error;
  }
}

export async function loadCaller({
  phoneNumber,
}: {
  phoneNumber: number;
}): Promise<WandaCaller | null> {
  try {
    const callerRef = db.collection("callers").doc(String(phoneNumber));
    const callerDoc = await callerRef.get();

    if (callerDoc.exists) {
      return callerDoc.data() as WandaCaller | null;
    } else {
      // Create a new caller document if it doesn't exist
      const caller = await callerRef.set({
        phoneNumber: phoneNumber,
        createdAt: new Date().toISOString(),
      });

      console.log("Created new caller:", caller);

      return {
        createdAt: new Date().toISOString(),
        phoneNumber: phoneNumber,
        lastCalledAt: undefined,
      };
    }
  } catch (error) {
    console.error("Error loading caller:", error);
    throw error;
  }
}

export async function storeSearchResults({
  callId,
  searchResults,
}: {
  callId: string;
  searchResults: Array<{
    name: string;
    address: string;
    placeId: string;
  }>;
}) {
  try {
    await db.collection("calls").doc(callId).update({
      lastSearchResults: searchResults,
      lastSearchAt: new Date().toISOString(),
    });
    console.log(`Stored search results for call ${callId}`);
  } catch (error) {
    console.error("Error storing search results:", error);
    throw error;
  }
}

export async function getSearchResults(callId: string): Promise<Array<{
  name: string;
  address: string;
  placeId: string;
}> | null> {
  try {
    const callDoc = await db.collection("calls").doc(callId).get();
    if (callDoc.exists) {
      const data = callDoc.data();
      return data?.lastSearchResults || null;
    }
    return null;
  } catch (error) {
    console.error("Error getting search results:", error);
    return null;
  }
}

export async function getCallerProfile(phoneNumber: string): Promise<{
  name?: string;
  age?: number;
  city?: string;
  foodPreferences?: string[];
  activitiesPreferences?: string[];
  shoppingPreferences?: string[];
  entertainmentPreferences?: string[];
  createdAt: string;
  updatedAt?: string;
} | null> {
  try {
    const callerRef = db.collection("callers").doc(phoneNumber);
    const callerDoc = await callerRef.get();

    if (callerDoc.exists) {
      return callerDoc.data() as {
        name?: string;
        age?: number;
        city?: string;
        foodPreferences?: string[];
        activitiesPreferences?: string[];
        shoppingPreferences?: string[];
        entertainmentPreferences?: string[];
        createdAt: string;
        updatedAt?: string;
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting caller profile:", error);
    return null;
  }
}

export async function updateCallerPreferencesFromCall({
  phoneNumber,
  preferences,
}: {
  phoneNumber: string;
  preferences: {
    foodPreferences?: string[];
    activitiesPreferences?: string[];
    shoppingPreferences?: string[];
    entertainmentPreferences?: string[];
  };
}): Promise<void> {
  try {
    const callerRef = db.collection("callers").doc(phoneNumber);
    const callerDoc = await callerRef.get();
    
    let existingPreferences = {
      foodPreferences: [] as string[],
      activitiesPreferences: [] as string[],
      shoppingPreferences: [] as string[],
      entertainmentPreferences: [] as string[],
    };
    
    if (callerDoc.exists) {
      const data = callerDoc.data();
      existingPreferences = {
        foodPreferences: data?.foodPreferences || [],
        activitiesPreferences: data?.activitiesPreferences || [],
        shoppingPreferences: data?.shoppingPreferences || [],
        entertainmentPreferences: data?.entertainmentPreferences || [],
      };
    }
    
    // Merge new preferences with existing ones, avoiding duplicates
    const updateData: any = {
      updatedAt: new Date().toISOString(),
      lastCalledAt: new Date().toISOString(),
    };
    
    // Helper function to merge arrays and remove duplicates (case-insensitive)
    const mergePreferences = (existing: string[], newPrefs: string[] = []): string[] => {
      const combined = [...existing];
      newPrefs.forEach(pref => {
        const normalized = pref.trim().toLowerCase();
        if (!combined.some(existing => existing.toLowerCase() === normalized)) {
          combined.push(pref.trim());
        }
      });
      return combined;
    };
    
    if (preferences.foodPreferences && preferences.foodPreferences.length > 0) {
      updateData.foodPreferences = mergePreferences(existingPreferences.foodPreferences, preferences.foodPreferences);
    }
    
    if (preferences.activitiesPreferences && preferences.activitiesPreferences.length > 0) {
      updateData.activitiesPreferences = mergePreferences(existingPreferences.activitiesPreferences, preferences.activitiesPreferences);
    }
    
    if (preferences.shoppingPreferences && preferences.shoppingPreferences.length > 0) {
      updateData.shoppingPreferences = mergePreferences(existingPreferences.shoppingPreferences, preferences.shoppingPreferences);
    }
    
    if (preferences.entertainmentPreferences && preferences.entertainmentPreferences.length > 0) {
      updateData.entertainmentPreferences = mergePreferences(existingPreferences.entertainmentPreferences, preferences.entertainmentPreferences);
    }
    
    await callerRef.set(updateData, { merge: true });
    
    console.log(`Updated caller preferences for ${phoneNumber}:`, updateData);
  } catch (error) {
    console.error("Error updating caller preferences:", error);
    throw error;
  }
}
