import { useMemo } from "react";
import type { ArtifactProps } from "./shared";
import { getSolarPanelTexture, getGoldKaptonTexture } from "../textures";

export function SojournerRover3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const solarTex = useMemo(() => getSolarPanelTexture(), []);
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const wheelSpread = explode * 0.2;

  return (
    <group scale={scale}>
      {/* Warm Gold-foiled Chassis Body */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.16, 0.36]} />
        <meshStandardMaterial
          map={goldKaptonTex}
          color="#dfa230"
          metalness={0.9}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>

      {/* Top Silicon Solar Panel Deck */}
      <mesh position={[0, 0.31, 0]}>
        <boxGeometry args={[0.52, 0.015, 0.34]} />
        <meshStandardMaterial
          map={solarTex}
          metalness={0.7}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>

      {/* 6 Cleated Aluminum Wheels with Rocker-Bogie Linkage */}
      {(
        [
          [-0.24, 0.1, 0.22 + wheelSpread],
          [0, 0.1, 0.23 + wheelSpread],
          [0.24, 0.1, 0.22 + wheelSpread],
          [-0.24, 0.1, -0.22 - wheelSpread],
          [0, 0.1, -0.23 - wheelSpread],
          [0.24, 0.1, -0.22 - wheelSpread],
        ] as [number, number, number][]
      ).map(([wx, wy, wz], idx) => (
        <group key={idx} position={[wx, wy, wz]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.075, 0.075, 0.05, 12]} />
            <meshStandardMaterial
              color="#64748b"
              metalness={0.85}
              roughness={0.3}
              wireframe={wireframe}
            />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.95}
              roughness={0.15}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      ))}

      {/* Rear APXS Spectrometer Sensor Head */}
      <group position={[-0.32 - explode * 0.25, 0.18, 0]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.12, 12]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* UHF Whip Antenna */}
      <mesh position={[0.2, 0.45 + explode * 0.2, 0.12]}>
        <cylinderGeometry args={[0.004, 0.004, 0.28, 6]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.9}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

export function PathfinderBaseStation3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const solarTex = useMemo(() => getSolarPanelTexture(), []);
  const petalSpread = explode * 0.4;

  return (
    <group scale={scale}>
      {/* Central Equipment Electronics Triangle */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.2, 3]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.85}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3 Fold-down Triangular Solar Petals */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={deg} rotation={[0, rad, 0]}>
            <mesh position={[0.65 + petalSpread, 0.08, 0]} rotation={[0, 0, 0.15]}>
              <boxGeometry args={[0.6, 0.02, 0.45]} />
              <meshStandardMaterial
                map={solarTex}
                metalness={0.7}
                roughness={0.25}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        );
      })}

      {/* Deflated Kevlar Airbag Cushions around Perimeter */}
      {[60, 180, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh key={deg} position={[Math.cos(rad) * 0.8, 0.06, Math.sin(rad) * 0.8]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial
              color="#fef08a"
              roughness={0.9}
              metalness={0.1}
              wireframe={wireframe}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function MarsDeploymentRamp3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const rampSpread = explode * 0.15;

  return (
    <group scale={scale}>
      {/* Dual Rollout Track Ramps */}
      <mesh position={[-0.12 - rampSpread, 0.14, 0.45]} rotation={[0.35, 0, 0]} castShadow>
        <boxGeometry args={[0.16, 0.015, 0.95]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.85}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0.12 + rampSpread, 0.14, 0.45]} rotation={[0.35, 0, 0]} castShadow>
        <boxGeometry args={[0.16, 0.015, 0.95]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.85}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

export function IMPCameraMast3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const mastY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Telescoping Tubular Mast */}
      <mesh position={[0, 0.45 + mastY * 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.016, 0.02, 0.9 + mastY, 8]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.9}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Stereo Camera Binocular Head */}
      <group position={[0, 0.95 + mastY, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.12, 0.1]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.85}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
        {/* Left Eye Filter Wheel */}
        <mesh position={[-0.07, 0, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.1}
            metalness={0.9}
            wireframe={wireframe}
          />
        </mesh>
        {/* Right Eye Filter Wheel */}
        <mesh position={[0.07, 0, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.1}
            metalness={0.9}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

export function BarnacleBillRock3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const liftY = explode * 0.15;

  return (
    <group scale={scale} position={[0, liftY, 0]}>
      {/* Faceted Volcanic Andesite Boulder */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial
          color="#57534e"
          roughness={0.92}
          metalness={0.15}
          wireframe={wireframe}
        />
      </mesh>
      {/* Circular APXS Contact Abutment Mark */}
      <mesh position={[0.22, 0.26, 0.26]} rotation={[0.4, 0.6, 0]}>
        <ringGeometry args={[0.03, 0.055, 12]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

export function YogiRock3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const liftY = explode * 0.15;

  return (
    <group scale={scale} position={[0, liftY, 0]}>
      {/* Large Angular Basalt Boulder */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color="#44403c"
          roughness={0.94}
          metalness={0.12}
          wireframe={wireframe}
        />
      </mesh>
      {/* Wind-blown Red Dust Drift Tail on Leeward Side */}
      <mesh position={[0.45, 0.04, -0.2]} rotation={[-Math.PI / 2, 0, 0.5]} receiveShadow>
        <planeGeometry args={[0.9, 0.6]} />
        <meshStandardMaterial
          color="#9a3412"
          roughness={0.98}
          metalness={0.02}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}
