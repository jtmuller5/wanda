import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import type { CreateSquadDTO } from "@vapi-ai/web/dist/api";
import { createIntroAssistant } from "../wanda/assistants/IntroAssistant";
import { createProfileAssistant } from "../wanda/assistants/ProfileAssistant";
import { createReviewAssistant } from "../wanda/assistants/ReviewAssistant";
import { createSearchAssistant } from "../wanda/assistants/SearchAssistant";
import type { WandaVariableValues } from "../types";
import { loadCaller } from "../services/firebase";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import AnimatedOrbs from "./AnimatedOrbs";

interface TranscriptMessage {
  role: string;
  text: string;
  id: string;
  timestamp: number;
}

interface WebCallWidgetProps {
  apiKey: string;
  serverUrl: string;
}

export default function WebCallWidget({
  apiKey,
  serverUrl,
}: WebCallWidgetProps) {
  const [phoneNumber, setPhoneNumber] = useState(() => {
    return localStorage.getItem('wandaPhoneNumber') || "";
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const vapiRef = useRef<Vapi | null>(null);
  const transcriptProcessed = useRef(new Set<string>());

  useEffect(() => {
    // Initialize Vapi instance
    if (apiKey) {
      const vapi = new Vapi(apiKey);
      vapiRef.current = vapi;

      // Set up event listeners
      vapi.on("call-start", () => {
        console.log("Call started");
        setIsConnected(true);
        setIsLoading(false);
      });

      vapi.on("call-end", () => {
        console.log("Call ended");
        setIsConnected(false);
        setIsSpeaking(false);
        setIsLoading(false);
      });

      vapi.on("speech-start", () => {
        console.log("Assistant started speaking");
        setIsSpeaking(true);
      });

      vapi.on("speech-end", () => {
        console.log("Assistant stopped speaking");
        setIsSpeaking(false);
      });

      vapi.on("message", (message) => {
        if (message.type === "transcript" && message.transcriptType === "final") {
          const messageId = `${message.role}-${message.transcript}-${Date.now()}`;
          
          // Only add if we haven't processed this exact transcript
          if (!transcriptProcessed.current.has(messageId)) {
            transcriptProcessed.current.add(messageId);
            
            setTranscript((prev) => [
              ...prev,
              {
                role: message.role,
                text: message.transcript,
                id: messageId,
                timestamp: Date.now(),
              },
            ]);
          }
        }
      });

      vapi.on("error", (error) => {
        console.error("Vapi error:", error);
        setError("Call failed. Please try again.");
        setIsLoading(false);
        setIsConnected(false);
      });
    }

    // Cleanup function
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [apiKey]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, "");

    // Format as (XXX) XXX-XXXX
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(
        6,
        10
      )}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    localStorage.setItem('wandaPhoneNumber', formatted);
  };

  const startCall = async () => {
    if (phoneNumber.length < 14) {
      setError("Please enter a valid phone number");
      return;
    }

    if (!vapiRef.current) {
      setError("Vapi not initialized");
      return;
    }

    setIsLoading(true);
    setError("");
    setTranscript([]);

    try {
      const modelProvider: "google" | "openai" = "openai";
      const model: "gemini-2.0-flash" | "gpt-4o-2024-11-20" =
        "gpt-4o-2024-11-20";

      // Get assistant configuration from server
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");

      const caller = await loadCaller({
        phoneNumber: Number(cleanPhoneNumber),
      });

      const variableValues: WandaVariableValues = {
        callerName: caller?.name,
        newCaller: caller?.lastCalledAt !== undefined,
        callerAge: caller?.age,
        callerCity: caller?.city,
        callerActivitiesPreferences: (caller?.activitiesPreferences || [])
          .map((ap: string) => ap.toLowerCase())
          .join(", "),
        callerShoppingPreferences: (caller?.shoppingPreferences || [])
          .map((sp: string) => sp.toLowerCase())
          .join(", "),
        callerEntertainmentPreferences: (caller?.entertainmentPreferences || [])
          .map((ep: string) => ep.toLowerCase())
          .join(", "),
        callerFoodPreferences: (caller?.foodPreferences || [])
          .map((fp: string) => fp.toLowerCase())
          .join(", "),
      };

      const squadConfig: CreateSquadDTO = {
        members: [
          createIntroAssistant(model, variableValues, modelProvider),
          createSearchAssistant(
            model,
            variableValues,
            modelProvider,
            serverUrl
          ),
          createProfileAssistant(
            model,
            variableValues,
            modelProvider,
            serverUrl
          ),
          createReviewAssistant(
            model,
            variableValues,
            modelProvider,
            serverUrl
          ),
        ],
      };

      // Start the call
      const call = await vapiRef.current.start(
        undefined,
        undefined,
        squadConfig
      );

      console.log("Call started:", call);

      await setDoc(
        doc(db, "calls", call?.id || ""),
        {
          id: call?.id || "",
          callerPhoneNumber: cleanPhoneNumber,
          createdAt: new Date().toISOString(),
          callStart: new Date().toISOString(),
          recordingUrl: null,
        },
        { merge: true }
      );
    } catch (err: any) {
      console.error("Error starting call:", err);
      setError(err.message || "Failed to start call. Please try again.");
      setIsLoading(false);
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    // Clear processed transcript IDs for next call
    transcriptProcessed.current.clear();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 max-w-6xl mx-auto my-16">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🌐</div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Try Wanda on the Web
        </h3>
        <p className="text-slate-600">
          Experience voice discovery directly in your browser
        </p>
      </div>

      {!isConnected ? (
        <div className="max-w-md mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              maxLength={14}
              disabled={isLoading}
            />
            <p className="text-xs text-slate-500 mt-1">
              We'll use this to personalize your experience
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={startCall}
            disabled={phoneNumber.length < 14 || isLoading || !apiKey}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Connecting...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="mr-3">🎤</span>
                Start Voice Call
              </div>
            )}
          </button>

          {!apiKey && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-600">
                Please configure VITE_VAPI_PUBLIC_KEY in environment variables
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Visual Audio Representation */}
          <div className="flex flex-col items-center justify-center space-y-6 p-8">
            {/* Status */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center space-x-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSpeaking ? "bg-red-500" : "bg-green-500"
                  }`}
                ></div>
                <span className="text-sm text-slate-600">
                  {isSpeaking ? "Speaking" : "Listening"}
                </span>
              </div>
            </div>

            {/* Animated Orbs */}
            <AnimatedOrbs isSpeaking={isSpeaking} />

            {/* Call Duration */}

            {/* End Call Button */}
            <button
              onClick={endCall}
              className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              End Call
            </button>
          </div>

          {/* Right side - Live Transcript */}
          <div className="flex flex-col h-96">
            <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <span className="mr-2">💬</span>
              Live Transcript
            </h4>
            
            <div className="flex-1 bg-slate-50 rounded-lg p-4 overflow-y-auto border border-slate-200">
              {transcript.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-500 text-center text-sm">
                    Your conversation will appear here...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transcript.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="flex items-start space-x-2 max-w-[85%]">
                        {msg.role !== "user" && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mt-1 flex-shrink-0">
                            W
                          </div>
                        )}
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                        {msg.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-bold mt-1 flex-shrink-0">
                            Y
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-500">
          This demo uses your browser's microphone. Allow microphone access when prompted.
        </p>
      </div>
    </div>
  );
}
