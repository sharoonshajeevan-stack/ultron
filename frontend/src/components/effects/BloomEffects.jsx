import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from "@react-three/postprocessing";

import { BlendFunction } from "postprocessing";

export default function BloomEffects() {
  return (
    <EffectComposer multisampling={8}>
      <Bloom
        mipmapBlur
        intensity={2.8}
        luminanceThreshold={0.05}
        luminanceSmoothing={0.9}
        radius={1}
      />

      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0004, 0.0004]}
      />

      <Noise
        opacity={0.015}
        premultiply
      />

      <Vignette
        eskil={false}
        offset={0.18}
        darkness={0.7}
      />
    </EffectComposer>
  );
}