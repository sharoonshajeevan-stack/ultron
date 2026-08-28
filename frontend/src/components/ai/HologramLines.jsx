import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function HologramLines() {
  const group = useRef();

  const lines = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        y: -1.35 + i * 0.04,
        radius: Math.sqrt(1.45 * 1.45 - (-1.35 + i * 0.04) ** 2),
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.rotation.y = t * 0.12;

    group.current.children.forEach((line, i) => {
      line.material.opacity =
        0.03 +
        Math.sin(t * 4 + i * 0.25) * 0.015;
    });
  });

  return (
    <group ref={group}>
      {lines.map((line, i) => (
        <mesh
          key={i}
          position={[0, line.y, 0]}
        >
          <torusGeometry
            args={[
              Math.max(line.radius, 0.05),
              0.0025,
              8,
              128,
            ]}
          />

          <meshBasicMaterial
            color="#66DDFF"
            transparent
            opacity={0.04}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}