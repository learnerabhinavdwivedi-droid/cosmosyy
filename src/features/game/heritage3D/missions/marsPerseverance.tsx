import { useMemo } from "react";
import type { ArtifactProps } from "./shared";
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

export function PerseveranceRover3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const mastY = explode * 0.45;
  const armX = -explode * 0.4;
  const wheelSpread = explode * 0.25;

  const wheels: [number, number, number][] = [
    [-0.85 - wheelSpread, 0.25, 0.75 + wheelSpread],
    [0.0, 0.25, 0.85 + wheelSpread],
    [0.85 + wheelSpread, 0.25, 0.75 + wheelSpread],
    [-0.85 - wheelSpread, 0.25, -0.75 - wheelSpread],
    [0.0, 0.25, -0.85 - wheelSpread],
    [0.85 + wheelSpread, 0.25, -0.75 - wheelSpread],
  ];

  return (
    <group scale={scale}>
      {/* 1. Main Chassis (Mars 2020 Warm Electronics Box) */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.45, 1.05]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.4}
          metalness={0.7}
          wireframe={wireframe}
        />
      </mesh>
      {/* Top Deck Gold & Titanium Equipment Cover */}
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[1.5, 0.03, 0.98]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* MOXIE Oxygen Generation Vent on Right Flank */}
      <mesh position={[0.2, 0.58, 0.53]}>
        <boxGeometry args={[0.25, 0.14, 0.04]} />
        <meshStandardMaterial color="#d97706" metalness={0.88} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* 2. Rocker-Bogie Suspension */}
      <group position={[0, 0.42, 0]}>
        <mesh position={[0, 0, 0.58]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[1.7, 0.06, 0.06]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0, -0.58]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[1.7, 0.06, 0.06]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>

      {/* 3. Six Upgraded Curved-Cleat Aluminum Wheels */}
      {wheels.map(([wx, wy, wz], idx) => (
        <group key={idx} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.22, 18]} />
            <meshStandardMaterial
              color="#475569"
              metalness={0.94}
              roughness={0.18}
              wireframe={wireframe}
            />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.24, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.15} wireframe={wireframe} />
          </mesh>
          {/* Distinctive Curved Traction Ribs */}
          <mesh position={[0, 0.05, 0]}>
            <torusGeometry args={[0.258, 0.015, 8, 18]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.2} wireframe={wireframe} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <torusGeometry args={[0.258, 0.015, 8, 18]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.2} wireframe={wireframe} />
          </mesh>
        </group>
      ))}

      {/* 4. SuperCam Mast & Mastcam-Z Zoom Stereo Eyes */}
      <group position={[0.55, 0.78 + mastY, 0.32]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.035, 1.1, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* MEDA Wind Sensor 1 & 2 Booms */}
        <mesh position={[0, 0.85, 0.12]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.24, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.95, -0.12]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.24, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} wireframe={wireframe} />
        </mesh>
        {/* SuperCam Instrument Head Housing */}
        <group position={[0, 1.15, 0]} castShadow>
          <mesh>
            <boxGeometry args={[0.24, 0.2, 0.26]} />
            <meshStandardMaterial color="#0f172a" metalness={0.88} roughness={0.2} wireframe={wireframe} />
          </mesh>
          {/* SuperCam Large Circular Laser Aperture */}
          <mesh position={[0.125, 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.03, 16]} />
            <meshStandardMaterial color="#0284c7" metalness={0.96} roughness={0.08} wireframe={wireframe} />
          </mesh>
          {/* Mastcam-Z Dual Zoom Telephoto Lenses */}
          <mesh position={[0.125, -0.06, 0.08]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.035, 12]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} wireframe={wireframe} />
          </mesh>
          <mesh position={[0.125, -0.06, -0.08]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.035, 12]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} wireframe={wireframe} />
          </mesh>
        </group>
      </group>

      {/* 5. Rear MMRTG with 8 Radiator Fins */}
      <group position={[-0.88, 0.72 + explode * 0.3, 0]} rotation={[0, 0, -0.45]} castShadow>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.55, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.88} roughness={0.28} wireframe={wireframe} />
        </mesh>
        {[0, 45, 90, 135].map((deg) => (
          <mesh key={deg} rotation={[0, (deg * Math.PI) / 180, 0]}>
            <boxGeometry args={[0.42, 0.5, 0.015]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.35} wireframe={wireframe} />
          </mesh>
        ))}
      </group>

      {/* 6. Heavy Robotic Coring Arm with SHERLOC & PIXL Turret */}
      <group position={[0.78 + armX, 0.55, -0.28]}>
        <mesh castShadow>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.92} roughness={0.18} wireframe={wireframe} />
        </mesh>
        <mesh position={[0.25, -0.05, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.03, 0.03, 0.55, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.22} wireframe={wireframe} />
        </mesh>
        <mesh position={[0.55, -0.22, 0.1]} rotation={[0, 0.4, -0.5]}>
          <cylinderGeometry args={[0.026, 0.026, 0.52, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.22} wireframe={wireframe} />
        </mesh>
        {/* 45kg Heavy Coring & Sensor Turret */}
        <group position={[0.78, -0.35, 0.22]} castShadow>
          <mesh>
            <cylinderGeometry args={[0.16, 0.16, 0.32, 12]} />
            <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.18} wireframe={wireframe} />
          </mesh>
          {/* Rotary Percussive Coring Bit Tube */}
          <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 0.28, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.1} wireframe={wireframe} />
          </mesh>
          {/* SHERLOC UV Raman Green Laser Sensor */}
          <mesh position={[0, -0.165, 0.06]}>
            <circleGeometry args={[0.04, 12]} />
            <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.6} metalness={0.8} />
          </mesh>
          {/* PIXL Micro-Focus X-Ray Sensor */}
          <mesh position={[0, -0.165, -0.06]}>
            <circleGeometry args={[0.04, 12]} />
            <meshStandardMaterial color="#6366f1" emissive="#4f46e5" emissiveIntensity={0.5} metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* 7. Steerable High-Gain Hexagonal Dish Antenna */}
      <group position={[-0.45, 0.85 + explode * 0.25, 0.35]} rotation={[0.4, 0.3, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 6]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.92} roughness={0.18} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.008, 0.012, 0.18, 8]} />
          <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.15} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

