// src/components/ai/ParticleCore.jsx

import { useMemo, useRef } from "react";
import {
  useFrame,
  useThree,
} from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 4200;

export default function ParticleCore({
  color = "#00BFFF",
  state = "IDLE",
}) {
  const pointsRef = useRef(null);

  const { pointer } = useThree();

  const geometry = useMemo(() => {
    const positions = new Float32Array(
      PARTICLE_COUNT * 3
    );

    const phases = new Float32Array(
      PARTICLE_COUNT
    );

    const sizes = new Float32Array(
      PARTICLE_COUNT
    );

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      /*
       * Deterministic pseudo-random values.
       * NEVER use Math.random().
       */

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
       * Spherical distribution.
       */

      const radius =
        1.35 +
        Math.pow(randomA, 1.8) *
          1.05;

      const theta =
        randomB * Math.PI * 2;

      const phi =
        Math.acos(
          2 * randomC - 1
        );

      let x =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

      let y =
        radius *
        Math.cos(phi);

      let z =
        radius *
        Math.sin(phi) *
        Math.sin(theta);

      /*
       * Organic surface distortion.
       */

      const distortion =
        Math.sin(
          y * 4 +
            i * 0.017
        ) * 0.055;

      x += distortion;

      z +=
        Math.cos(
          x * 3.5 +
            i * 0.013
        ) * 0.045;

      /*
       * Small vertical energy displacement.
       */

      y +=
        Math.sin(
          theta * 3 +
            i * 0.009
        ) * 0.025;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      /*
       * Individual animation phase.
       */

      phases[i] =
        randomA *
        Math.PI *
        2;

      /*
       * Individual particle size.
       */

      sizes[i] =
        0.65 +
        randomB * 0.8;
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

    bufferGeometry.setAttribute(
      "phase",
      new THREE.BufferAttribute(
        phases,
        1
      )
    );

    bufferGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(
        sizes,
        1
      )
    );

    return bufferGeometry;
  }, []);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color,
      size: 0.027,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.88,
      blending:
        THREE.NormalBlending,
      depthWrite: false,
      depthTest: true,
    });
  }, [color]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;

    if (!points) {
      return;
    }

    const time =
      clock.getElapsedTime();

    /*
     * --------------------------------
     * BASE CINEMATIC MOTION
     * --------------------------------
     */

    let rotationSpeed = 0.075;
    let breathingSpeed = 1.15;
    let breathingAmount = 0.018;
    let pulseSpeed = 2.4;
    let pulseAmount = 0.006;
    let floatAmount = 0.025;

    /*
     * LISTENING
     */

    if (state === "LISTENING") {
      rotationSpeed = 0.11;
      breathingSpeed = 1.8;
      breathingAmount = 0.032;
      pulseSpeed = 3.4;
      pulseAmount = 0.012;
      floatAmount = 0.035;
    }

    /*
     * THINKING
     */

    if (state === "THINKING") {
      rotationSpeed = 0.16;
      breathingSpeed = 2.1;
      breathingAmount = 0.022;
      pulseSpeed = 4.5;
      pulseAmount = 0.015;
      floatAmount = 0.018;
    }

    /*
     * RESPONDING
     */

    if (state === "RESPONDING") {
      rotationSpeed = 0.13;
      breathingSpeed = 2.4;
      breathingAmount = 0.045;
      pulseSpeed = 5;
      pulseAmount = 0.022;
      floatAmount = 0.045;
    }

    /*
     * --------------------------------
     * CINEMATIC ROTATION
     * --------------------------------
     */

    const cinematicY =
      time * rotationSpeed;

    const cinematicX =
      Math.sin(
        time * 0.18
      ) * 0.035;

    const cinematicZ =
      Math.cos(
        time * 0.13
      ) * 0.012;

    /*
     * Mouse influence.
     *
     * Small enough that the sphere
     * remains autonomous.
     */

    const mouseY =
      pointer.x * 0.12;

    const mouseX =
      pointer.y * 0.08;

    points.rotation.y =
      THREE.MathUtils.lerp(
        points.rotation.y,
        cinematicY + mouseY,
        0.035
      );

    points.rotation.x =
      THREE.MathUtils.lerp(
        points.rotation.x,
        cinematicX - mouseX,
        0.035
      );

    points.rotation.z =
      THREE.MathUtils.lerp(
        points.rotation.z,
        cinematicZ,
        0.025
      );

    /*
     * --------------------------------
     * BREATHING
     * --------------------------------
     */

    const breathing =
      Math.sin(
        time *
          breathingSpeed
      ) *
      breathingAmount;

    /*
     * Secondary micro pulse.
     */

    const pulse =
      Math.sin(
        time *
          pulseSpeed
      ) *
      pulseAmount;

    /*
     * Very slow secondary rhythm.
     *
     * This prevents the motion from
     * looking like a simple sine wave.
     */

    const secondary =
      Math.sin(
        time * 0.47 +
          1.7
      ) * 0.008;

    const finalScale =
      1 +
      breathing +
      pulse +
      secondary;

    points.scale.setScalar(
      finalScale
    );

    /*
     * --------------------------------
     * SUSPENDED FLOAT
     * --------------------------------
     */

    const floatY =
      Math.sin(
        time * 0.55
      ) *
      floatAmount;

    const floatX =
      Math.sin(
        time * 0.31 +
          1.5
      ) * 0.012;

    const floatZ =
      Math.cos(
        time * 0.27
      ) * 0.008;

    points.position.x =
      THREE.MathUtils.lerp(
        points.position.x,
        floatX,
        0.02
      );

    points.position.y =
      THREE.MathUtils.lerp(
        points.position.y,
        floatY,
        0.02
      );

    points.position.z =
      THREE.MathUtils.lerp(
        points.position.z,
        floatZ,
        0.02
      );
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}