import { db } from "../../services/firebase";
import { VapiCall } from "../../types";
import { Response } from "express";

interface VapiStatusUpdateMessage {
  type: "status-update";
  call: VapiCall;
  status: "queued" | "in-progress" | "forwarding" | "ended";
}

export async function handleStatusUpdate(
  message: VapiStatusUpdateMessage,
  res: Response
) {
  console.log(`Status update: ${message.status} for call ${message.call.id}`);

  try {
    // Find the institution and location IDs for this call
    const officeSnapshot = await db
      .collection("calls")
      .doc(message.call.id)
      .get();

    if (!officeSnapshot.exists) {
      await db.collection("calls").doc(message.call.id).update({
        status: message.status,
        updatedAt: new Date().toISOString(),
      });

      console.log(
        `Updated call status to ${message.status} for call ${message.call.id}`
      );
    }

    res.status(200).json({ result: "Status update processed successfully" });
  } catch (error) {
    console.error(`Error updating call status for ${message.call.id}:`, error);
    res.status(200).json({ result: "Status update processing failed" });
  }
}
