import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

import vertexShader from "../shaders/coreVertex.glsl";
import fragmentShader from "../shaders/coreFragment.glsl";

const HologramMaterial = shaderMaterial(
  {
    uTime: 0,
  },

  vertexShader,

  fragmentShader,

  {
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }
);

extend({ HologramMaterial });

export default HologramMaterial;