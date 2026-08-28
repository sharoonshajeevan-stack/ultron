// src/components/hud/AIStatusIndicator.jsx

import { useAIState } from "../../context/useAIState";

import "./AIStatusIndicator.css";

const STATE_INFO = {
  IDLE: {
    label: "STANDBY",
    color: "idle",
  },

  LISTENING: {
    label: "LISTENING",
    color: "listening",
  },

  THINKING: {
    label: "THINKING",
    color: "thinking",
  },

  RESPONDING: {
    label: "RESPONDING",
    color: "responding",
  },
};

export default function AIStatusIndicator() {
  const { aiState } = useAIState();

  const info =
    STATE_INFO[aiState] ||
    STATE_INFO.IDLE;

  return (
    <div
      className={`ai-status-indicator ${info.color}`}
    >
      <span className="ai-status-dot" />

      <span className="ai-status-label">
        {info.label}
      </span>
    </div>
  );
}