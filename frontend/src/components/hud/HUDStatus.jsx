// NEXT CODE
// NEW FILE
// src/components/hud/HUDStatus.jsx

import { useAIState } from "../../context/useAIState";
import "./HUDStatus.css";

const STATE_INFO = {
  IDLE: {
    title: "STANDBY",
    message: "Awaiting command",
  },

  LISTENING: {
    title: "LISTENING",
    message: "Awaiting voice input",
  },

  THINKING: {
    title: "PROCESSING",
    message: "Analyzing request",
  },

  RESPONDING: {
    title: "RESPONDING",
    message: "Generating response",
  },
};

export default function HUDStatus() {
  const { aiState } = useAIState();

  const info =
    STATE_INFO[aiState] ||
    STATE_INFO.IDLE;

  return (
    <div
      className={`hud-status hud-status-${aiState.toLowerCase()}`}
    >
      <div className="hud-status-title">
        {info.title}
      </div>

      <div className="hud-status-message">
        {info.message}
      </div>
    </div>
  );
}