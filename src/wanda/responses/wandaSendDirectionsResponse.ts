import { db, getSearchResults } from "../../services/firebase";
import twilio from "twilio";

export async function wandaSendDirections({
  callId,
  placeName,
  placeAddress,
  placeId,
  placeNumber,
}: {
  callId: string;
  placeName?: string;
  placeAddress?: string;
  placeId?: string;
  placeNumber?: number;
}): Promise<{
  message: string;
  error: boolean;
}> {
  console.log("wandaSendDirections called with parameters:", {
    callId,
    placeName,
    placeAddress,
    placeId,
    placeNumber,
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

    // Resolve place information
    let finalPlaceName = placeName;
    let finalPlaceAddress = placeAddress;
    let finalPlaceId = placeId;

    // If placeNumber is provided, get the place from recent search results
    if (placeNumber && (!placeName || !placeAddress)) {
      const searchResults = await getSearchResults(callId);
      if (searchResults && searchResults.length >= placeNumber) {
        const selectedPlace = searchResults[placeNumber - 1]; // Array is 0-indexed
        finalPlaceName = selectedPlace.name;
        finalPlaceAddress = selectedPlace.address;
        finalPlaceId = selectedPlace.placeId;
      } else {
        return {
          message:
            "I couldn't find that place number in your recent search results. Could you tell me the name of the place you'd like directions to?",
          error: true,
        };
      }
    } else {
      console.log()
    }

    // Validate that we have the required information
    if (!finalPlaceName) {
      return {
        message:
          "I need the name of the place to send you directions. Could you tell me which place you'd like directions to?",
        error: true,
      };
    }

    // Validate Twilio configuration
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      return {
        message: "Twilio configuration is incomplete.",
        error: true,
      };
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Create Google Maps link
    let mapsLink: string;
    if (finalPlaceId) {
      // Use Place ID for more accurate link
      mapsLink = `https://maps.google.com/maps/place/?q=place_id:${finalPlaceId}`;
    } else {
      // Use search query with place name and address
      const searchQuery = encodeURIComponent(
        `${finalPlaceName} ${finalPlaceAddress || ""}`.trim()
      );
      mapsLink = `https://maps.google.com/maps?q=${searchQuery}`;
    }

    // Create the text message
    const messageBody = finalPlaceAddress
      ? `Here are the directions to ${finalPlaceName}:\n\n${finalPlaceAddress}\n\n${mapsLink}\n\nSent by Wanda 🗺️`
      : `Here are the directions to ${finalPlaceName}:\n\n${mapsLink}\n\nSent by Wanda 🗺️`;

    // Send the SMS
    const messageInstance = await client.messages.create({
      body: messageBody,
      from: twilioPhoneNumber,
      to: callerPhoneNumber,
    });

    console.log(
      `Directions SMS sent successfully to ${callerPhoneNumber}: ${messageInstance.sid}`
    );

    // Update the call record to track that directions were sent
    await db.collection("calls").doc(callId).update({
      directionsSent: true,
      directionsSentAt: new Date().toISOString(),
      directionsPlaceName: finalPlaceName,
      directionsPlaceAddress: finalPlaceAddress,
      directionsMessageSid: messageInstance.sid,
    });

    return {
      message: `Perfect! I've sent the directions to ${finalPlaceName} to your phone via text message.`,
      error: false,
    };
  } catch (error: any) {
    console.error("Error sending directions SMS:", error);

    // Log specific Twilio errors for debugging
    if (error.code) {
      console.error("Twilio error code:", error.code);
      console.error("Twilio error message:", error.message);
    }

    return {
      message:
        "I'm sorry, I couldn't send the directions right now. Please try again later.",
      error: true,
    };
  }
}
