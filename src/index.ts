import express, { Request, Response } from "express";
import "dotenv/config";
import { VapiCallRequest } from "./types";
import { WandaVariableValues } from "./wanda/config";
import { db, loadCaller } from "./services/firebase";
import ngrok from "ngrok";
import { handleHang } from "./wanda/event-handlers/handleHang";
import { handleEndOfCallReport } from "./wanda/event-handlers/handleEndOfCallReport";
import { handleStatusUpdate } from "./wanda/event-handlers/handleStatusUpdate";
import { handleFunctionCall } from "./wanda/event-handlers/handleFunctionCall";
import { createIntroAssistant } from "./wanda/assistants/IntroAssistant";
import { createSearchAssistant } from "./wanda/assistants/SearchAssistant";
import { createProfileAssistant } from "./wanda/assistants/ProfileAssistant";
import { Vapi } from "@vapi-ai/server-sdk";

// Create Express application
const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Vapi Build Challenge API!" });
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

const PORT = parseInt(process.env.PORT || "3000", 10);

// Start the server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  // Set up ngrok
  if (process.env.LOCAL?.toString().toLowerCase() === "true") {
    try {
      const url = await ngrok.connect({
        addr: PORT,
        subdomain: process.env.NGROK_SUBDOMAIN,
      });
      console.log(`Wanda URL: ${url}/wanda`);
    } catch (error) {
      console.error("Error setting up ngrok:", error);
    }
  }
});

app.post("/wanda", async (req, res) => {
  console.log("Received POST request on /wanda"); // Log start
  console.log("Received voice call:", JSON.stringify(req.body));

  const { message } = req.body as VapiCallRequest;

  // const locationId = req.query.locationId as string;
  // const overflow = Boolean(req.query.overflow);

  const caller = await loadCaller({
    phoneNumber: Number(message.customer.number.replace("+1", "")),
  });

  const callId = message.call.id;
  await db.collection("calls").doc(callId).set(
    {
      id: callId,
      callerPhoneNumber: message.customer.number,
      createdAt: new Date().toISOString(),
      callStart: new Date().toISOString(),
      recordingUrl: null,
    },
    { merge: true }
  );

  const variableValues: WandaVariableValues = {
    callerName: undefined,
  };

  try {
    const modelProvider: "google" | "openai" = "openai";
    const model: "gemini-2.0-flash" | "gpt-4o-2024-11-20" = "gpt-4o-2024-11-20";
    console.log("Request body:", req.body); // Log request body

    // Validate API key
    const apiKey = process.env.VAPI_API_KEY;
    if (!apiKey) {
      console.log("VAPI_API_KEY not configured"); // Log API key issue
      res.status(500).json({ error: "VAPI_API_KEY not configured" });
      return; // Ensure exit after response
    }
    console.log("VAPI_API_KEY validated");

    const members: Vapi.SquadMemberDto[] = [
      createIntroAssistant(model, variableValues, modelProvider),
      createSearchAssistant(
        model,
        variableValues,
        modelProvider,
        `https://${req.headers.host}`
      ),
      createProfileAssistant(
        model,
        variableValues,
        modelProvider,
        `https://${req.headers.host}`
      ),
    ];

    const responseBody = {
      phoneNumberId: "0eac8823-cc7f-4e85-8d05-dee356a4522f",
      phoneCallProviderBypassEnabled: true,
      customer: {
        number: message.customer.number,
      },
      squad: {
        members,
        membersOverrides: {
          transcriber: {
            language: "en",
            smartFormat: true,
            provider: "deepgram",
            endpointing: 120,
            model: "nova-3-general",
          },
          voice: {
            provider: "11labs",
            voiceId: "56AoDkrOh6qfVPDXZ7Pt",
            useSpeakerBoost: true,
            style: 0,
            optimizeStreamingLatency: 4,
            speed: 0.96,
            model: "eleven_turbo_v2_5",
            stability: 0.5,
          },
          serverMessages: [
            "tool-calls",
            "status-update",
            "end-of-call-report",
            "hang",
          ],
          server: { url: `https://${req.headers.host}/events` },
        },
      },
    };
    console.log("Sending response to Vapi:", responseBody);

    res.json(responseBody);
  } catch (error) {
    console.error("Error creating Vapi call:", error); // Log error
    // Check if headers have already been sent before sending error response
    if (!res.headersSent) {
      console.log("Sending error response to client");
      res.status(500).json({ error: "Failed to create Vapi call" });
    } else {
      console.log("Headers already sent, cannot send error response.");
    }
  }
});

