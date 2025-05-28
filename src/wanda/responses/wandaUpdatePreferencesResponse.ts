import { db } from "../../services/firebase";

export async function wandaUpdatePreferences({
  callId,
  preferenceType,
  action,
  preferences,
}: {
  callId: string;
  preferenceType: "food" | "activities" | "shopping" | "entertainment";
  action: "add" | "remove" | "replace";
  preferences: string[];
}): Promise<{
  message: string;
  error: boolean;
}> {
  console.log("wandaUpdatePreferences called with parameters:", {
    callId,
    preferenceType,
    action,
    preferences,
  });

  try {
    // Get the caller's phone number from the call record
    const callDoc = await db.collection("calls").doc(callId).get();

    if (!callDoc.exists) {
      console.error(`Call record with ID ${callId} not found.`);
      return {
        message: "Call record not found.",
        error: true,
      };
    }

    const callData = callDoc.data();
    const callerPhoneNumber = callData?.callerPhoneNumber;

    if (!callerPhoneNumber) {
      console.error(
        `Caller phone number not found in call record with ID ${callId}.`
      );
      return {
        message: "Caller phone number not found.",
        error: true,
      };
    }

    // Clean the phone number for use as document ID
    const phoneNumberId = callerPhoneNumber.replace("+1", "");
    const callerRef = db.collection("callers").doc(phoneNumberId);

    // Get existing caller data
    const callerDoc = await callerRef.get();
    const existingData = callerDoc.exists
      ? (callerDoc.data() as {
          [key: string]: any;
          foodPreferences?: string[];
          activitiesPreferences?: string[];
          shoppingPreferences?: string[];
          entertainmentPreferences?: string[];
        })
      : {};

    // Clean and validate preferences
    const cleanedPreferences = preferences
      .filter((pref) => pref && pref.trim())
      .map((pref) => pref.trim().toLowerCase());

    if (cleanedPreferences.length === 0) {
      return {
        message: "No valid preferences provided.",
        error: false,
      };
    }

    // Determine the field name based on preference type
    const preferenceField = `${preferenceType}Preferences`;
    const existingPreferences = Array.isArray(existingData[preferenceField])
      ? existingData[preferenceField].map((p: string) => p.toLowerCase())
      : [];

    let updatedPreferences: string[] = [];
    let actionDescription = "";

    switch (action) {
      case "add":
        // Add new preferences, avoiding duplicates
        const uniqueNewPrefs = cleanedPreferences.filter(
          (pref) => !existingPreferences.includes(pref)
        );

        if (uniqueNewPrefs.length === 0) {
          return {
            message: `All of those ${preferenceType} preferences are already saved in your profile.`,
            error: false,
          };
        }

        updatedPreferences = [
          ...(existingData[preferenceField] || []),
          ...uniqueNewPrefs,
        ];
        actionDescription = `added ${uniqueNewPrefs.join(
          ", "
        )} to your ${preferenceType} preferences`;
        break;

      case "remove":
        // Remove specified preferences
        const prefsToRemove = cleanedPreferences;
        updatedPreferences = (existingData[preferenceField] || []).filter(
          (pref: string) => !prefsToRemove.includes(pref.toLowerCase())
        );

        const removedCount =
          (existingData[preferenceField] || []).length -
          updatedPreferences.length;
        if (removedCount === 0) {
          return {
            message: `None of those ${preferenceType} preferences were found in your profile to remove.`,
            error: false,
          };
        }

        actionDescription = `removed ${cleanedPreferences.join(
          ", "
        )} from your ${preferenceType} preferences`;
        break;

      case "replace":
        // Replace all preferences of this type
        updatedPreferences = cleanedPreferences;
        actionDescription = `updated your ${preferenceType} preferences to: ${cleanedPreferences.join(
          ", "
        )}`;
        break;

      default:
        return {
          message:
            "Invalid action specified. Use 'add', 'remove', or 'replace'.",
          error: true,
        };
    }

    // Update the caller's preferences
    const updateData = {
      [preferenceField]: updatedPreferences,
      updatedAt: new Date().toISOString(),
    };

    await callerRef.set(updateData, { merge: true });

    console.log(
      `Updated ${preferenceType} preferences for ${phoneNumberId}:`,
      updateData
    );

    return {
      message: `Great! I've ${actionDescription}. This will help me give you better recommendations!`,
      error: false,
    };
  } catch (error: any) {
    console.error(`Error updating preferences for call ${callId}:`, error);

    return {
      message:
        "I'm sorry, I couldn't update your preferences right now. Please try again later.",
      error: true,
    };
  }
}
