// NEXT: src/components/ai/AI_Core.jsx

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAIState } from "../../context/useAIState";

import Globe from "./Globe";
import GlobeGrid from "./GlobeGrid";
import ParticleCore from "./ParticleCore";
import HaloSystem from "./HaloSystem";
import EnergyRings from "./EnergyRings";
import OrbitParticles from "./OrbitParticles";
import CoreGlow from "./CoreGlow";
import EnergyShell from "./EnergyShell";
import QuantumField from "./QuantumField";
import EnergyConnections from "./EnergyConnections";

const STATE_CONFIG = {
  IDLE: {
    color: "#00BFFF",
    scale: 0.58,
    rotation: 0.12,
    pulse: 0.012,
    light: 12,
  },

  LISTENING: {
    color: "#008CFF",
    scale: 0.62,
    rotation: 0.18,
    pulse: 0.035,
    light: 16,
  },

  THINKING: {
    color: "#FFFFFF",
    scale: 0.60,
    rotation: 0.09,
    pulse: 0.025,
    light: 18,
  },

  RESPONDING: {
    color: "#FF8A00",
    scale: 0.64,
    rotation: 0.20,
    pulse: 0.045,
    light: 20,
  },
};

export default function AI_Core() {
  const coreRef = useRef();

  const { aiState } = useAIState();

  const config =
    STATE_CONFIG[aiState] ||
    STATE_CONFIG.IDLE;

  useEffect(() => {
    if (!coreRef.current) return;

    coreRef.current.scale.setScalar(
      config.scale
    );
  }, [config.scale]);

  useFrame(({ clock }) => {
    if (!coreRef.current) return;

    const t = clock.getElapsedTime();

    coreRef.current.rotation.y +=
      config.rotation * 0.01;

    coreRef.current.rotation.x =
      Math.sin(t * 0.35) * 0.025;

    coreRef.current.rotation.z =
      Math.sin(t * 0.2) * 0.012;

    const pulse =
      1 +
      Math.sin(t * 2.1) *
        config.pulse;

    coreRef.current.scale.setScalar(
      config.scale * pulse
    );
  });

  return (
    <group ref={coreRef}>

      <Globe color={config.color} />

      <GlobeGrid color={config.color} />

      <ParticleCore color={config.color} />

      <CoreGlow color={config.color} />

      <EnergyShell color={config.color} />

      <EnergyConnections
        color={config.color}
      />

      <OrbitParticles
        color={config.color}
      />

      <EnergyRings
        color={config.color}
      />

      <HaloSystem
        color={config.color}
      />

      <QuantumField
        color={config.color}
      />

      <pointLight
        position={[0, 0, 0]}
        intensity={config.light}
        distance={12}
        color={config.color}
      />

    </group>
  );
}