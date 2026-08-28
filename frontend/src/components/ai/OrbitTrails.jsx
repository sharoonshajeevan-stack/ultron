import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function OrbitTrails() {
  const group = useRef();

  const trails = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      radius: 1.7 + (i % 6) * 0.12,
      speed: 0.08 + (i % 5) * 0.03,
      rotation: (i / 18) * Math.PI * 2,
      arc: Math.PI / (2.8 + (i % 3)),
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.children.forEach((trail, i) => {
      const d = trails[i];

      trail.rotation.x =
        d.rotation + t * d.speed;

      trail.rotation.y =
        d.rotation * 0.6 + t * d.speed * 0.8;

      trail.rotation.z =
        d.rotation * 0.3 + t * d.speed * 0.4;

      trail.material.opacity =
        0.1 + Math.sin(t * 3 + i) * 0.05;
    });
  });

  return (
    <group ref={group}>
      {trails.map((trail, i) => (
        <mesh key={i}>
          <torusGeometry
            args={[
              trail.radius,
              0.004,
              16,
              180,
              trail.arc,
            ]}
          />

          <meshBasicMaterial
            color="#B7F4FF"
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}