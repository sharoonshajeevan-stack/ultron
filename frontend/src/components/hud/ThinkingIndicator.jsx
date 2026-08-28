// src/components/hud/ThinkingIndicator.jsx

import { useEffect, useState } from "react";
import { useAIState } from "../../context/useAIState";

import "./ThinkingIndicator.css";

export default function ThinkingIndicator() {
  const { aiState } = useAIState();

  const [dots, setDots] = useState("");

  useEffect(() => {
    if (aiState !== "THINKING") {
      return undefined;
    }

    const timer = setInterval(() => {
      setDots((previous) => {
        if (previous.length >= 3) {
          return "";
        }

        return previous + ".";
      });
    }, 350);

    return () => {
      clearInterval(timer);
    };
  }, [aiState]);

  if (aiState !== "THINKING") {
    return null;
  }

  return (
    <div className="thinking-indicator">
      <span className="thinking-dot" />

      <div className="thinking-text">
        PROCESSING{dots}
      </div>
    </div>
  );
}