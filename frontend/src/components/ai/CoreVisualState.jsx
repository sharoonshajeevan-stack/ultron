// src/components/ai/CoreVisualState.jsx

import { useMemo } from "react";

const STATES = {
  IDLE: {
    color: "#00BFFF",
    glow: 0.8,
    speed: 1,
  },

  LISTENING: {
    color: "#008CFF",
    glow: 1.25,
    speed: 1.35,
  },

  THINKING: {
    color: "#FFFFFF",
    glow: 1.5,
    speed: 0.8,
  },

  RESPONDING: {
    color: "#FF8A00",
    glow: 1.4,
    speed: 1.2,
  },
};

export default function CoreVisualState({
  state = "IDLE",
}) {
  const visual = useMemo(() => {
    return (
      STATES[state] ||
      STATES.IDLE
    );
  }, [state]);

  return {
    state,
    ...visual,
  };
}