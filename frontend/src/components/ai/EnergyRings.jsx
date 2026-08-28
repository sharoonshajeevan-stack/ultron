// src/components/ai/EnergyRings.jsx

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Ring({
  color,
  radius,
  rotation,
  speed,
  opacity,
  thickness,
}) {
  const ringRef = useRef(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) {
      return;
    }

    const time = clock.getElapsedTime();

    ringRef.current.rotation.z =
      rotation[2] + time * speed;

    ringRef.current.rotation.x =
      rotation[0] +
      Math.sin(time * 0.22 + radius) *
        0.025;

    ringRef.current.rotation.y =
      rotation[1] +
      Math.cos(time * 0.18 + radius) *
        0.02;
  });

  return (
    <mesh
      ref={ringRef}
      rotation={rotation}
    >
      <torusGeometry
        args={[
          radius,
          thickness,
          12,
          160,
        ]}
      />

      <meshBasicMaterial
        color={color}
        transparent={true}
        opacity={opacity}
        depthWrite={false}
        depthTest={true}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

export default function EnergyRings({
  color = "#00BFFF",
  state = "IDLE",
}) {
  let intensity = 1;

  if (state === "LISTENING") {
    intensity = 1.15;
  }

  if (state === "THINKING") {
    intensity = 1.3;
  }

  if (state === "RESPONDING") {
    intensity = 1.45;
  }

  return (
    <group>
      {/* Primary horizontal energy ring */}

      <Ring
        color={color}
        radius={2.05}
        rotation={[0, 0, 0]}
        speed={0.075}
        opacity={0.55 * intensity}
        thickness={0.012}
      />

      {/* First diagonal orbit */}

      <Ring
        color={color}
        radius={2.15}
        rotation={[
          Math.PI * 0.38,
          0.15,
          0.4,
        ]}
        speed={-0.05}
        opacity={0.4 * intensity}
        thickness={0.009}
      />

      {/* Second diagonal orbit */}

      <Ring
        color={color}
        radius={2.25}
        rotation={[
          -Math.PI * 0.32,
          0.25,
          -0.55,
        ]}
        speed={0.042}
        opacity={0.3 * intensity}
        thickness={0.008}
      />

      {/* Large outer orbit */}

      <Ring
        color={color}
        radius={2.45}
        rotation={[
          Math.PI * 0.18,
          -0.3,
          0.8,
        ]}
        speed={-0.025}
        opacity={0.2 * intensity}
        thickness={0.006}
      />
    </group>
  );
}