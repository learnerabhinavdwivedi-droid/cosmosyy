import type { ArtifactProps } from "./shared";
import { MarsLandscapeFeature3D } from "./shared";

export function RoverWheelTracks3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const trackSpread = explode * 0.15;

  return (
    <group scale={scale}>
      {/* Regular Left Track (Shallow red tread imprints) */}
      <mesh position={[-0.25 - trackSpread, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.18, 1.4]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.96} metalness={0.02} wireframe={wireframe} />
      </mesh>

      {/* Right Track (Stalled wheel dug 10 cm trench exposing 90% pure opaline white silica) */}
      <mesh position={[0.25 + trackSpread, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.22, 1.4]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.7}
          metalness={0.15}
          emissive="#e2e8f0"
          emissiveIntensity={0.2}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

export function BackshellParachute3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const spread = explode * 0.4;

  return (
    <group scale={scale}>
      {/* Crumpled Conical Backshell */}
      <mesh position={[-0.35 - spread, 0.22, 0]} rotation={[0.4, 0.3, 0.6]} castShadow>
        <coneGeometry args={[0.55, 0.35, 16]} />
        <meshStandardMaterial color="#ebe7de" roughness={0.65} metalness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Draped Orange-and-White Striped Nylon Parachute Canopy */}
      <mesh position={[0.45 + spread, 0.06, 0.1]} rotation={[-Math.PI / 2, 0, 0.2]} receiveShadow>
        <planeGeometry args={[1.2, 0.8, 6, 6]} />
        <meshStandardMaterial color="#ea580c" roughness={0.85} metalness={0.05} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.55 + spread, 0.07, 0.15]} rotation={[-Math.PI / 2, 0, 0.2]}>
        <planeGeometry args={[0.4, 0.7, 4, 4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} metalness={0.05} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

export function ColumbiaHillsFeature3D(props: ArtifactProps) {
  return <MarsLandscapeFeature3D name="Columbia Hills" {...props} />;
}

export function HomePlateFeature3D(props: ArtifactProps) {
  return <MarsLandscapeFeature3D name="Home Plate" {...props} />;
}

export function BonnevilleCraterFeature3D(props: ArtifactProps) {
  return <MarsLandscapeFeature3D name="Bonneville Crater" {...props} />;
}
