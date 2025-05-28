import { db, getCallerProfile } from "../../services/firebase";

export async function wandaGetProfile({
  callId,
}: {
  callId: string;
}): Promise<{
  message: string;
  error: boolean;
}> {
  console.log("wandaGetProfile called for callId:", callId);

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
    
    // Get caller profile
    const profile = await getCallerProfile(phoneNumberId);

    if (!profile) {
      return {
        message: "I don't have any profile information saved for you yet. Would you like to add some information to help me give you better recommendations?",
        error: false,
      };
    }

    // Build profile summary message
    const profileParts: string[] = ["Here's what I have saved in your profile:"];

    if (profile.name) {
      profileParts.push(`• Name: ${profile.name}`);
    }

    if (profile.age) {
      profileParts.push(`• Age: ${profile.age}`);
    }

    if (profile.city) {
      profileParts.push(`• City: ${profile.city}`);
    }

    if (profile.foodPreferences && profile.foodPreferences.length > 0) {
      const preferences = profile.foodPreferences.join(", ");
      profileParts.push(`• Food preferences: ${preferences}`);
    }

    if (profile.activitiesPreferences && profile.activitiesPreferences.length > 0) {
      const preferences = profile.activitiesPreferences.join(", ");
      profileParts.push(`• Activity preferences: ${preferences}`);
    }

    if (profile.shoppingPreferences && profile.shoppingPreferences.length > 0) {
      const preferences = profile.shoppingPreferences.join(", ");
      profileParts.push(`• Shopping preferences: ${preferences}`);
    }

    if (profile.entertainmentPreferences && profile.entertainmentPreferences.length > 0) {
      const preferences = profile.entertainmentPreferences.join(", ");
      profileParts.push(`• Entertainment preferences: ${preferences}`);
    }

    if (profileParts.length === 1) {
      // Only the intro line was added
      return {
        message: "I have your phone number saved, but no other profile information yet. Would you like to add your name, city, or food preferences?",
        error: false,
      };
    }

    profileParts.push("\nWould you like to update any of this information?");

    return {
      message: profileParts.join("\n"),
      error: false,
    };
  } catch (error: any) {
    console.error(`Error getting profile for call ${callId}:`, error);

    return {
      message: "I'm sorry, I couldn't retrieve your profile information right now. Please try again later.",
      error: true,
    };
  }
}
