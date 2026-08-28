import { useEffect, useState } from "react";
import styles from "./TopBar.module.css";

export default function TopBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateClock();

    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className={styles.topBar}>
      <div className={styles.logo}>
        ULTRON
      </div>

      <div className={styles.status}>
        SYSTEM READY
      </div>

      <div className={styles.clock}>
        {time}
      </div>
    </header>
  );
}