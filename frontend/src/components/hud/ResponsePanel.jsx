// src/components/hud/ResponsePanel.jsx

import { useEffect, useState } from "react";
import ResponseTyping from "./ResponseTyping";

import "./ResponsePanel.css";

export default function ResponsePanel() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const handleResponse = (event) => {
      const text = event.detail;

      if (!text) {
        return;
      }

      setResponse(text);
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
    };
  }, []);

  if (!response) {
    return null;
  }

  return (
    <div className="response-panel">
      <div className="response-header">
        <span className="response-indicator" />

        <span>
          ULTRON RESPONSE
        </span>
      </div>

      <div className="response-content">
        <ResponseTyping
          text={response}
          speed={18}
        />
      </div>
    </div>
  );
}