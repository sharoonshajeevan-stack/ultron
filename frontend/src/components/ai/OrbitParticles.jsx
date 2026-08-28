// src/components/ai/OrbitParticles.jsx

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seededRandom(seed) {
  const value =
    Math.sin(seed * 12.9898) *
    43758.5453;

  return value - Math.floor(value);
}

export default function OrbitParticles({
  color = "#00BFFF",
}) {
  const ref = useRef();

  const positions = useMemo(() => {
    const count = 180;
    const data = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle =
        (i / count) *
        Math.PI *
        2;

      const radius =
        1.65 +
        seededRandom(i + 500) *
          0.35;

      data[i * 3] =
        Math.cos(angle) *
        radius;

      data[i * 3 + 1] =
        (seededRandom(i + 1000) -
          0.5) *
        0.8;

      data[i * 3 + 2] =
        Math.sin(angle) *
        radius;
    }

    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();

    ref.current.rotation.y =
      t * 0.22;

    ref.current.rotation.x =
      Math.sin(t * 0.35) * 0.08;
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
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}