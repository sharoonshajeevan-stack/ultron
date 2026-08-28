import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function EnergyConnections() {
  const group = useRef();

  const lines = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => ({
      radius: 1.45 + (i % 6) * 0.08,
      rotation: (i / 48) * Math.PI * 2,
      speed: 0.06 + (i % 5) * 0.02,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.children.forEach((line, i) => {
      const l = lines[i];

      line.rotation.y =
        l.rotation + t * l.speed;

      line.rotation.x =
        Math.sin(t * 0.7 + i) * 0.25;

      line.scale.x =
        1 + Math.sin(t * 4 + i) * 0.08;

      line.material.opacity =
        0.08 + Math.sin(t * 3 + i) * 0.04;
    });
  });

  return (
    <group ref={group}>
      {lines.map((line, i) => (
        <mesh key={i}>
          <torusGeometry
            args={[
              line.radius,
              0.0018,
              8,
              96,
              Math.PI / 3,
            ]}
          />

          <meshBasicMaterial
            color="#A8EEFF"
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}