import { ServerMessageEndOfCallReport } from "@vapi-ai/server-sdk/api";
import {
  db,
  updateCallRecordingUrl,
  updateCallerPreferencesFromCall,
} from "../../services/firebase";
//import {  CallAnalysisStructuredData } from "../../types";
import { Response } from "express";

export async function handleEndOfCallReport(message: any, res: Response) {
  console.log(
    `End of call report for call ${message.call?.id}, reason: ${message.endedReason}`
  );

  console.log("End of call report message:", message);

  try {
    const callSnapshot = await db
      .collection("calls")
      .doc(message.call?.id || "")
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
      if (message.analysis?.structuredData && callData?.callerPhoneNumber) {
        const structuredData = message.analysis.structuredData;
        const phoneNumberId = callData.callerPhoneNumber.replace("+1", "");

        console.log(
          `Processing structured data for caller ${phoneNumberId}:`,
          structuredData
        );

        // Helper function to find preference field by name pattern
        const findPreferenceField = (data: any, preferenceType: string): string[] => {
          // First try exact matches
          const exactMatches = [
            `${preferenceType}_preferences`,
            `${preferenceType}Preferences`,
            preferenceType
          ];
          
          for (const field of exactMatches) {
            if (data[field] && Array.isArray(data[field])) {
              return data[field];
            }
          }
          
          // If no exact match, find first field containing the preference type
          const keys = Object.keys(data);
          const matchingKey = keys.find(key => 
            key.toLowerCase().includes(preferenceType.toLowerCase()) &&
            Array.isArray(data[key])
          );
          
          return matchingKey ? data[matchingKey] : [];
        };

        // Only update if there's meaningful data (at least one non-empty array)
        const foodPreferences = findPreferenceField(structuredData, 'food');
        const activityPreferences = findPreferenceField(structuredData, 'activity') || 
                                   findPreferenceField(structuredData, 'activities');
        const shoppingPreferences = findPreferenceField(structuredData, 'shopping');
        const entertainmentPreferences = findPreferenceField(structuredData, 'entertainment');

        const hasNewPreferences =
          (foodPreferences && foodPreferences.length > 0) ||
          (activityPreferences && activityPreferences.length > 0) ||
          (shoppingPreferences && shoppingPreferences.length > 0) ||
          (entertainmentPreferences && entertainmentPreferences.length > 0);

        if (hasNewPreferences) {
          try {
            await updateCallerPreferencesFromCall({
              phoneNumber: phoneNumberId,
              preferences: {
                foodPreferences,
                activitiesPreferences: activityPreferences,
                shoppingPreferences,
                entertainmentPreferences,
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
