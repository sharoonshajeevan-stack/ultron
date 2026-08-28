// src/components/ai/EnergyStreams.jsx

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Stream({
  color,
  radius,
  speed,
  opacity,
  rotation,
}) {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const time = clock.getElapsedTime();

    ref.current.rotation.y =
      rotation[1] + time * speed;

    ref.current.rotation.z =
      rotation[2] +
      Math.sin(time * 0.35 + radius) * 0.08;

    const pulse =
      1 +
      Math.sin(time * 1.8 + radius) * 0.025;

    ref.current.scale.set(
      pulse,
      pulse,
      pulse
    );
  });

  return (
    <mesh
      ref={ref}
      rotation={rotation}
    >
      <torusGeometry
        args={[
          radius,
          0.004,
          8,
          180,
        ]}
      />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        depthTest={true}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

export default function EnergyStreams({
  color = "#00BFFF",
}) {
  return (
    <group>
      <Stream
        color={color}
        radius={1.15}
        speed={0.12}
        opacity={0.28}
        rotation={[
          Math.PI * 0.15,
          0,
          0,
        ]}
      />

      <Stream
        color={color}
        radius={1.32}
        speed={-0.09}
        opacity={0.22}
        rotation={[
          -Math.PI * 0.2,
          0.8,
          0.35,
        ]}
      />

      <Stream
        color={color}
        radius={1.48}
        speed={0.065}
        opacity={0.16}
        rotation={[
          Math.PI * 0.3,
          -0.5,
          0.7,
        ]}
      />
    </group>
  );
}