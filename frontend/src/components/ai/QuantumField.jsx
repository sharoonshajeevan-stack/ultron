// src/components/ai/QuantumField.jsx

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seededRandom(seed) {
  const value =
    Math.sin(seed * 12.9898) *
    43758.5453;

  return value - Math.floor(value);
}

export default function QuantumField({
  color = "#00BFFF",
}) {
  const ref = useRef();

  const positions = useMemo(() => {
    const count = 700;
    const data = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius =
        2.2 +
        seededRandom(i + 100) *
          3.5;

      const theta =
        seededRandom(i + 1000) *
        Math.PI *
        2;

      const phi = Math.acos(
        2 *
          seededRandom(i + 2000) -
          1
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
      clock.getElapsedTime() *
      0.025;
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
        color={new THREE.Color(color)}
        size={0.012}
        sizeAttenuation
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}