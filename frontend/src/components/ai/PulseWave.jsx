import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function PulseWave() {
  const wave1 = useRef();
  const wave2 = useRef();
  const wave3 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    [
      [wave1.current, 0],
      [wave2.current, 0.8],
      [wave3.current, 1.6],
    ].forEach(([wave, offset]) => {
      if (!wave) return;

      const scale =
        1 + ((t + offset) % 2.4) * 0.8;

      wave.scale.setScalar(scale);

      wave.material.opacity =
        Math.max(
          0,
          0.18 - (((t + offset) % 2.4) * 0.08)
        );
    });
  });

  return (
    <>
      <mesh ref={wave1}>
        <sphereGeometry args={[1.45, 64, 64]} />
        <meshBasicMaterial
          color="#66DDFF"
          transparent
          opacity={0.18}
          wireframe
          depthWrite={false}
        />
      </mesh>

      <mesh ref={wave2}>
        <sphereGeometry args={[1.45, 64, 64]} />
        <meshBasicMaterial
          color="#66DDFF"
          transparent
          opacity={0.12}
          wireframe
          depthWrite={false}
        />
      </mesh>

      <mesh ref={wave3}>
        <sphereGeometry args={[1.45, 64, 64]} />
        <meshBasicMaterial
          color="#66DDFF"
          transparent
          opacity={0.08}
          wireframe
          depthWrite={false}
        />
      </mesh>
    </>
  );
}