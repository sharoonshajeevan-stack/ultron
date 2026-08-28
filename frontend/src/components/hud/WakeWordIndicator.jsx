// NEW FILE
// src/components/hud/WakeWordIndicator.jsx

import { useEffect, useState } from "react";

import "./WakeWordIndicator.css";

export default function WakeWordIndicator() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleWakeWord = () => {
      setActive(true);

      const timer = setTimeout(() => {
        setActive(false);
      }, 2500);

      return () => clearTimeout(timer);
    };

    window.addEventListener(
      "ultron:wakeword",
      handleWakeWord
    );

    return () => {
      window.removeEventListener(
        "ultron:wakeword",
        handleWakeWord
      );
    };
  }, []);

  if (!active) return null;

  return (
    <div className="wake-word-indicator">
      <div className="wake-word-ring" />

      <div className="wake-word-content">
        <span className="wake-word-dot" />

        <span className="wake-word-text">
          ULTRON
        </span>

        <span className="wake-word-status">
          ACTIVATED
        </span>
      </div>
    </div>
  );
}