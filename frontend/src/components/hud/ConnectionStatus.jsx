// NEW FILE
// src/components/hud/ConnectionStatus.jsx

import { useEffect, useState } from "react";

import "./ConnectionStatus.css";

export default function ConnectionStatus() {
  const [online, setOnline] = useState(
    navigator.onLine
  );

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );
    };
  }, []);

  return (
    <div
      className={`connection-status ${
        online ? "online" : "offline"
      }`}
    >
      <span className="connection-dot" />

      <span className="connection-text">
        {online ? "NETWORK ONLINE" : "OFFLINE MODE"}
      </span>
    </div>
  );
}