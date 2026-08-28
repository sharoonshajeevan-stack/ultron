import { useMemo, useState } from "react";
import { AIStateContext } from "./AIStateContext";

export default function AIStateProvider({ children }) {
  const [aiState, setAIState] = useState("IDLE");

  const value = useMemo(
    () => ({
      aiState,
      setAIState,
    }),
    [aiState]
  );

  return (
    <AIStateContext.Provider value={value}>
      {children}
    </AIStateContext.Provider>
  );
}