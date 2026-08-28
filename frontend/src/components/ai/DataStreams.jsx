import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function DataStreams() {
  const group = useRef();

  const streams = useMemo(() => {
    return Array.from({ length: 36 }, (_, i) => ({
      angle: (i / 36) * Math.PI * 2,
      speed: 0.15 + (i % 6) * 0.03,
      radius: 1.48 + (i % 4) * 0.05,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.children.forEach((line, i) => {
      const s = streams[i];

      line.rotation.y = s.angle;

      line.position.y =
        Math.sin(t * s.speed + i) * 0.45;

      line.scale.y =
        0.7 +
        Math.sin(t * 3 + i) * 0.3;
    });
  });

  return (
    <group ref={group}>
      {streams.map((stream, i) => (
        <mesh key={i}>
          <cylinderGeometry
            args={[0.004, 0.004, 0.55, 8]}
          />

          <meshBasicMaterial
            color="#6FD8FF"
            transparent
            opacity={0.18}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}