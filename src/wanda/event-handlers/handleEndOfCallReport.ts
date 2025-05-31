import {
  db,
  updateCallRecordingUrl,
  updateCallerPreferencesFromCall,
} from "../../services/firebase";
import { VapiCall, CallAnalysisStructuredData } from "../../types";
import { Response } from "express";

interface VapiEndOfCallReportMessage {
  type: "end-of-call-report";
  endedReason: string;
  call: VapiCall;
  recordingUrl?: string;
  summary?: string;
  transcript?: string;
  messages?: Array<{
    role: "assistant" | "user";
    message: string;
  }>;
}

export async function handleEndOfCallReport(
  message: VapiEndOfCallReportMessage,
  res: Response
) {
  console.log(
    `End of call report for call ${message.call.id}, reason: ${message.endedReason}`
  );

  console.log("End of call report message:", message);

  try {
    const callSnapshot = await db
      .collection("calls")
      .doc(message.call.id)
      .get();

    if (callSnapshot.exists) {
      const callData = callSnapshot.data();

      await db
        .collection("calls")
        .doc(message.call.id)
        .update({
          status: "ended",
          endedReason: message.endedReason,
          summary: message.summary || null,
          transcript: message.transcript || null,
          callEnd: new Date().toISOString(),
        });

      // If there's a recording URL, update that too
      if (message.recordingUrl) {
        await updateCallRecordingUrl({
          callSid: message.call.id,
          url: message.recordingUrl,
        });
      }

      // Process structured data to update caller preferences
      if (
        message.call.analysis?.structuredData &&
        callData?.callerPhoneNumber
      ) {
        const structuredData = message.call.analysis
          .structuredData as CallAnalysisStructuredData;
        const phoneNumberId = callData.callerPhoneNumber.replace("+1", "");

        console.log(
          `Processing structured data for caller ${phoneNumberId}:`,
          structuredData
        );

        // Only update if there's meaningful data (at least one non-empty array)
        const hasNewPreferences =
          (structuredData.food_preferences &&
            structuredData.food_preferences.length > 0) ||
          (structuredData.activity_preferences &&
            structuredData.activity_preferences.length > 0) ||
          (structuredData.shopping_preferences &&
            structuredData.shopping_preferences.length > 0) ||
          (structuredData.entertainment_preferences &&
            structuredData.entertainment_preferences.length > 0);

        if (hasNewPreferences) {
          try {
            await updateCallerPreferencesFromCall({
              phoneNumber: phoneNumberId,
              preferences: {
                foodPreferences: structuredData.food_preferences,
                activitiesPreferences: structuredData.activity_preferences,
                shoppingPreferences: structuredData.shopping_preferences,
                entertainmentPreferences:
                  structuredData.entertainment_preferences,
              },
            });

            console.log(
              `Successfully updated preferences for caller ${phoneNumberId}`
            );
          } catch (preferencesError) {
            console.error(
              `Error updating preferences for caller ${phoneNumberId}:`,
              preferencesError
            );
            // Don't fail the entire process if preference update fails
          }
        } else {
          console.log(
            `No new preferences found in structured data for caller ${phoneNumberId}`
          );
        }
      } else {
        console.log(`No structured data available for call ${message.call.id}`);
      }

      console.log(
        `Updated call with end of call report for ${message.call.id}`
      );
    }

    res
      .status(200)
      .json({ result: "End of call report processed successfully" });
  } catch (error) {
    console.error(
      `Error processing end of call report for ${message.call.id}:`,
      error
    );
    res.status(200).json({ result: "End of call report processing failed" });
  }
}
