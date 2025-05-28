import { db } from "../../services/firebase";

export async function wandaUpdateProfile({
  callId,
  name,
  age,
  city,
}: {
  callId: string;
  name?: string;
  age?: number;
  city?: string;
}): Promise<{
  message: string;
  error: boolean;
}> {
  console.log("wandaUpdateProfile called with parameters:", {
    callId,
    name,
    age,
    city,
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

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    const updatedFields: string[] = [];

    // Update name if provided
    if (name && name.trim()) {
      updateData.name = name.trim();
      updatedFields.push("name");
    }

    // Update age if provided
    if (age && age > 0 && age < 150) {
      updateData.age = age;
      updatedFields.push("age");
    }

    // Update city if provided
    if (city && city.trim()) {
      updateData.city = city.trim();
      updatedFields.push("city");
    }

    // Check if there's anything to update
    if (updatedFields.length === 0) {
      return {
        message: "No valid information provided to update your profile.",
        error: false,
      };
    }

    // Update the caller's profile
    await callerRef.set(updateData, { merge: true });

    console.log(`Updated caller profile for ${phoneNumberId}:`, updateData);

    // Build success message
    let message = "Great! I've updated your profile with your ";
    
    if (updatedFields.length === 1) {
      message += updatedFields[0];
    } else if (updatedFields.length === 2) {
      message += `${updatedFields[0]} and ${updatedFields[1]}`;
    } else {
      message += updatedFields.slice(0, -1).join(", ") + ", and " + updatedFields[updatedFields.length - 1];
    }
    
    message += ". This will help me give you better recommendations in the future!";

    return {
      message,
      error: false,
    };
  } catch (error: any) {
    console.error(`Error updating profile for call ${callId}:`, error);

    return {
      message: "I'm sorry, I couldn't update your profile right now. Please try again later.",
      error: true,
    };
  }
}
