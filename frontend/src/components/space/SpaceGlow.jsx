// src/components/space/SpaceGlow.jsx

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

function seededRandom(seed) {
  const value =
    Math.sin(seed * 12.9898) *
    43758.5453;

  return value - Math.floor(value);
}

export default function SpaceGlow() {
  const ref = useRef();

  const positions = useMemo(() => {
    const count = 1200;
    const data = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius =
        8 +
        seededRandom(i + 50) * 18;

      const theta =
        seededRandom(i + 500) *
        Math.PI *
        2;

      const phi = Math.acos(
        2 * seededRandom(i + 900) - 1
      );

      data[i * 3] =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

      data[i * 3 + 1] =
        radius *
        Math.sin(phi) *
        Math.sin(theta);

      data[i * 3 + 2] =
        radius *
        Math.cos(phi);
    }

    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    ref.current.rotation.y =
      clock.getElapsedTime() * 0.003;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#168CFF"
        size={0.012}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
}