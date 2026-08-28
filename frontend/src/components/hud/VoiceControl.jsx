// src/components/hud/VoiceControl.jsx

import { useState } from "react";
import { useAIState } from "../../context/useAIState";

import "./VoiceControl.css";

export default function VoiceControl() {
  const { aiState, setAIState } = useAIState();

  const [enabled, setEnabled] = useState(true);

  const toggleVoice = () => {
    const nextState = !enabled;

    setEnabled(nextState);

    if (!nextState) {
      setAIState("IDLE");

      window.dispatchEvent(
        new CustomEvent("ultron:voice-disable")
      );

      return;
    }

    setAIState("LISTENING");

    window.dispatchEvent(
      new CustomEvent("ultron:voice-enable")
    );
  };

  const startListening = () => {
    if (!enabled) {
      return;
    }

    setAIState("LISTENING");

    window.dispatchEvent(
      new CustomEvent("ultron:voice-start")
    );
  };

  return (
    <div className="voice-control">
      <button
        type="button"
        className={`voice-button ${
          aiState === "LISTENING"
            ? "listening"
            : ""
        } ${!enabled ? "disabled" : ""}`}
        onClick={startListening}
        aria-label="Start voice input"
        disabled={!enabled}
      >
        <span className="voice-button-main">
          {enabled ? "MIC" : "OFF"}
        </span>

        <span className="voice-control-label">
          {aiState === "LISTENING"
            ? "LISTENING"
            : enabled
              ? "VOICE"
              : "MUTED"}
        </span>
      </button>

      <button
        type="button"
        className={`voice-power ${
          enabled ? "enabled" : ""
        }`}
        onClick={toggleVoice}
        aria-label="Toggle voice system"
      >
        <span />
      </button>
    </div>
  );
}