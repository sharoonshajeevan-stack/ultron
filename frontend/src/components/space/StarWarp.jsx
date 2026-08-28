import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

export default function StarWarp() {
  const ref = useRef();

  const positions = useMemo(() => {
    const data = [];

    for (let i = 0; i < 5000; i++) {
      const r1 = Math.abs(Math.sin(i * 12.9898));
      const r2 = Math.abs(Math.sin(i * 78.233));
      const r3 = Math.abs(Math.sin(i * 45.164));

      // Keep the center empty
      const radius = 40 + r1 * 80;

      const theta = r2 * Math.PI * 2;
      const phi = Math.acos(r3 * 2 - 1);

      data.push(
        Math.sin(phi) * Math.cos(theta) * radius,
        Math.sin(phi) * Math.sin(theta) * radius,
        Math.cos(phi) * radius
      );
    }

    return new Float32Array(data);
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();

    ref.current.rotation.y = t * 0.01;
    ref.current.rotation.z = t * 0.005;
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
    >
      <PointMaterial
        color="#BCE6FF"
        transparent
        opacity={0.7}
        size={0.12}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}