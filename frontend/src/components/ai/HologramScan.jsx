import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function HologramScan() {
  const scan = useRef();

  useFrame(({ clock }) => {
    if (!scan.current) return;

    const t = clock.getElapsedTime();

    scan.current.rotation.y = t * 0.25;

    scan.current.position.y =
      Math.sin(t * 1.8) * 0.18;

    scan.current.material.opacity =
      0.08 + Math.sin(t * 3) * 0.03;
  });

  return (
    <mesh ref={scan}>
      <torusGeometry
        args={[1.48, 0.02, 32, 256]}
      />

      <meshBasicMaterial
        color="#66DDFF"
        transparent
        opacity={0.08}
        depthWrite={false}
      />
    </mesh>
  );
}