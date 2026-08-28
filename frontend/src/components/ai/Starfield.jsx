// src/components/ai/Starfield.jsx

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT = 2200;

export default function Starfield() {
  const pointsRef = useRef(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(
      STAR_COUNT * 3
    );

    for (let i = 0; i < STAR_COUNT; i++) {
      const a =
        Math.sin(i * 12.9898) *
        43758.5453;

      const b =
        Math.sin(i * 78.233) *
        43758.5453;

      const c =
        Math.sin(i * 37.719) *
        43758.5453;

      const randomA =
        a - Math.floor(a);

      const randomB =
        b - Math.floor(b);

      const randomC =
        c - Math.floor(c);

      /*
       * Deep spherical star distribution.
       */

      const radius =
        14 +
        Math.pow(randomA, 0.7) *
          38;

      const theta =
        randomB * Math.PI * 2;

      const phi =
        Math.acos(
          2 * randomC - 1
        );

      positions[i * 3] =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

      positions[i * 3 + 1] =
        radius *
        Math.cos(phi);

      positions[i * 3 + 2] =
        radius *
        Math.sin(phi) *
        Math.sin(theta);
    }

    const bufferGeometry =
      new THREE.BufferGeometry();

    bufferGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    return bufferGeometry;
  }, []);

  useFrame(({ clock }) => {
    const points = pointsRef.current;

    if (!points) {
      return;
    }

    const time =
      clock.getElapsedTime();

    /*
     * Extremely slow deep-space rotation.
     */

    points.rotation.y =
      time * 0.0035;

    points.rotation.x =
      Math.sin(
        time * 0.018
      ) * 0.008;

    /*
     * Tiny vertical drift.
     */

    points.position.y =
      Math.sin(
        time * 0.08
      ) * 0.035;

    /*
     * Tiny horizontal drift.
     */

    points.position.x =
      Math.cos(
        time * 0.055
      ) * 0.025;
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      frustumCulled={false}
    >
      <pointsMaterial
        color="#3FCBFF"
        size={0.035}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.6}
        depthWrite={false}
        depthTest={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}