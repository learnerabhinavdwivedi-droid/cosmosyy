import { useMemo } from "react";
import * as THREE from "three";
import type { ArtifactProps } from "./shared";
import { MarsLandscapeFeature3D } from "./shared";
import {
  getCharredHeatShieldTexture,
} from "../textures";

export function MarsBlueberries3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const berrySpread = explode * 0.25;

  // Authentic cluster of spherules in martian sulphate bedrock
  const berries: [number, number, number, number][] = [
    [-0.2, 0.08, 0.1, 0.045],
    [-0.08, 0.09, -0.05, 0.04],
    [0.05, 0.07, 0.12, 0.038],
    [0.18, 0.08, -0.1, 0.048],
    [0.26, 0.06, 0.08, 0.035],
    [-0.15, 0.06, -0.18, 0.032],
    [0.02, 0.08, -0.15, 0.042],
  ];

  return (
    <group scale={scale}>
      {/* Layered Sulfate Bedrock Slab */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.08, 0.7]} />
        <meshStandardMaterial color="#c27748" roughness={0.95} metalness={0.05} wireframe={wireframe} />
      </mesh>

      {/* Grey-Blue Hematite Spherules ('Blueberries') */}
      {berries.map(([bx, by, bz, br], idx) => (
        <mesh
          key={idx}
          position={[bx + (bx > 0 ? berrySpread : -berrySpread), by + explode * 0.15, bz]}
          castShadow
        >
          <sphereGeometry args={[br, 16, 16]} />
          <meshStandardMaterial
            color="#3b4f6b"
            roughness={0.35}
            metalness={0.7}
            wireframe={wireframe}
          />
        </mesh>
      ))}
    </group>
  );
}

export function MarsHeatShield3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const heatShieldTex = useMemo(() => getCharredHeatShieldTexture(), []);
  const shellOffset = explode * 0.4;

  return (
    <group scale={scale}>
      {/* Charred Inverted Aeroshell Cone */}
      <mesh position={[0, 0.28 + shellOffset, 0]} rotation={[Math.PI * 0.85, 0.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.9, 0.45, 32, 1, true]} />
        <meshStandardMaterial
          map={heatShieldTex}
          roughness={0.88}
          metalness={0.2}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>

      {/* Fractured Aluminum Honeycomb Core (exposed yellow/metallic backing) */}
      <mesh position={[-0.1, 0.25, 0.1]} rotation={[Math.PI * 0.82, 0.15, 0]}>
        <ringGeometry args={[0.3, 0.75, 24]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} metalness={0.65} side={THREE.DoubleSide} wireframe={wireframe} />
      </mesh>

      {/* Impact Crater Gouge & Berm */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.6, 1.3, 24]} />
        <meshStandardMaterial color="#993d16" roughness={0.96} metalness={0.05} wireframe={wireframe} />
      </mesh>

      {/* Dropped Insulation Mylar Blanket Strip */}
      <mesh position={[0.45, 0.06, 0.35]} rotation={[-0.3, 0.4, 0.2]} castShadow>
        <planeGeometry args={[0.5, 0.25, 4, 4]} />
        <meshStandardMaterial color="#e5b842" metalness={0.9} roughness={0.25} side={THREE.DoubleSide} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

export function EagleCraterFeature3D(props: ArtifactProps) {
  return <MarsLandscapeFeature3D name="Eagle Crater" {...props} />;
}

export function MarathonValleyFeature3D(props: ArtifactProps) {
  return <MarsLandscapeFeature3D name="Marathon Valley" {...props} />;
}

export function PerseveranceValleyFeature3D(props: ArtifactProps) {
  return <MarsLandscapeFeature3D name="Perseverance Valley" {...props} />;
}
