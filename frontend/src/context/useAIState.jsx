// src/context/useAIState.jsx

import { useContext } from "react";
import { AIStateContext } from "./AIStateContext";

export function useAIState() {
  const context = useContext(AIStateContext);

  if (!context) {
    throw new Error(
      "useAIState must be used inside AIStateProvider"
    );
  }

  return context;
}