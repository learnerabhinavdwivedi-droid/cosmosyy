import { useMemo } from "react";
import type { ArtifactProps } from "./shared";
import { MarsLandscapeFeature3D } from "./shared";
import {
  getSolarPanelTexture,
} from "../textures";

export function IngenuityHelicopter3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const solarTex = useMemo(() => getSolarPanelTexture(), []);
  const rotorY1 = 0.5 + explode * 0.3;
  const rotorY2 = 0.65 + explode * 0.5;

  return (
    <group scale={scale}>
      {/* 4 Carbon-Composite Landing Legs */}
      {[45, 135, 225, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={deg} rotation={[0, rad, 0]}>
            <mesh position={[0.22, 0.16, 0]} rotation={[0, 0, -0.75]} castShadow>
              <cylinderGeometry args={[0.006, 0.006, 0.46, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
            </mesh>
            {/* Footpad */}
            <mesh position={[0.36, 0.015, 0]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} wireframe={wireframe} />
            </mesh>
          </group>
        );
      })}

      {/* Central Fuselage Cube (Gold MLI thermal insulation) */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color="#dfa230" metalness={0.92} roughness={0.22} wireframe={wireframe} />
      </mesh>

      {/* Downward Horizon / Navigation Sensor Window */}
      <mesh position={[0, 0.185, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.03, 12]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} wireframe={wireframe} />
      </mesh>

      {/* Rotor Drive Mast */}
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.42, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Lower Rotor Assembly (Counter-clockwise) */}
      <group position={[0, rotorY1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.008, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} wireframe={wireframe} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 0.03, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Upper Rotor Assembly (Clockwise) */}
      <group position={[0, rotorY2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.008, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} wireframe={wireframe} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 0.03, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Top Solar Panel Substrate */}
      <mesh position={[0, 0.8 + explode * 0.6, 0]} castShadow>
        <boxGeometry args={[0.22, 0.006, 0.22]} />
        <meshStandardMaterial map={solarTex} metalness={0.7} roughness={0.25} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

export function MarsSampleTubes3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const spread = explode * 0.25;

  return (
    <group scale={scale}>
      {/* Regolith Drop Bed */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.2, 0.9]} />
        <meshStandardMaterial color="#883311" roughness={0.95} metalness={0.05} wireframe={wireframe} />
      </mesh>

      {/* Tube 1: Core Sample Rock (Titanium cylinder with gold collar) */}
      <group position={[-0.25 - spread, 0.03, 0]} rotation={[0, 0.4, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.38, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} wireframe={wireframe} />
        </mesh>
        {/* Gold Seal Collar */}
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.03, 16]} />
          <meshStandardMaterial color="#e5b842" metalness={0.92} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Tube 2: Atmospheric Witness Sample Tube */}
      <group position={[0.15 + spread, 0.03, 0.15]} rotation={[0, -0.6, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.38, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.03, 16]} />
          <meshStandardMaterial color="#e5b842" metalness={0.92} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Small marker flag / gnomon spike */}
      <mesh position={[0.35, 0.15 + explode * 0.2, -0.2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.3, 8]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

export function SuperCamLaserMarks3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const liftY = explode * 0.15;

  return (
    <group scale={scale} position={[0, liftY, 0]}>
      {/* Target Basalt Rock Face */}
      <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 0.45, 0.5]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.9} metalness={0.15} wireframe={wireframe} />
      </mesh>
      {/* Linear 10-Pulse Laser Ablation Pit Line */}
      {[-0.2, -0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15, 0.2].map((lx, idx) => (
        <mesh key={idx} position={[lx, 0.26, 0.252]}>
          <circleGeometry args={[0.012, 8]} />
          <meshStandardMaterial color="#09090b" roughness={0.9} wireframe={wireframe} />
        </mesh>
      ))}
    </group>
  );
}

export function JezeroDeltaFeature3D(props: ArtifactProps) {
  return <MarsLandscapeFeature3D name="Jezero Delta" {...props} />;
}
