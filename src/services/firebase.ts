import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

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
}): Promise<any> {
  try {
    const callerRef = db.collection("callers").doc(String(phoneNumber));
    const callerDoc = await callerRef.get();

    if (callerDoc.exists) {
      return callerDoc.data();
    } else {
      // Create a new caller document if it doesn't exist
      const caller = await callerRef.set({
        phoneNumber: phoneNumber,
        createdAt: new Date().toISOString(),
      });

      console.log("Created new caller:", caller);

      return caller;
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
