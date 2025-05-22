import { VapiCall } from "../../types";
import { Response } from "express";

interface VapiHangMessage {
  type: "hang";
  call: VapiCall;
}

export async function handleHang(message: VapiHangMessage, res: Response) {
  console.log(`Hang detected for call ${message.call.id}`);

  // You might want to log this event or take some action
  // For now, just acknowledge it
  res.status(200).json({ result: "Hang event acknowledged" });
}