app.post("/wanda-twilio", async (req, res) => {
  console.log("Received POST request on /wanda"); // Log start
  console.log("Received voice call:", JSON.stringify(req.body));

  const { message } = req.body as VapiCallRequest;

  // const locationId = req.query.locationId as string;
  // const overflow = Boolean(req.query.overflow);

  const caller = await loadCaller({
    phoneNumber: Number(message.customer.number.replace("+1", "")),
  });

  const callId = message.call.id;
  await db.collection("calls").doc(callId).set(
    {
      id: callId,
      callerPhoneNumber: message.customer.number,
      createdAt: new Date().toISOString(),
      callStart: new Date().toISOString(),
      recordingUrl: null,
    },
    { merge: true }
  );

  const variableValues: WandaVariableValues = {
    callerName: undefined,
  };

  try {
    const modelProvider: "google" | "openai" = "openai";
    const model: "gemini-2.0-flash" | "gpt-4o-2024-11-20" = "gpt-4o-2024-11-20";
    console.log("Request body:", req.body);

    // Validate API key
    const apiKey = process.env.VAPI_API_KEY;
    if (!apiKey) {
      console.log("VAPI_API_KEY not configured"); // Log API key issue
      res.status(500).json({ error: "VAPI_API_KEY not configured" });
      return; // Ensure exit after response
    }
    console.log("VAPI_API_KEY validated");

    const members: Vapi.SquadMemberDto[] = [
      createIntroAssistant(model, variableValues, modelProvider),
      createSearchAssistant(
        model,
        variableValues,
        modelProvider,
        `https://${req.headers.host}`
      ),
      createProfileAssistant(
        model,
        variableValues,
        modelProvider,
        `https://${req.headers.host}`
      ),
    ];

    const requestBody = JSON.stringify({
      phoneNumberId: "0eac8823-cc7f-4e85-8d05-dee356a4522f",
      phoneCallProviderBypassEnabled: true,
      customer: {
        number: message.customer.number,
      },
      squad: {
        members,
        membersOverrides: {
          transcriber: {
            language: "en",
            smartFormat: true,
            provider: "deepgram",
            endpointing: 120,
            model: "nova-3-general",
          },
          voice: {
            provider: "11labs",
            voiceId: "56AoDkrOh6qfVPDXZ7Pt",
            useSpeakerBoost: true,
            style: 0,
            optimizeStreamingLatency: 4,
            speed: 0.96,
            model: "eleven_turbo_v2_5",
            stability: 0.5,
          },
          serverMessages: [
            "tool-calls",
            "status-update",
            "end-of-call-report",
            "hang",
          ],
        },
      },
      assistantOverrides: {
        server: { url: `https://${req.headers.host}/events` },
      },
    });
    console.log("Sending request to Wanda API:", requestBody); // Log Vapi request body

    // Initialize a call with Vapi using WebSocket transport
    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: requestBody,
    });
    console.log("Received response from Vapi API, status:", response.status); // Log Vapi response status

    const callData = await response.json();
    console.log("Parsed Vapi response data:", callData); // Log parsed Vapi response

    const returnedTwiml = callData.phoneCallProviderDetails.twiml;
    res.type("text/xml").send(returnedTwiml);
  } catch (error) {
    console.error("Error creating Vapi call:", error); // Log error
    // Check if headers have already been sent before sending error response
    if (!res.headersSent) {
      console.log("Sending error response to client");
      res.status(500).json({ error: "Failed to create Vapi call" });
    } else {
      console.log("Headers already sent, cannot send error response.");
    }
  }
});

// Main endpoint to handle Vapi server events
app.post("/events", express.json(), async (req, res) => {
  const { message } = req.body;

  if (!message || !message.call || !message.call.id) {
    console.error("Invalid Vapi message format:", req.body);
    res.status(400).json({ error: "Invalid message format" });
  }

  const callId = message.call.id;
  console.log(`Received Vapi ${message.type} event for call ID: ${callId}`);

  try {
    // Handle different message types
    switch (message.type) {
      case "tool-calls":
        await handleFunctionCall(message, res);
        break;

      case "status-update":
        await handleStatusUpdate(message, res);
        break;

      case "end-of-call-report":
        await handleEndOfCallReport(message, res);
        break;

      case "hang":
        await handleHang(message, res);
        break;

      default:
        console.log(`Unknown message type: ${(message as any).type}`);
        //console.log("Message details:", message);
        res.status(200).json({ result: "Acknowledged unknown message type" });
    }
  } catch (error) {
    console.error(`Error handling Vapi message for call ${callId}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;
