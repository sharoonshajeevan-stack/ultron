import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";

export default function WaveRing() {
  const ref = useRef();

  const segments = 512;
  const radius = 1.55;

  const points = useMemo(() => {
    return new Array(segments + 1).fill().map(() => [0, 0, 0]);
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();

    ref.current.rotation.z = t * 0.08;

    const positions = [];

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;

      const wave =
        Math.sin(angle * 12 + t * 2.5) * 0.05 +
        Math.sin(angle * 32 - t * 3) * 0.02;

      const r = radius + wave;

      positions.push([
        Math.cos(angle) * r,
        Math.sin(angle) * r,
        0,
      ]);
    }

    ref.current.geometry.setPoints(positions);
  });

  return (
    <Line
      ref={ref}
      points={points}
      color="#66D6FF"
      lineWidth={2.5}
      transparent
      opacity={0.9}
    />
  );
}