// src/components/hud/SystemClock.jsx

import { useEffect, useState } from "react";

import "./SystemClock.css";

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function SystemClock() {
  const [time, setTime] = useState(getTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="system-clock">
      <span className="system-clock-label">
        LOCAL TIME
      </span>

      <span className="system-clock-time">
        {time}
      </span>
    </div>
  );
}