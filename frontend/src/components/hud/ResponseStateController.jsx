// src/components/hud/ResponseStateController.jsx

import { useEffect } from "react";
import { useAIState } from "../../context/useAIState";

export default function ResponseStateController() {
  const { aiState, setAIState } = useAIState();

  useEffect(() => {
    if (aiState !== "RESPONDING") {
      return undefined;
    }

    const timer = setTimeout(() => {
      setAIState("IDLE");
    }, 4500);

    return () => {
      clearTimeout(timer);
    };
  }, [aiState, setAIState]);

  return null;
}