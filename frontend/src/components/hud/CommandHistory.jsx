// src/components/hud/CommandHistory.jsx

import { useEffect, useState } from "react";

import "./CommandHistory.css";

export default function CommandHistory() {
  const [commands, setCommands] = useState([]);

  useEffect(() => {
    const handleCommand = (event) => {
      const command = event.detail;

      if (!command) {
        return;
      }

      setCommands((previous) => [
        {
          id: `${Date.now()}-${previous.length}`,
          text: command,
        },
        ...previous,
      ].slice(0, 4));
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

  if (commands.length === 0) {
    return null;
  }

  return (
    <div className="command-history">
      <div className="command-history-title">
        COMMAND LOG
      </div>

      <div className="command-history-list">
        {commands.map((command) => (
          <div
            className="command-history-item"
            key={command.id}
          >
            <span className="command-arrow">
              &gt;
            </span>

            <span>
              {command.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}