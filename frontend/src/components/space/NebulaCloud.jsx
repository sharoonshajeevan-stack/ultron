import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function NebulaCloud() {
  const ref = useRef();
  const { camera } = useThree();

  const particles = useMemo(() => {
    const array = [];

    let seed = 54321;

    function random() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    for (let i = 0; i < 120; i++) {
      array.push({
        position: [
          (random() - 0.5) * 350,
          (random() - 0.5) * 350,
          (random() - 0.5) * 350,
        ],
        scale: 6 + random() * 12,
        opacity: 0.015 + random() * 0.02,
      });
    }

    return array;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();

    ref.current.position.copy(camera.position);

    ref.current.rotation.y = t * 0.00008;
    ref.current.rotation.x = t * 0.00003;
  });

  return (
    <group ref={ref}>
      {particles.map((p, i) => (
        <mesh
          key={i}
          position={p.position}
          scale={p.scale}
        >
          <sphereGeometry args={[1, 24, 24]} />

          <meshBasicMaterial
            color="#1E6FFF"
            transparent
            opacity={p.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}