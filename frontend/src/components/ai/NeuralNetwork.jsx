import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function NeuralNetwork() {
  const group = useRef();

  const nodes = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      radius: 0.8 + (i % 8) * 0.18,
      angle: (i / 80) * Math.PI * 2,
      height: Math.sin(i * 0.45) * 0.9,
      speed: 0.15 + (i % 5) * 0.04,
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
        0.8 + Math.sin(t * 5 + i) * 0.25;

      node.scale.setScalar(pulse);

      if (node.material) {
        node.material.opacity =
          0.2 + Math.sin(t * 4 + i) * 0.12;
      }
    });

    group.current.rotation.y = t * 0.04;
  });

  return (
    <group ref={group}>
      {nodes.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.012, 8, 8]} />

          <meshBasicMaterial
            color="#D8FFFF"
            transparent
            opacity={0.28}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}