export function JezeroDeltaFeature3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const lift = explode * 0.2;

  return (
    <group scale={scale} position={[0, lift, 0]}>
      {/* 1. Jezero Crater Ancient Mudstone Basin Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.1, 1.8]} />
        <meshStandardMaterial color="#451a03" roughness={0.96} metalness={0.04} wireframe={wireframe} />
      </mesh>

      {/* 2. Lower Delta Fan Sandstone Scarp (Hawksbill Gap Strata) */}
      <group position={[-0.15, 0.22, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.24, 1.35]} />
          <meshStandardMaterial color="#92400e" roughness={0.92} metalness={0.06} wireframe={wireframe} />
        </mesh>
        {/* Layered Cross-Bedding Sandstone Bench */}
        <mesh position={[0.2, 0.09, 0.3]} castShadow>
          <boxGeometry args={[1.25, 0.08, 0.55]} />
          <meshStandardMaterial color="#b45309" roughness={0.94} metalness={0.05} wireframe={wireframe} />
        </mesh>
      </group>

      {/* 3. Kodiak Butte Layered Delta Remnant Promontory */}
      <group position={[-0.25, 0.5, -0.15]}>
        <mesh rotation={[0, 0.1, -0.05]} castShadow receiveShadow>
          <boxGeometry args={[1.15, 0.28, 0.85]} />
          <meshStandardMaterial color="#78350f" roughness={0.88} metalness={0.08} wireframe={wireframe} />
        </mesh>
        {/* Top Flat Capping Rock Ledge */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.95, 0.05, 0.7]} />
          <meshStandardMaterial color="#a16207" roughness={0.85} metalness={0.12} wireframe={wireframe} />
        </mesh>
      </group>

      {/* 4. Sinuous Neretva Vallis River Channel Cut */}
      <group position={[0.32, 0.12, 0.05]} rotation={[0, 0.45, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.38, 0.06, 1.6]} />
          <meshStandardMaterial color="#271810" roughness={0.98} wireframe={wireframe} />
        </mesh>
        {/* Clay & Carbonate Deposit Streaks on Channel Bank */}
        <mesh position={[0.15, 0.035, 0]}>
          <planeGeometry args={[0.08, 1.4]} />
          <meshStandardMaterial color="#4ade80" roughness={0.7} metalness={0.1} wireframe={wireframe} />
        </mesh>
      </group>

      {/* River-Transported Rounded Conglomerate Cobbles & Boulders */}
      {([
        [-0.45, 0.68, 0.15],
        [0.12, 0.38, 0.45],
        [0.38, 0.16, -0.4],
        [-0.65, 0.36, -0.4],
        [0.22, 0.15, 0.65],
      ] as const).map(([bx, by, bz], idx) => (
        <mesh key={idx} position={[bx, by, bz]} rotation={[idx * 0.5, idx * 0.3, 0]} castShadow>
          <dodecahedronGeometry args={[0.07 + (idx % 3) * 0.03, 0]} />
          <meshStandardMaterial color="#57534e" roughness={0.88} metalness={0.15} wireframe={wireframe} />
        </mesh>
      ))}
    </group>
  );
}
