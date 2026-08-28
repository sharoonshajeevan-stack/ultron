import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

export default function NearStars() {
  const ref = useRef();
  const { camera } = useThree();

  const positions = useMemo(() => {
    const array = [];

    let seed = 123456;

    function random() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    for (let i = 0; i < 12000; i++) {
      const r = 150 + random() * 250;

      const theta = random() * Math.PI * 2;
      const phi = Math.acos(random() * 2 - 1);

      array.push(
        Math.sin(phi) * Math.cos(theta) * r,
        Math.sin(phi) * Math.sin(theta) * r,
        Math.cos(phi) * r
      );
    }

    return new Float32Array(array);
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();

    ref.current.position.copy(camera.position);

    ref.current.rotation.y = t * 0.002;
    ref.current.rotation.x = t * 0.0006;
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
    >
      <PointMaterial
        transparent
        color="#A6D8FF"
        size={0.65}
        sizeAttenuation
        depthWrite={false}
        opacity={0.95}
      />
    </Points>
  );
}