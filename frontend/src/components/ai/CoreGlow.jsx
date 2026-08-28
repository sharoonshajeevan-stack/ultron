// src/components/ai/CoreGlow.jsx

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CoreGlow({
  color = "#00BFFF",
  state = "IDLE",
}) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  const outerMaterialRef = useRef(null);
  const innerMaterialRef = useRef(null);

  useFrame(({ clock }) => {
    const outer = outerRef.current;
    const inner = innerRef.current;

    const outerMaterial =
      outerMaterialRef.current;

    const innerMaterial =
      innerMaterialRef.current;

    if (
      !outer ||
      !inner ||
      !outerMaterial ||
      !innerMaterial
    ) {
      return;
    }

    const time =
      clock.getElapsedTime();

    /*
     * --------------------------------
     * DEFAULT / IDLE
     * --------------------------------
     */

    let outerPulseSpeed = 0.8;
    let outerPulseAmount = 0.025;
    let outerOpacity = 0.055;

    let innerPulseSpeed = 1.25;
    let innerPulseAmount = 0.035;
    let innerOpacity = 0.085;

    /*
     * --------------------------------
     * LISTENING
     * --------------------------------
     */

    if (state === "LISTENING") {
      outerPulseSpeed = 1.15;
      outerPulseAmount = 0.04;
      outerOpacity = 0.075;

      innerPulseSpeed = 1.8;
      innerPulseAmount = 0.055;
      innerOpacity = 0.11;
    }

    /*
     * --------------------------------
     * THINKING
     * --------------------------------
     */

    if (state === "THINKING") {
      outerPulseSpeed = 1.5;
      outerPulseAmount = 0.045;
      outerOpacity = 0.085;

      innerPulseSpeed = 2.4;
      innerPulseAmount = 0.045;
      innerOpacity = 0.125;
    }

    /*
     * --------------------------------
     * RESPONDING
     * --------------------------------
     */

    if (state === "RESPONDING") {
      outerPulseSpeed = 1.8;
      outerPulseAmount = 0.06;
      outerOpacity = 0.105;

      innerPulseSpeed = 2.8;
      innerPulseAmount = 0.075;
      innerOpacity = 0.15;
    }

    /*
     * --------------------------------
     * OUTER ATMOSPHERE
     * --------------------------------
     *
     * Slow breathing keeps the glow
     * from looking like a static sphere.
     */

    const outerPulse =
      1 +
      Math.sin(
        time * outerPulseSpeed
      ) *
        outerPulseAmount;

    outer.scale.setScalar(
      outerPulse
    );

    /*
     * Secondary slow movement.
     */

    outer.rotation.y =
      time * 0.018;

    outer.rotation.x =
      Math.sin(
        time * 0.16
      ) * 0.012;

    /*
     * Outer opacity breathing.
     */

    outerMaterial.opacity =
      outerOpacity +
      Math.sin(
        time *
          outerPulseSpeed *
          1.25
      ) *
        outerOpacity *
        0.22;

    /*
     * --------------------------------
     * INNER ENERGY FIELD
     * --------------------------------
     */

    const innerPulse =
      1 +
      Math.sin(
        time * innerPulseSpeed
      ) *
        innerPulseAmount;

    const secondaryPulse =
      Math.sin(
        time * 0.43 +
          1.4
      ) * 0.008;

    inner.scale.setScalar(
      innerPulse +
        secondaryPulse
    );

    /*
     * Slight independent rotation.
     */

    inner.rotation.y =
      -time * 0.025;

    inner.rotation.z =
      Math.cos(
        time * 0.21
      ) * 0.01;

    /*
     * Inner opacity pulse.
     */

    innerMaterial.opacity =
      innerOpacity +
      Math.sin(
        time *
          innerPulseSpeed *
          1.3
      ) *
        innerOpacity *
        0.25;
  });

  return (
    <group>
      {/* Outer atmospheric glow */}

      <mesh
        ref={outerRef}
      >
        <sphereGeometry
          args={[1.72, 64, 64]}
        />

        <meshBasicMaterial
          ref={outerMaterialRef}
          color={color}
          transparent
          opacity={0.055}
          depthWrite={false}
          depthTest={true}
          side={THREE.BackSide}
          blending={
            THREE.NormalBlending
          }
        />
      </mesh>

      {/* Inner energy glow */}

      <mesh
        ref={innerRef}
      >
        <sphereGeometry
          args={[1.48, 64, 64]}
        />

        <meshBasicMaterial
          ref={innerMaterialRef}
          color={color}
          transparent
          opacity={0.085}
          depthWrite={false}
          depthTest={true}
          side={THREE.BackSide}
          blending={
            THREE.NormalBlending
          }
        />
      </mesh>
    </group>
  );
}