// src/components/ai/AI_CoreInteraction.jsx

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function AI_CoreInteraction() {
  const { camera } = useThree();
  const targetDistance = useRef(7);

  useFrame(() => {
    const currentDistance = camera.position.length();

    const nextDistance =
      currentDistance +
      (targetDistance.current - currentDistance) * 0.08;

    camera.position.normalize().multiplyScalar(nextDistance);
  });

  return null;
}