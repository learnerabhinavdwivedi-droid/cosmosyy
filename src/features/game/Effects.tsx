import { useAppStore } from "@/store/useAppStore";
import {
  EffectComposer,
  Bloom,
  Vignette,
  SMAA,
} from "@react-three/postprocessing";

interface EffectsProps {
  bloom?: boolean;
  vignette?: boolean;
  bloomThreshold?: number;
  bloomIntensity?: number;
  vignetteDarkness?: number;
}

export function Effects({
  bloom = true,
  vignette = false,
  bloomThreshold = 0.85,
  bloomIntensity = 0.5,
  vignetteDarkness = 0.55,
}: EffectsProps) {
  const quality = useAppStore((s) => s.settings.quality);
  if (quality === "low") return null;

  return (
    <EffectComposer multisampling={0}>
      <SMAA />
      {bloom && (
        <Bloom
          luminanceThreshold={bloomThreshold}
          luminanceSmoothing={0.4}
          intensity={quality === "high" ? bloomIntensity * 1.2 : bloomIntensity}
          mipmapBlur
        />
      )}
      {vignette && quality === "high" && (
        <Vignette eskil={false} offset={0.3} darkness={vignetteDarkness} />
      )}
    </EffectComposer>
  );
}
