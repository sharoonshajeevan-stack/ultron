// src/components/hud/ResponseTyping.jsx

import { useEffect, useState } from "react";

export default function ResponseTyping({
  text = "",
  speed = 18,
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!text) {
      return undefined;
    }

    let index = 0;

    const timer = setInterval(() => {
      index += 1;

      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => {
      clearInterval(timer);
    };
  }, [text, speed]);

  // Reset visually when there is no response
  if (!text) {
    return null;
  }

  return (
    <>
      {displayed}

      {displayed.length < text.length && (
        <span className="typing-cursor">
          ▋
        </span>
      )}
    </>
  );
}