import { db, updateCallRecordingUrl } from "../../services/firebase";
import { VapiCall } from "../../types";
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
    // Find the institution and location IDs for this call
    const officeSnapshot = await db
      .collection("calls")
      .doc(message.call.id)
      .get();

    if (!officeSnapshot.exists) {
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
