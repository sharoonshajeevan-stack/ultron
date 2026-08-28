// src/components/ai/Globe.jsx

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Globe({
  color = "#00BFFF",
}) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;

    ref.current.rotation.y =
      clock.getElapsedTime() * 0.12;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.45, 64, 64]} />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.045}
        depthWrite={false}
      />
    </mesh>
  );
}