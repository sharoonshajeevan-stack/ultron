import { useEffect } from "react";
import { processCommand } from "../../services/api";
import { useAIState } from "../../context/useAIState";

export default function BackendBridge() {
  const { setAIState } = useAIState();

  useEffect(() => {
    let mounted = true;

    const handleCommand = async (event) => {
      const command = String(event.detail || "").trim();

      if (!command) {
        return;
      }

      if (mounted) {
        setAIState("THINKING");
      }

      try {
        const result = await processCommand(command);

        if (!mounted) {
          return;
        }

        if (!result || !result.success) {
          setAIState("IDLE");

          window.dispatchEvent(
            new CustomEvent("ultron:response", {
              detail:
                result?.error ||
                "ULTRON backend connection failed.",
            }),
          );

          return;
        }

        const data = result.data;

        if (!data) {
          setAIState("IDLE");

          window.dispatchEvent(
            new CustomEvent("ultron:response", {
              detail: "ULTRON received an empty backend response.",
            }),
          );

          return;
        }

        const response =
          data.response ||
          data.message ||
          "Command completed.";

        if (data.state === "IDLE") {
          setAIState("IDLE");
        } else if (data.state === "THINKING") {
          setAIState("THINKING");
        } else {
          setAIState("RESPONDING");
        }

        window.dispatchEvent(
          new CustomEvent("ultron:response", {
            detail: response,
          }),
        );
      } catch (error) {
        if (!mounted) {
          return;
        }

        setAIState("IDLE");

        window.dispatchEvent(
          new CustomEvent("ultron:response", {
            detail: `Backend error: ${error.message}`,
          }),
        );
      }
    };

    window.addEventListener(
      "ultron:command",
      handleCommand,
    );

    return () => {
      mounted = false;

      window.removeEventListener(
        "ultron:command",
        handleCommand,
      );
    };
  }, [setAIState]);

  return null;
}