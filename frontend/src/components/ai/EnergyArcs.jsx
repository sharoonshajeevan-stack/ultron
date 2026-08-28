import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function EnergyArcs() {
  const group = useRef();

  const arcs = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      rotation: [
        (i * Math.PI) / 12,
        (i * Math.PI) / 8,
        (i * Math.PI) / 16,
      ],
      radius: 1.5 + (i % 4) * 0.06,
      speed: 0.08 + (i % 6) * 0.02,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.children.forEach((arc, i) => {
      const a = arcs[i];

      arc.rotation.x =
        a.rotation[0] + t * a.speed;

      arc.rotation.y =
        a.rotation[1] + t * a.speed * 0.8;

      arc.rotation.z =
        a.rotation[2] + t * a.speed * 0.4;

      arc.material.opacity =
        0.12 + Math.sin(t * 3 + i) * 0.05;
    });
  });

  return (
    <group ref={group}>
      {arcs.map((arc, i) => (
        <mesh key={i}>
          <torusGeometry
            args={[
              arc.radius,
              0.003,
              12,
              120,
              Math.PI * 0.35,
            ]}
          />

          <meshBasicMaterial
            color="#7FE7FF"
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}