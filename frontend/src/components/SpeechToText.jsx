// ============================================================================
// SPEECH-TO-TEXT COMPONENT
// File: src/components/SpeechToText.jsx
// Purpose: Record voice, convert to text, and send transcript to ULTRON
// ============================================================================

import { useState, useEffect } from "react";

import {
  startRecording,
  stopRecording,
  getSTTStatus,
  clearTranscript,
} from "../services/api";

export default function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [sttStatus, setSTTStatus] = useState("Ready");
  const [statusColor, setStatusColor] = useState("#00ff00");

  // --------------------------------------------------------------------------
  // CHECK STT STATUS
  // --------------------------------------------------------------------------

  useEffect(() => {
    const checkSTTStatus = async () => {
      try {
        const result = await getSTTStatus();

        if (result.success) {
          setSTTStatus("Ready");
          setStatusColor("#00ff00");
        } else {
          setSTTStatus("Error");
          setStatusColor("#ff0000");
        }
      } catch (error) {
        console.error("Error checking STT status:", error);
        setSTTStatus("Error");
        setStatusColor("#ff0000");
      }
    };

    checkSTTStatus();
  }, []);

  // --------------------------------------------------------------------------
  // RECORDING TIMER
  // --------------------------------------------------------------------------

  useEffect(() => {
    let timer;

    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((time) => time + 1);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRecording]);

  // --------------------------------------------------------------------------
  // START RECORDING
  // --------------------------------------------------------------------------

  const handleStartRecording = async () => {
    setLoading(true);

    try {
      const result = await startRecording();

      if (result.success) {
        setIsRecording(true);
        setRecordingTime(0);
        setTranscript("");
        setConfidence(0);

        setSTTStatus("Recording...");
        setStatusColor("#00ffff");
      } else {
        setSTTStatus("Start Failed");
        setStatusColor("#ff0000");
      }
    } catch (error) {
      console.error("Error starting recording:", error);

      setSTTStatus("Error");
      setStatusColor("#ff0000");
    }

    setLoading(false);
  };

  // --------------------------------------------------------------------------
  // STOP RECORDING
  // --------------------------------------------------------------------------

  const handleStopRecording = async () => {
    setLoading(true);
    setIsRecording(false);

    setSTTStatus("Processing...");
    setStatusColor("#ffff00");

    try {
      const result = await stopRecording();

      if (result.success) {
        const transcriptText =
          result.data?.data?.transcript ||
          result.data?.transcript ||
          "";

        const transcriptConfidence =
          result.data?.data?.confidence ||
          result.data?.confidence ||
          0;

        // --------------------------------------------------------------
        // DISPLAY TRANSCRIPT
        // --------------------------------------------------------------

        setTranscript(transcriptText);
        setConfidence(transcriptConfidence);

        setSTTStatus("Done");
        setStatusColor("#00ff00");

        // --------------------------------------------------------------
        // SEND TRANSCRIPT TO ULTRON
        // --------------------------------------------------------------

        if (transcriptText.trim()) {
          console.log(
            "🎤 Voice command:",
            transcriptText.trim()
          );

          window.dispatchEvent(
            new CustomEvent("ultron:command", {
              detail: transcriptText.trim(),
            })
          );
        } else {
          console.warn("No speech detected.");

          setSTTStatus("No speech detected");
          setStatusColor("#ff9900");
        }
      } else {
        setSTTStatus("Stop Failed");
        setStatusColor("#ff0000");
      }
    } catch (error) {
      console.error("Error stopping recording:", error);

      setSTTStatus("Error");
      setStatusColor("#ff0000");
    }

    setLoading(false);
  };

  // --------------------------------------------------------------------------
  // CLEAR TRANSCRIPT
  // --------------------------------------------------------------------------

  const handleClearTranscript = async () => {
    try {
      await clearTranscript();

      setTranscript("");
      setConfidence(0);
      setSTTStatus("Ready");
      setStatusColor("#00ff00");
    } catch (error) {
      console.error("Error clearing transcript:", error);
    }
  };

  // --------------------------------------------------------------------------
  // FORMAT RECORDING TIME
  // --------------------------------------------------------------------------

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${minutes}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // --------------------------------------------------------------------------
  // UI
  // --------------------------------------------------------------------------

  return (
    <div
      style={{
        position: "fixed",
        top: "400px",
        left: "20px",

        backgroundColor: "rgba(0, 0, 0, 0.95)",

        border: `2px solid ${statusColor}`,
        borderRadius: "10px",

        padding: "20px",

        color: "#00ff00",

        fontFamily: "monospace",

        width: "360px",
        maxWidth: "calc(100vw - 40px)",

        zIndex: 9996,

        boxShadow: `0 0 20px ${statusColor}`,
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* TITLE */}
      {/* ------------------------------------------------------------------ */}

      <div
        style={{
          marginBottom: "15px",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        🎤 SPEECH-TO-TEXT
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STATUS */}
      {/* ------------------------------------------------------------------ */}

      <div
        style={{
          marginBottom: "15px",

          padding: "10px",

          backgroundColor: "#0a0a0a",

          border: `1px solid ${statusColor}`,
          borderRadius: "5px",

          textAlign: "center",

          fontSize: "12px",

          color: statusColor,
        }}
      >
        <div
          style={{
            fontSize: "10px",
            opacity: 0.7,
          }}
        >
          Status:
        </div>

        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {sttStatus}
        </div>

        {isRecording && (
          <div
            style={{
              fontSize: "12px",
              marginTop: "5px",
              color: "#ff6600",
            }}
          >
            ⏱️ {formatTime(recordingTime)}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* RECORDING CONTROLS */}
      {/* ------------------------------------------------------------------ */}

      <div
        style={{
          marginBottom: "15px",
          display: "flex",
          gap: "5px",
        }}
      >
        {/* START */}

        <button
          onClick={handleStartRecording}
          disabled={isRecording || loading}
          style={{
            flex: 1,

            padding: "8px",

            backgroundColor: isRecording
              ? "#330000"
              : "#00ff00",

            color: isRecording
              ? "#666666"
              : "#000000",

            border: "none",
            borderRadius: "5px",

            fontWeight: "bold",

            cursor:
              isRecording || loading
                ? "not-allowed"
                : "pointer",

            opacity:
              isRecording || loading
                ? 0.5
                : 1,

            fontSize: "12px",
          }}
        >
          {loading && !isRecording
            ? "Starting..."
            : "Start Recording"}
        </button>

        {/* STOP */}

        <button
          onClick={handleStopRecording}
          disabled={!isRecording || loading}
          style={{
            flex: 1,

            padding: "8px",

            backgroundColor: !isRecording
              ? "#330000"
              : "#ff0000",

            color: !isRecording
              ? "#666666"
              : "#ffffff",

            border: "none",
            borderRadius: "5px",

            fontWeight: "bold",

            cursor:
              !isRecording || loading
                ? "not-allowed"
                : "pointer",

            opacity:
              !isRecording || loading
                ? 0.5
                : 1,

            fontSize: "12px",
          }}
        >
          {loading && !isRecording
            ? "Processing..."
            : "Stop Recording"}
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TRANSCRIPT */}
      {/* ------------------------------------------------------------------ */}

      {transcript && (
        <div
          style={{
            marginBottom: "15px",

            padding: "10px",

            backgroundColor: "#0a0a0a",

            border: "1px solid #00ff00",
            borderRadius: "5px",

            fontSize: "11px",

            minHeight: "50px",
          }}
        >
          <div
            style={{
              opacity: 0.7,
              marginBottom: "5px",
            }}
          >
            Transcript:
          </div>

          <div
            style={{
              fontSize: "12px",
              marginBottom: "5px",
              color: "#00ff00",
              wordBreak: "break-word",
            }}
          >
            {transcript}
          </div>

          <div
            style={{
              opacity: 0.5,
              fontSize: "10px",
            }}
          >
            Confidence:{" "}
            {(confidence * 100).toFixed(0)}%
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* CLEAR */}
      {/* ------------------------------------------------------------------ */}

      {transcript && (
        <button
          onClick={handleClearTranscript}
          style={{
            width: "100%",

            padding: "6px",

            backgroundColor: "#330000",

            color: "#ff0000",

            border: "1px solid #ff0000",
            borderRadius: "3px",

            cursor: "pointer",

            fontSize: "11px",

            marginBottom: "10px",
          }}
        >
          Clear Transcript
        </button>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* INFO */}
      {/* ------------------------------------------------------------------ */}

      <div
        style={{
          fontSize: "10px",
          opacity: 0.7,
          marginTop: "10px",
        }}
      >
        <div>🎤 Language: English</div>
        <div>⏱️ Maximum: 30 seconds</div>
        <div>🤖 Engine: Whisper AI</div>
      </div>
    </div>
  );
}