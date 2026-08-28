import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function BootScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            inset: 0,
            background: "#000",
            color: "#00AAFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "monospace",
            zIndex: 9999,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ textAlign: "left" }}
          >
            <h1
              style={{
                fontSize: "56px",
                marginBottom: "20px",
                letterSpacing: "4px",
              }}
            >
              ULTRON
            </h1>

            <div style={{ fontSize: "24px", lineHeight: "1.8" }}>
              <div>&gt; INITIALIZING SYSTEM...</div>
              <div>&gt; LOADING AI CORE...</div>
              <div>&gt; NEURAL NETWORK ONLINE...</div>
              <div>&gt; SYSTEM READY</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}