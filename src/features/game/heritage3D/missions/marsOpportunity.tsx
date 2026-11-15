import { useMemo } from "react";
import * as THREE from "three";
import type { ArtifactProps } from "./shared";
import { getCharredHeatShieldTexture } from "../textures";

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
        <meshStandardMaterial
          color="#c27748"
          roughness={0.95}
          metalness={0.05}
          wireframe={wireframe}
        />
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
      <mesh
        position={[0, 0.28 + shellOffset, 0]}
        rotation={[Math.PI * 0.85, 0.2, 0]}
        castShadow
        receiveShadow
      >
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
        <meshStandardMaterial
          color="#b45309"
          roughness={0.7}
          metalness={0.65}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>

      {/* Impact Crater Gouge & Berm */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.6, 1.3, 24]} />
        <meshStandardMaterial
          color="#993d16"
          roughness={0.96}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* Dropped Insulation Mylar Blanket Strip */}
      <mesh position={[0.45, 0.06, 0.35]} rotation={[-0.3, 0.4, 0.2]} castShadow>
        <planeGeometry args={[0.5, 0.25, 4, 4]} />
        <meshStandardMaterial
          color="#e5b842"
          metalness={0.9}
          roughness={0.25}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

export function OpportunityRover3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const mastY = explode * 0.45;
  const armX = -explode * 0.35;
  const panelSpread = explode * 0.3;
  const wheelSpread = explode * 0.22;

  const wheels: [number, number, number][] = [
    [-0.65 - wheelSpread, 0.2, 0.6 + wheelSpread],
    [0.0, 0.2, 0.7 + wheelSpread],
    [0.65 + wheelSpread, 0.2, 0.6 + wheelSpread],
    [-0.65 - wheelSpread, 0.2, -0.6 - wheelSpread],
    [0.0, 0.2, -0.7 - wheelSpread],
    [0.65 + wheelSpread, 0.2, -0.6 - wheelSpread],
  ];

  return (
    <group scale={scale}>
      {/* 1. Main Chassis (Warm Electronics Box) */}
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.3, 0.7]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.75}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Triangular Solar Panel Wings */}
      <group position={[0, 0.54 + panelSpread, 0]} castShadow>
        {/* Center Deck Solar Panel */}
        <mesh>
          <boxGeometry args={[1.05, 0.02, 0.7]} />
          <meshStandardMaterial
            color="#1e1b4b"
            roughness={0.25}
            metalness={0.8}
            wireframe={wireframe}
          />
        </mesh>
        {/* Left Wing Solar Panel */}
        <mesh position={[0, 0, 0.52]} rotation={[0, 0, 0.04]}>
          <boxGeometry args={[0.9, 0.018, 0.38]} />
          <meshStandardMaterial
            color="#1e1b4b"
            roughness={0.25}
            metalness={0.8}
            wireframe={wireframe}
          />
        </mesh>
        {/* Right Wing Solar Panel */}
        <mesh position={[0, 0, -0.52]} rotation={[0, 0, -0.04]}>
          <boxGeometry args={[0.9, 0.018, 0.38]} />
          <meshStandardMaterial
            color="#1e1b4b"
            roughness={0.25}
            metalness={0.8}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* 3. Six Rocker-Bogie Aluminum Wheels */}
      {wheels.map(([wx, wy, wz], idx) => (
        <group key={idx} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.15, 16]} />
            <meshStandardMaterial
              color="#64748b"
              metalness={0.9}
              roughness={0.25}
              wireframe={wireframe}
            />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.17, 10]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.95}
              roughness={0.15}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      ))}

      {/* 4. Pancam Mast Assembly (PMA) */}
      <group position={[0.35, 0.55 + mastY, 0.22]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.025, 0.9, 10]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Stereo Pancam Camera Bar */}
        <group position={[0, 0.92, 0]} castShadow>
          <mesh>
            <boxGeometry args={[0.12, 0.08, 0.32]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.85}
              roughness={0.3}
              wireframe={wireframe}
            />
          </mesh>
          {/* Dual Pancam Lenses */}
          <mesh position={[0.065, 0, 0.1]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.02, 12]} />
            <meshStandardMaterial
              color="#0284c7"
              metalness={0.9}
              roughness={0.1}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0.065, 0, -0.1]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.02, 12]} />
            <meshStandardMaterial
              color="#0284c7"
              metalness={0.9}
              roughness={0.1}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      </group>

      {/* 5. Front Instrument Deployment Device (IDD) Arm */}
      <group position={[0.55 + armX, 0.38, -0.15]}>
        <mesh position={[0.15, -0.05, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.018, 0.018, 0.4, 8]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.88}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
        {/* Sensor Turret Head (RAT + Mössbauer + APXS) */}
        <group position={[0.32, -0.18, 0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.16, 12]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.9}
              roughness={0.2}
              wireframe={wireframe}
            />
          </mesh>
          {/* Rock Abrasion Tool (RAT) grinding wheel */}
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 0.04, 12]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.95}
              roughness={0.15}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      </group>

      {/* 6. Steerable High-Gain Parabolic Dish Antenna */}
      <group position={[-0.32, 0.62 + explode * 0.2, 0]} rotation={[0.3, 0.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.05, 0.06, 16]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.92}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.15, 8]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={0.95}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

