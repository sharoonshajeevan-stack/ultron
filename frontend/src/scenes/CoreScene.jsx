// src/scenes/CoreScene.jsx

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

import { useAIState } from "../context/useAIState";

import ParticleCore from "../components/ai/ParticleCore";
import CoreGlow from "../components/ai/CoreGlow";
import EnergyShell from "../components/ai/EnergyShell";
import EnergyRings from "../components/ai/EnergyRings";
import HaloSystem from "../components/ai/HaloSystem";
import Starfield from "../components/ai/Starfield";

const STATE_COLORS = {
  IDLE: "#00BFFF",
  LISTENING: "#00BFFF",
  THINKING: "#FFFFFF",
  RESPONDING: "#FF8A00",
};

function CoreContent() {
  const { aiState } = useAIState();

  const color =
    STATE_COLORS[aiState] ||
    STATE_COLORS.IDLE;

  return (
    <>
      <Starfield />

      <ParticleCore
        color={color}
        state={aiState}
      />

      <CoreGlow
        color={color}
        state={aiState}
      />

      <HaloSystem
        color={color}
        state={aiState}
      />

      <EnergyShell
        color={color}
        state={aiState}
      />

      <EnergyRings
        color={color}
        state={aiState}
      />
    </>
  );
}

export default function CoreScene() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#000814",
        overflow: "hidden",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <color
          attach="background"
          args={["#000814"]}
        />

        <PerspectiveCamera
          makeDefault
          position={[0, 0, 8]}
          fov={45}
          near={0.1}
          far={100}
        />

        <CoreContent />

        <EffectComposer
          multisampling={4}
        >
          <Bloom
            intensity={1.15}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.65}
            mipmapBlur={true}
          />

          <Vignette
            eskil={false}
            offset={0.25}
            darkness={0.65}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3.5}
          maxDistance={18}
          target={[0, 0, 0]}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}