// src/components/ai/HaloSystem.jsx

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HaloSystem({
  color = "#00BFFF",
  state = "IDLE",
}) {
  const haloRef = useRef(null);
  const materialRef = useRef(null);

  useFrame(({ clock }) => {
    const halo = haloRef.current;
    const material = materialRef.current;

    if (!halo || !material) {
      return;
    }

    const time =
      clock.getElapsedTime();

    let rotationSpeed = 0.018;
    let pulseSpeed = 0.75;
    let pulseAmount = 0.018;
    let opacityBase = 0.035;
    let opacityAmount = 0.008;

    if (state === "LISTENING") {
      rotationSpeed = 0.028;
      pulseSpeed = 1.15;
      pulseAmount = 0.028;
      opacityBase = 0.045;
      opacityAmount = 0.012;
    }

    if (state === "THINKING") {
      rotationSpeed = 0.04;
      pulseSpeed = 1.5;
      pulseAmount = 0.032;
      opacityBase = 0.055;
      opacityAmount = 0.015;
    }

    if (state === "RESPONDING") {
      rotationSpeed = 0.05;
      pulseSpeed = 1.9;
      pulseAmount = 0.045;
      opacityBase = 0.07;
      opacityAmount = 0.02;
    }

    /*
     * Slow atmospheric rotation.
     */

    halo.rotation.y =
      time * rotationSpeed;

    halo.rotation.x =
      Math.sin(
        time * 0.12
      ) * 0.018;

    halo.rotation.z =
      Math.cos(
        time * 0.09
      ) * 0.012;

    /*
     * Cinematic breathing.
     */

    const pulse =
      1 +
      Math.sin(
        time * pulseSpeed
      ) *
        pulseAmount;

    halo.scale.setScalar(
      pulse
    );

    /*
     * Atmospheric opacity.
     */

    material.opacity =
      opacityBase +
      Math.sin(
        time *
          pulseSpeed *
          1.15
      ) *
        opacityAmount;
  });

  return (
    <mesh
      ref={haloRef}
    >
      <sphereGeometry
        args={[2.05, 64, 64]}
      />

      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0.035}
        depthWrite={false}
        depthTest={true}
        side={THREE.BackSide}
        blending={
          THREE.NormalBlending
        }
        wireframe={true}
      />
    </mesh>
  );
}