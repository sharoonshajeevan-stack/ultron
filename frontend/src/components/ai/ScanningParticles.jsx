import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function ScanningParticles() {
  const group = useRef();

  const particles = useMemo(() => {
    return Array.from({ length: 160 }, (_, i) => ({
      angle: (i / 160) * Math.PI * 2,
      radius: 1.25 + (i % 12) * 0.05,
      speed: 0.35 + (i % 10) * 0.04,
      offset: (i % 20) * 0.2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.children.forEach((mesh, i) => {
      const p = particles[i];

      const a = p.angle + t * p.speed;

      mesh.position.x = Math.cos(a) * p.radius;
      mesh.position.z = Math.sin(a) * p.radius;
      mesh.position.y = Math.sin(t * 2 + p.offset) * 1.15;

      const s = 0.6 + Math.sin(t * 6 + i) * 0.3;
      mesh.scale.setScalar(s);

      mesh.material.opacity =
        0.25 + Math.sin(t * 5 + i) * 0.12;
    });
  });

  return (
    <group ref={group}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.01, 8, 8]} />

          <meshBasicMaterial
            color="#C8F6FF"
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}