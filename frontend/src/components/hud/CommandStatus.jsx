// NEXT CODE
// NEW FILE
// src/components/hud/CommandStatus.jsx

import { useEffect, useState } from "react";
import "./CommandStatus.css";

export default function CommandStatus() {
  const [command, setCommand] = useState("");

  useEffect(() => {
    const handleCommand = (event) => {
      setCommand(event.detail || "");
    };

    window.addEventListener(
      "ultron:command",
      handleCommand
    );

    return () => {
      window.removeEventListener(
        "ultron:command",
        handleCommand
      );
    };
  }, []);

  if (!command) return null;

  return (
    <div className="command-status">
      <span className="command-status-label">
        COMMAND
      </span>

      <span className="command-status-text">
        {command}
      </span>
    </div>
  );
}