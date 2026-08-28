// NEXT CODE
// src/components/controls/AIStateControls.jsx

import { useAIState } from "../../context/useAIState";

export default function AIStateControls() {
  const { aiState, setAIState } = useAIState();

  const states = [
    "IDLE",
    "LISTENING",
    "THINKING",
    "RESPONDING",
  ];

  return (
    <div className="ai-state-controls">
      {states.map((state) => (
        <button
          key={state}
          className={
            aiState === state
              ? "ai-state-button active"
              : "ai-state-button"
          }
          onClick={() => setAIState(state)}
        >
          {state}
        </button>
      ))}
    </div>
  );
}