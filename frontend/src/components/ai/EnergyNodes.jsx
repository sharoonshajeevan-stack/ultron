import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function EnergyNodes() {
  const group = useRef();

  const nodes = useMemo(() => {
    return Array.from({ length: 64 }, (_, i) => ({
      angle: (i / 64) * Math.PI * 2,
      radius: 1.35 + (i % 8) * 0.12,
      height: Math.sin(i * 0.7) * 0.9,
      speed: 0.25 + (i % 6) * 0.05,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.children.forEach((node, i) => {
      const n = nodes[i];

      const a = n.angle + t * n.speed;

      node.position.x = Math.cos(a) * n.radius;
      node.position.z = Math.sin(a) * n.radius;
      node.position.y = n.height;

      const pulse =
        0.8 + Math.sin(t * 5 + i) * 0.35;

      node.scale.setScalar(pulse);

      node.material.opacity =
        0.35 + Math.sin(t * 4 + i) * 0.15;
    });
  });

  return (
    <group ref={group}>
      {nodes.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.025, 16, 16]} />

          <meshBasicMaterial
            color="#8FE8FF"
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}