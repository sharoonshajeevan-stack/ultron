// src/components/hud/VoiceActivity.jsx

import { useEffect, useState } from "react";
import { useAIState } from "../../context/useAIState";

import "./VoiceActivity.css";

const BAR_COUNT = 9;

const IDLE_LEVELS = [
  0.2,
  0.2,
  0.2,
  0.2,
  0.2,
  0.2,
  0.2,
  0.2,
  0.2,
];

export default function VoiceActivity() {
  const { aiState } = useAIState();

  const [level, setLevel] =
    useState(IDLE_LEVELS);

  useEffect(() => {
    if (aiState !== "LISTENING") {
      return undefined;
    }

    let frame = 0;

    const interval = setInterval(() => {
      frame += 1;

      const nextLevels = Array.from(
        { length: BAR_COUNT },
        (_, index) => {
          const wave =
            Math.sin(
              frame * 0.42 +
                index * 0.82
            );

          const secondaryWave =
            Math.sin(
              frame * 0.19 +
                index * 1.37
            );

          const normalized =
            (wave + 1) / 2;

          const secondary =
            (secondaryWave + 1) / 2;

          return (
            0.25 +
            normalized * 0.52 +
            secondary * 0.23
          );
        }
      );

      setLevel(nextLevels);
    }, 80);

    return () => {
      clearInterval(interval);
    };
  }, [aiState]);

  const displayLevels =
    aiState === "LISTENING"
      ? level
      : IDLE_LEVELS;

  return (
    <div
      className={`voice-activity ${
        aiState === "LISTENING"
          ? "active"
          : ""
      }`}
    >
      <span className="voice-label">
        VOICE LINK
      </span>

      <div className="voice-bars">
        {displayLevels.map(
          (height, index) => (
            <span
              key={index}
              className="voice-bar"
              style={{
                height:
                  `${height * 28}px`,
              }}
            />
          )
        )}
      </div>
    </div>
  );
}