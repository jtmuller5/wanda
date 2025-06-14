import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { WandaCaller } from "../types";

export async function loadCaller({
  phoneNumber,
}: {
  phoneNumber: number;
}): Promise<WandaCaller | null> {
  try {
    const callerDoc = await getDoc(doc(db, "callers", String(phoneNumber)));

    if (callerDoc.exists()) {
      const callerData = callerDoc.data();
      console.log("Loaded caller:", callerData);
      return callerData as WandaCaller | null;
    } else {
      // Create a new caller document if it doesn't exist
      const caller = await doc(db, "callers", String(phoneNumber));
      const callerRef = doc(db, "callers", String(phoneNumber));
      setDoc(callerRef, {
        phoneNumber: phoneNumber,
        createdAt: new Date().toISOString(),
      });

      console.log("Created new caller:", caller);

      return {
        createdAt: new Date().toISOString(),
        phoneNumber: String(phoneNumber),
        lastCalledAt: undefined,
      };
    }
  } catch (error) {
    console.error("Error loading caller:", error);
    throw error;
  }
}
