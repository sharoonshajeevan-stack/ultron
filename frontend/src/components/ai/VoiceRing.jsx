import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";

export default function VoiceRing() {
  const ringRef = useRef();

  const points = useMemo(() => {
    const pts = [];
    const radius = 1.45;
    const segments = 256;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;

      pts.push([
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0,
      ]);
    }

    return pts;
  }, []);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;

    const t = clock.getElapsedTime();

    ringRef.current.rotation.z = t * 0.12;

    const pulse = 1 + Math.sin(t * 2) * 0.02;

    ringRef.current.scale.set(pulse, pulse, pulse);
  });

  return (
    <group ref={ringRef}>
      <Line
        points={points}
        color="#66D6FF"
        lineWidth={2.5}
        transparent
        opacity={0.9}
      />
    </group>
  );
}