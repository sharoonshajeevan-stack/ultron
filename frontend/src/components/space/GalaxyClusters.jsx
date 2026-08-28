import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

export default function GalaxyClusters() {
  const ref = useRef();
  const { camera } = useThree();

  const positions = useMemo(() => {
    const data = [];

    for (let c = 0; c < 18; c++) {
      const cx = Math.sin(c * 12.54) * 2200;
      const cy = Math.cos(c * 8.31) * 1800;
      const cz = Math.sin(c * 5.74) * 2600;

      for (let i = 0; i < 900; i++) {
        const a = i * 0.61803398875;

        const r = (i / 900) * 120;

        data.push(
          cx + Math.cos(a) * r,
          cy + Math.sin(a) * r * 0.35,
          cz + Math.sin(a * 0.4) * r
        );
      }
    }

    return new Float32Array(data);
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();

    ref.current.position.copy(camera.position);

    ref.current.rotation.y = t * 0.00002;
    ref.current.rotation.x = t * 0.00001;
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
    >
      <PointMaterial
        color="#AFD8FF"
        transparent
        opacity={0.75}
        size={1.8}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}