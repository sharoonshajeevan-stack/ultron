import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function CoreAura() {
  const aura = useRef();

  useFrame(({ clock }) => {
    if (!aura.current) return;

    const t = clock.getElapsedTime();

    aura.current.rotation.y = t * 0.04;

    const pulse =
      1 +
      Math.sin(t * 1.2) * 0.05 +
      Math.sin(t * 3.5) * 0.02;

    aura.current.scale.setScalar(pulse);

    aura.current.material.opacity =
      0.08 +
      Math.sin(t * 2.5) * 0.02;
  });

  return (
    <mesh ref={aura}>
      <sphereGeometry args={[2.6, 128, 128]} />

      <meshBasicMaterial
        color="#00BFFF"
        transparent
        opacity={0.08}
        depthWrite={false}
        side={2}
      />
    </mesh>
  );
}