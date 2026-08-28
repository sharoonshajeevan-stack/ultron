import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function PlanetField() {
  const group = useRef();
  const { camera } = useThree();

  const planets = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const a = i * 12.345;

      const r1 = Math.abs(Math.sin(a));
      const r2 = Math.abs(Math.sin(a + 1.2));
      const r3 = Math.abs(Math.sin(a + 2.4));
      const r4 = Math.abs(Math.sin(a + 3.6));

      return {
        position: [
          (r1 - 0.5) * 1800,
          (r2 - 0.5) * 1800,
          (r3 - 0.5) * 1800,
        ],
        radius: 4 + r4 * 10,
        color:
          i % 4 === 0
            ? "#4A7BFF"
            : i % 4 === 1
            ? "#7A92FF"
            : i % 4 === 2
            ? "#87CEFA"
            : "#B0C4DE",
        rotationSpeed: 0.02 + r2 * 0.03,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.position.copy(camera.position);

    group.current.children.forEach((planet, i) => {
      planet.rotation.y = t * planets[i].rotationSpeed;
      planet.rotation.x = t * planets[i].rotationSpeed * 0.4;
    });
  });

  return (
    <group ref={group}>
      {planets.map((planet, i) => (
        <mesh
          key={i}
          position={planet.position}
        >
          <sphereGeometry args={[planet.radius, 64, 64]} />

          <meshStandardMaterial
            color={planet.color}
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}