// src/components/ai/EnergyShell.jsx

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function EnergyShell({
  color = "#00BFFF",
  state = "IDLE",
}) {
  const shellRef = useRef(null);
  const materialRef = useRef(null);

  useFrame(({ clock }) => {
    const shell = shellRef.current;
    const material = materialRef.current;

    if (!shell || !material) {
      return;
    }

    const time = clock.getElapsedTime();

    let rotationSpeed = 0.035;
    let pulseSpeed = 1.1;
    let pulseAmount = 0.012;
    let opacityBase = 0.045;
    let opacityAmount = 0.01;

    if (state === "LISTENING") {
      rotationSpeed = 0.05;
      pulseSpeed = 1.8;
      pulseAmount = 0.018;
      opacityBase = 0.055;
      opacityAmount = 0.012;
    }

    if (state === "THINKING") {
      rotationSpeed = 0.07;
      pulseSpeed = 2.3;
      pulseAmount = 0.015;
      opacityBase = 0.065;
      opacityAmount = 0.015;
    }

    if (state === "RESPONDING") {
      rotationSpeed = 0.06;
      pulseSpeed = 2.8;
      pulseAmount = 0.022;
      opacityBase = 0.075;
      opacityAmount = 0.018;
    }

    shell.rotation.y =
      time * rotationSpeed;

    shell.rotation.x =
      Math.sin(time * 0.18) * 0.025;

    shell.rotation.z =
      Math.cos(time * 0.14) * 0.012;

    const pulse =
      1 +
      Math.sin(time * pulseSpeed) *
        pulseAmount;

    shell.scale.setScalar(pulse);

    material.opacity =
      opacityBase +
      Math.sin(
        time * pulseSpeed * 1.2
      ) *
        opacityAmount;
  });

  return (
    <mesh ref={shellRef}>
      <sphereGeometry
        args={[1.82, 64, 64]}
      />

      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent={true}
        opacity={0.045}
        depthWrite={false}
        depthTest={true}
        side={THREE.BackSide}
        blending={THREE.NormalBlending}
        wireframe={true}
      />
    </mesh>
  );
}