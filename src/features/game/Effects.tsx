import { useAppStore } from "@/store/useAppStore";
import {
  EffectComposer,
  Bloom,
  Vignette,
  SMAA,
  ChromaticAberration,
} from "@react-three/postprocessing";
import * as THREE from "three";

const CHROMATIC_OFFSET = new THREE.Vector2(0.0012, 0.0012);

interface EffectsProps {
  bloom?: boolean;
  vignette?: boolean;
  chromaticAberration?: boolean;
  bloomThreshold?: number;
  bloomIntensity?: number;
  vignetteDarkness?: number;
}

export function Effects({
  bloom = true,
  vignette = true,
  chromaticAberration = true,
  bloomThreshold = 0.55,
  bloomIntensity = 1.0,
  vignetteDarkness = 0.6,
}: EffectsProps) {
  const quality = useAppStore((s) => s.settings.quality);
  if (quality === "low") return null;

  return (
    <EffectComposer multisampling={0}>
      <SMAA />
      {bloom && (
        <Bloom
          luminanceThreshold={bloomThreshold}
          luminanceSmoothing={0.45}
          intensity={quality === "high" ? bloomIntensity * 1.25 : bloomIntensity}
          mipmapBlur
        />
      )}
      {vignette && (
        <Vignette eskil={false} offset={0.28} darkness={vignetteDarkness} />
      )}
      {chromaticAberration && quality === "high" && (
        <ChromaticAberration
          offset={CHROMATIC_OFFSET}
          radialModulation={true}
          modulationOffset={0.4}
        />
      )}
    </EffectComposer>
  );
}
