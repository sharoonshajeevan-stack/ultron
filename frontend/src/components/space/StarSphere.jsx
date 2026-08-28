import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

export default function StarSphere() {
  const ref = useRef();
  const { camera } = useThree();

  const positions = useMemo(() => {
    const array = [];

    let seed = 987654;

    function random() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    for (let i = 0; i < 30000; i++) {
      const radius = 2000 + random() * 3000;

      const theta = random() * Math.PI * 2;
      const phi = Math.acos(random() * 2 - 1);

      array.push(
        Math.sin(phi) * Math.cos(theta) * radius,
        Math.sin(phi) * Math.sin(theta) * radius,
        Math.cos(phi) * radius
      );
    }

    return new Float32Array(array);
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();

    ref.current.position.copy(camera.position);

    ref.current.rotation.y = t * 0.00015;
    ref.current.rotation.x = t * 0.00005;
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
    >
      <PointMaterial
        transparent
        color="#5DA9FF"
        size={1.8}
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
      />
    </Points>
  );
}