import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function EnergyBeams() {
  const group = useRef();

  const beams = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => ({
      angle: (i / 48) * Math.PI * 2,
      radius: 0.25 + (i % 6) * 0.18,
      speed: 0.4 + (i % 8) * 0.08,
      height: 0.4 + (i % 5) * 0.25,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.children.forEach((beam, i) => {
      const b = beams[i];

      const a = b.angle + t * b.speed;

      beam.position.x = Math.cos(a) * b.radius;
      beam.position.z = Math.sin(a) * b.radius;

      beam.rotation.y = -a;

      beam.scale.y =
        0.8 + Math.sin(t * 5 + i) * 0.4;

      beam.material.opacity =
        0.12 + Math.sin(t * 4 + i) * 0.06;
    });
  });

  return (
    <group ref={group}>
      {beams.map((beam, i) => (
        <mesh key={i}>
          <cylinderGeometry
            args={[0.003, 0.003, beam.height, 8]}
          />

          <meshBasicMaterial
            color="#B8F2FF"
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}