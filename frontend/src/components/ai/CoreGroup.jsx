import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import CoreGlow from "./CoreGlow";
import AI_Core from "./AI_Core";
import HaloSystem from "./HaloSystem";
import EnergyRings from "./EnergyRings";
import OrbitParticles from "./OrbitParticles";
import ParticleCore from "./ParticleCore";

export default function CoreGroup() {
  const group = useRef();

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.rotation.y = t * 0.02;

    group.current.position.y =
      Math.sin(t * 0.45) * 0.05;

    const breathing =
      1 + Math.sin(t * 1.6) * 0.01;

    group.current.scale.setScalar(breathing);
  });

  return (
    <group ref={group}>
      <CoreGlow />

      <AI_Core />

      <ParticleCore />

      <OrbitParticles />

      <EnergyRings />

      <HaloSystem />
    </group>
  );
}