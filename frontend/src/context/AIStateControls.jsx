// src/context/AIStateControls.jsx

import { useAIState } from "./useAIState";

export function useAIStateControls() {
  const { setAIState } = useAIState();

  const idle = () => {
    setAIState("IDLE");
  };

  const listening = () => {
    setAIState("LISTENING");
  };

  const thinking = () => {
    setAIState("THINKING");
  };

  const responding = () => {
    setAIState("RESPONDING");
  };

  return {
    idle,
    listening,
    thinking,
    responding,
  };
}