export function EagleCraterFeature3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const lift = explode * 0.2;

  return (
    <group scale={scale} position={[0, lift, 0]}>
      {/* Meridiani Planum Sand Dune & Crater Berm Rim Base */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.08, 1.8]} />
        <meshStandardMaterial
          color="#7c2d12"
          roughness={0.96}
          metalness={0.04}
          wireframe={wireframe}
        />
      </mesh>

      {/* 22m Eagle Impact Crater Basin Depression */}
      <group position={[0.2, 0.08, 0.1]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.6, 0.06, 1.3]} />
          <meshStandardMaterial color="#451a03" roughness={0.98} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Opportunity Ledge: Exposed Stratified Sulfate Bedrock Outcrop */}
      <group position={[-0.25, 0.22, -0.2]}>
        <mesh rotation={[0, 0.12, -0.06]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.22, 0.75]} />
          <meshStandardMaterial
            color="#d97706"
            roughness={0.9}
            metalness={0.08}
            wireframe={wireframe}
          />
        </mesh>
        {/* Upper Outcrop Sandstone Strata Layers */}
        <mesh position={[0.08, 0.13, 0.05]} castShadow>
          <boxGeometry args={[1.25, 0.07, 0.6]} />
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.88}
            metalness={0.1}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[-0.15, 0.19, -0.05]} castShadow>
          <boxGeometry args={[0.9, 0.06, 0.45]} />
          <meshStandardMaterial
            color="#fbbf24"
            roughness={0.85}
            metalness={0.12}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Dense Field of Shiny Blue-Grey Hematite 'Blueberries' (Spherules) */}
      {(
        [
          [-0.55, 0.36, -0.1],
          [-0.38, 0.35, -0.28],
          [-0.2, 0.37, -0.05],
          [0.05, 0.36, -0.2],
          [0.22, 0.34, -0.12],
          [-0.42, 0.12, 0.18],
          [-0.15, 0.11, 0.25],
          [0.1, 0.11, 0.32],
          [0.35, 0.12, 0.15],
          [0.55, 0.12, 0.28],
        ] as const
      ).map(([bx, by, bz], idx) => (
        <mesh key={idx} position={[bx, by, bz]} castShadow>
          <sphereGeometry args={[0.032, 12, 12]} />
          <meshStandardMaterial
            color="#3b4f6b"
            roughness={0.28}
            metalness={0.82}
            emissive="#1e293b"
            emissiveIntensity={0.2}
            wireframe={wireframe}
          />
        </mesh>
      ))}
    </group>
  );
}

export function MarathonValleyFeature3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const lift = explode * 0.2;

  return (
    <group scale={scale} position={[0, lift, 0]}>
      {/* Endeavour Crater Rim Wall Slopes */}
      <mesh position={[-0.6, 0.3, 0]} rotation={[0, 0, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.4, 1.6]} />
        <meshStandardMaterial
          color="#7c2d12"
          roughness={0.92}
          metalness={0.08}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0.6, 0.3, 0]} rotation={[0, 0, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.4, 1.6]} />
        <meshStandardMaterial
          color="#7c2d12"
          roughness={0.92}
          metalness={0.08}
          wireframe={wireframe}
        />
      </mesh>

      {/* Valley Floor with Exposed Smectite Clay Deposits (Blue-Grey Bands) */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[0.8, 0.1, 1.6]} />
        <meshStandardMaterial
          color="#57534e"
          roughness={0.95}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.55, 1.4]} />
        <meshStandardMaterial
          color="#475569"
          roughness={0.75}
          metalness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Spirit Mound Central Promontory */}
      <mesh position={[0, 0.24, 0.2]} castShadow>
        <dodecahedronGeometry args={[0.22, 1]} />
        <meshStandardMaterial
          color="#64748b"
          roughness={0.88}
          metalness={0.15}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

export function PerseveranceValleyFeature3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const lift = explode * 0.2;

  return (
    <group scale={scale} position={[0, lift, 0]}>
      {/* Sloping Inner Rim Face of Endeavour Crater */}
      <mesh position={[0, 0.25, 0]} rotation={[0.25, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.3, 1.5]} />
        <meshStandardMaterial
          color="#854d0e"
          roughness={0.94}
          metalness={0.06}
          wireframe={wireframe}
        />
      </mesh>

      {/* Carved Fluvial Channel / Debris Flow Gully */}
      <mesh position={[0, 0.28, 0]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.35, 0.12, 1.4]} />
        <meshStandardMaterial color="#451a03" roughness={0.96} wireframe={wireframe} />
      </mesh>

      {/* Sorted Stone Stripes & Rocks along Channel Margins */}
      {(
        [
          [-0.24, 0.35, 0.3],
          [0.26, 0.34, 0.2],
          [-0.22, 0.25, -0.2],
          [0.25, 0.24, -0.3],
        ] as [number, number, number][]
      ).map(([sx, sy, sz], idx) => (
        <mesh key={idx} position={[sx, sy, sz]} castShadow>
          <dodecahedronGeometry args={[0.07, 0]} />
          <meshStandardMaterial
            color="#292524"
            roughness={0.9}
            metalness={0.1}
            wireframe={wireframe}
          />
        </mesh>
      ))}
    </group>
  );
}
