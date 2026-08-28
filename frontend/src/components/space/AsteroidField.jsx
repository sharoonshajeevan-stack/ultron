import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function AsteroidField() {
  const group = useRef();
  const { camera } = useThree();

  const asteroids = useMemo(() => {
    const list = [];

    for (let i = 0; i < 350; i++) {
      const x = Math.sin(i * 12.9898) * 43758.5453;
      const r = x - Math.floor(x);

      const y = Math.sin((i + 1) * 78.233) * 12345.6789;
      const r2 = y - Math.floor(y);

      const z = Math.sin((i + 2) * 45.164) * 98765.4321;
      const r3 = z - Math.floor(z);

      const w = Math.sin((i + 3) * 91.713) * 65432.1234;
      const r4 = w - Math.floor(w);

      list.push({
        position: [
          (r - 0.5) * 500,
          (r2 - 0.5) * 500,
          (r3 - 0.5) * 500,
        ],
        rotation: [
          r * Math.PI,
          r2 * Math.PI,
          r3 * Math.PI,
        ],
        scale: 0.08 + r4 * 0.28,
        speed: 0.05 + r * 0.15,
      });
    }

    return list;
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.position.copy(camera.position);

    group.current.children.forEach((mesh, i) => {
      const s = asteroids[i].speed;

      mesh.rotation.x += s * 0.004;
      mesh.rotation.y += s * 0.006;
      mesh.rotation.z += s * 0.003;

      mesh.position.z =
        asteroids[i].position[2] + Math.sin(t * s + i) * 0.3;
    });
  });

  return (
    <group ref={group}>
      {asteroids.map((a, i) => (
        <mesh
          key={i}
          position={a.position}
          rotation={a.rotation}
          scale={a.scale}
        >
          <icosahedronGeometry args={[1, 1]} />

          <meshStandardMaterial
            color="#4A5363"
            roughness={1}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}