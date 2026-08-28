// src/components/ai/CoreCameraController.jsx

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export default function CoreCameraController() {
  const { camera, gl } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const canvas = gl.domElement;

    const handleWheel = (event) => {
      event.preventDefault();

      camera.position.z +=
        event.deltaY * 0.003;

      camera.position.z = Math.max(
        2.5,
        Math.min(7, camera.position.z)
      );

      camera.lookAt(0, 0, 0);
    };

    canvas.addEventListener(
      "wheel",
      handleWheel,
      { passive: false }
    );

    return () => {
      canvas.removeEventListener(
        "wheel",
        handleWheel
      );
    };
  }, [camera, gl]);

  return null;
}