import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function HaloRing({
  radius,
  rotationSpeed,
  tilt = [0, 0, 0],
  opacity = 0.2,
  color = "#7FD8FF",
}) {
  const ring = useRef();

  useFrame(({ clock }) => {
    if (!ring.current) return;

    const t = clock.getElapsedTime();

    ring.current.rotation.x =
      tilt[0] + t * rotationSpeed;

    ring.current.rotation.y =
      tilt[1] + t * rotationSpeed * 0.6;

    ring.current.rotation.z =
      tilt[2] + t * rotationSpeed * 0.3;

    const pulse =
      1 + Math.sin(t * 1.8 + radius) * 0.02;

    ring.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={ring}>
      <torusGeometry
        args={[radius, 0.012, 32, 320]}
      />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}