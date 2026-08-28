// NEW FILE
// src/components/hud/ConversationFlow.jsx

import { useEffect, useState } from "react";
import { useAIState } from "../../context/useAIState";

import "./ConversationFlow.css";

export default function ConversationFlow() {
  const { setAIState } = useAIState();

  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    const handleCommand = (event) => {
      const text = event.detail;

      if (!text) return;

      setCommand(text);
      setResponse("");
      setAIState("THINKING");
    };

    const handleResponse = (event) => {
      const text = event.detail;

      if (!text) return;

      setResponse(text);
      setAIState("RESPONDING");
    };

    window.addEventListener(
      "ultron:command",
      handleCommand
    );

    window.addEventListener(
      "ultron:response",
      handleResponse
    );

    return () => {
      window.removeEventListener(
        "ultron:command",
        handleCommand
      );

      window.removeEventListener(
        "ultron:response",
        handleResponse
      );
    };
  }, [setAIState]);

  if (!command && !response) {
    return null;
  }

  return (
    <div className="conversation-flow">
      {command && (
        <div className="conversation-command">
          <span>&gt;</span>
          <p>{command}</p>
        </div>
      )}

      {response && (
        <div className="conversation-response">
          <div className="conversation-response-label">
            ULTRON
          </div>

          <p>{response}</p>
        </div>
      )}
    </div>
  );
}