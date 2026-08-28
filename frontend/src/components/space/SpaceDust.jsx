import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

export default function SpaceDust() {
  const ref = useRef();
  const { camera } = useThree();

  const positions = useMemo(() => {
    const array = [];

    let seed = 456789;

    function random() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    for (let i = 0; i < 18000; i++) {
      array.push(
        (random() - 0.5) * 120,
        (random() - 0.5) * 120,
        (random() - 0.5) * 120
      );
    }

    return new Float32Array(array);
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();

    ref.current.position.copy(camera.position);

    ref.current.rotation.y = t * 0.0004;
    ref.current.rotation.x = t * 0.00015;
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
    >
      <PointMaterial
        transparent
        color="#C7E8FF"
        size={0.22}
        opacity={0.45}
        depthWrite={false}
        sizeAttenuation
      />
    </Points>
  );
}