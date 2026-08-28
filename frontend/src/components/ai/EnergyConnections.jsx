// src/components/ai/EnergyConnections.jsx

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seededRandom(seed) {
  const value =
    Math.sin(seed * 12.9898) *
    43758.5453;

  return value - Math.floor(value);
}

export default function EnergyConnections({
  color = "#00BFFF",
}) {
  const ref = useRef();

  const geometry = useMemo(() => {
    const count = 90;
    const data = new Float32Array(
      count * 6
    );

    for (let i = 0; i < count; i++) {
      const a = i * 6;

      const theta1 =
        seededRandom(i + 100) *
        Math.PI *
        2;

      const phi1 = Math.acos(
        2 *
          seededRandom(i + 200) -
          1
      );

      const theta2 =
        seededRandom(i + 300) *
        Math.PI *
        2;

      const phi2 = Math.acos(
        2 *
          seededRandom(i + 400) -
          1
      );

      const radius = 1.25;

      data[a] =
        radius *
        Math.sin(phi1) *
        Math.cos(theta1);

      data[a + 1] =
        radius *
        Math.sin(phi1) *
        Math.sin(theta1);

      data[a + 2] =
        radius *
        Math.cos(phi1);

      data[a + 3] =
        radius *
        Math.sin(phi2) *
        Math.cos(theta2);

      data[a + 4] =
        radius *
        Math.sin(phi2) *
        Math.sin(theta2);

      data[a + 5] =
        radius *
        Math.cos(phi2);
    }

    const geo =
      new THREE.BufferGeometry();

    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(
        data,
        3
      )
    );

    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    ref.current.rotation.y =
      clock.getElapsedTime() *
      0.08;
  });

  return (
    <lineSegments
      ref={ref}
      geometry={geometry}
    >
      <lineBasicMaterial
        color={new THREE.Color(color)}
        transparent
        opacity={0.18}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}