import { useEffect, useRef, useState } from "react";

export default function TextToSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const lastResponse = useRef("");

  useEffect(() => {
    const handleResponse = (event) => {
      const text = String(event.detail || "").trim();

      if (!text || text === lastResponse.current) {
        return;
      }

      lastResponse.current = text;

      if (!("speechSynthesis" in window)) {
        console.warn("Browser speech synthesis is not supported.");
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setSpeaking(true);
      };

      utterance.onend = () => {
        setSpeaking(false);
      };

      utterance.onerror = () => {
        setSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    window.addEventListener(
      "ultron:response",
      handleResponse
    );

    return () => {
      window.removeEventListener(
        "ultron:response",
        handleResponse
      );

      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 99999,
        fontFamily: "monospace",
        fontSize: "8px",
        letterSpacing: "2px",
        color: speaking
          ? "rgba(255, 153, 0, 0.7)"
          : "rgba(0, 191, 255, 0.45)",
        pointerEvents: "none",
      }}
    >
      {speaking ? "ULTRON SPEAKING" : "VOICE READY"}
    </div>
  );
}