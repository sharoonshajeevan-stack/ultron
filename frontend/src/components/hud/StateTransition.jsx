// NEXT CODE
// src/components/hud/StateTransition.jsx

import { useEffect, useRef } from "react";
import { useAIState } from "../../context/useAIState";

export default function StateTransition() {
  const { aiState, setAIState } = useAIState();

  const previousState = useRef(aiState);

  useEffect(() => {
    const previous = previousState.current;

    if (
      previous === "THINKING" &&
      aiState === "RESPONDING"
    ) {
      const timer = setTimeout(() => {
        setAIState("IDLE");
      }, 4500);

      previousState.current = aiState;

      return () => {
        clearTimeout(timer);
      };
    }

    previousState.current = aiState;
  }, [aiState, setAIState]);

  return null;
}