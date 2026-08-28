// src/components/hud/CommandPrompt.jsx

import { useState } from "react";
import { useAIStateControls } from "../../context/AIStateControls";

import "./CommandPrompt.css";

export default function CommandPrompt() {
  const [command, setCommand] = useState("");

  const {
    listening,
    thinking,
  } = useAIStateControls();

  const submitCommand = () => {
    const text = command.trim();

    if (!text) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("ultron:command", {
        detail: text,
      })
    );

    setCommand("");

    thinking();
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    submitCommand();
  };

  const handleFocus = () => {
    listening();
  };

  return (
    <div className="command-prompt">
      <span className="command-prefix">
        &gt;
      </span>

      <input
        type="text"
        value={command}
        onChange={(event) =>
          setCommand(event.target.value)
        }
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder="ENTER COMMAND..."
        autoComplete="off"
        spellCheck="false"
        aria-label="ULTRON command input"
      />

      <button
        type="button"
        onClick={submitCommand}
      >
        EXECUTE
      </button>
    </div>
  );
}