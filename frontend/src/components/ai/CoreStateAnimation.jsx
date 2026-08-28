// src/components/ai/CoreStateAnimation.jsx

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAIState } from "../../context/useAIState";

export default function CoreStateAnimation() {
  const { aiState } = useAIState();

  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();

    let targetScale = 1;
    let speed = 1;

    if (aiState === "LISTENING") {
      targetScale =
        1 +
        Math.sin(t * 4) * 0.035;

      speed = 1.3;
    }

    if (aiState === "THINKING") {
      targetScale =
        1 +
        Math.sin(t * 7) * 0.055;

      speed = 2;
    }

    if (aiState === "RESPONDING") {
      targetScale =
        1 +
        Math.sin(t * 5) * 0.075;

      speed = 2.5;
    }

    ref.current.scale.lerp(
      {
        x: targetScale,
        y: targetScale,
        z: targetScale,
      },
      0.08
    );

    ref.current.rotation.y +=
      0.002 * speed;
  });

  return (
    <group ref={ref} />
  );
}