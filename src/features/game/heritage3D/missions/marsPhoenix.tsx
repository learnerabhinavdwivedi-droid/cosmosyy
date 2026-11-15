import { useMemo } from "react";
import type { ArtifactProps } from "./shared";
import { getSolarPanelTexture, getGoldKaptonTexture } from "../textures";

/**
 * Phoenix Polar Lander Body — Vastitas Borealis, Mars (2008)
 * First spacecraft to operate in the Martian arctic permafrost.
 */
export function PhoenixLanderBody3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const legSpread = explode * 0.35;
  const ssiMastY = explode * 0.45;
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);

  return (
    <group scale={scale}>
      {/* Octagonal Equipment Deck Bus */}
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.94, 0.38, 8]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.7} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* Underside Gold Kapton Multi-Layer Insulation */}
      <mesh position={[0, 0.28, 0]} receiveShadow>
        <cylinderGeometry args={[0.92, 0.78, 0.04, 8]} />
        <meshStandardMaterial
          map={goldKaptonTex}
          color="#d97706"
          metalness={0.92}
          roughness={0.18}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3 Inverted-Tripod Landing Struts & Footpads */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={deg} rotation={[0, rad, 0]}>
            <mesh position={[0.74 + legSpread, 0.26, 0]} rotation={[0, 0, -0.65]} castShadow>
              <cylinderGeometry args={[0.024, 0.024, 0.78, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
            </mesh>
            <mesh position={[1.05 + legSpread, 0.02, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.16, 0.2, 0.035, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
            </mesh>
          </group>
        );
      })}

      {/* Pulsed Hydrazine Terminal Descent Thruster Clusters */}
      {[45, 135, 225, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={deg} position={[Math.cos(rad) * 0.72, 0.24, Math.sin(rad) * 0.72]}>
            <mesh rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.04, 0.09, 12]} />
              <meshStandardMaterial color="#334155" metalness={0.92} roughness={0.15} wireframe={wireframe} />
            </mesh>
          </group>
        );
      })}

      {/* Surface Stereo Imager (SSI) 2-Metre Periscope Mast */}
      <group position={[0.22, 0.68 + ssiMastY, 0.15]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.0, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} wireframe={wireframe} />
        </mesh>
        {/* Stereo Camera Head with Twin Optical Lenses */}
        <mesh position={[0, 1.02, 0]} castShadow>
          <boxGeometry args={[0.16, 0.08, 0.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {[-0.05, 0.05].map((x, i) => (
          <mesh key={i} position={[x, 1.02, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.02, 12]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.95} roughness={0.05} wireframe={wireframe} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Phoenix Robotic Arm & Carbide Rasp (RA)
 * Dug the "Snow White" trench and uncovered pure water ice.
 */
export function PhoenixRoboticArm3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const armExtend = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Shoulder Turret */}
      <mesh position={[-0.4, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.16, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* Carbon-Composite Arm Segments */}
      <group position={[-0.4, 0.42, 0]} rotation={[0, 0, -0.4]}>
        <mesh position={[0.35 + armExtend * 0.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.72 + armExtend, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.4} wireframe={wireframe} />
        </mesh>

        {/* Elbow Joint */}
        <mesh position={[0.72 + armExtend, 0, 0]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>

        {/* Forearm & Titanium Scoop */}
        <group position={[0.72 + armExtend, 0, 0]} rotation={[0, 0, 0.9]}>
          <mesh position={[0.25, 0, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.52, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.4} wireframe={wireframe} />
          </mesh>
          <mesh position={[0.52, 0, 0]} castShadow>
            <boxGeometry args={[0.14, 0.08, 0.1]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.25} wireframe={wireframe} />
          </mesh>
          {/* Tungsten-Carbide Motorized Rasp Wheel */}
          <mesh position={[0.58, -0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.08, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.1} wireframe={wireframe} />
          </mesh>
        </group>
      </group>

      {/* Excavated "Snow White" Trench exposing pure white Water Ice */}
      <group position={[0.4, 0.01, 0.2]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.9, 0.28]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.95} wireframe={wireframe} />
        </mesh>
        {/* Subsurface Water Ice Sheet */}
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.65, 0.16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.1} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Phoenix TEGA Thermal Gas Analyzer (8 Miniature Ovens)
 */
export function PhoenixTEGA3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const doorLift = explode * 0.25;

  return (
    <group scale={scale}>
      {/* Housing Frame */}
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.24, 0.36]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Bank of 8 Miniature Vacuum Ovens in 2 Rows */}
      {[-0.15, -0.05, 0.05, 0.15].map((x, col) =>
        [-0.08, 0.08].map((z, row) => (
          <group key={`${col}-${row}`} position={[x, 0.26, z]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.028, 0.028, 0.06, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.92} roughness={0.15} wireframe={wireframe} />
            </mesh>
            {/* Motorized Hinged Cover Door */}
            <mesh position={[0, 0.04 + doorLift, 0]}>
              <boxGeometry args={[0.065, 0.012, 0.065]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
}

/**
 * Phoenix MECA Wet Chemistry Laboratory & AFM
 */
export function PhoenixMECA3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const topY = explode * 0.3;

  return (
    <group scale={scale}>
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.44, 0.28, 0.38]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>
      {/* 4 Wet Chemistry Cell Beaker Ports */}
      {[-0.1, 0.1].map((x, i) =>
        [-0.08, 0.08].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.31 + topY, z]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.04, 16]} />
            <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.2} wireframe={wireframe} />
          </mesh>
        ))
      )}
    </group>
  );
}

/**
 * Phoenix Dual Decagonal Bio-Solar Arrays
 */
export function PhoenixSolarWings3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const wingSpread = explode * 0.45;
  const solarTex = useMemo(() => getSolarPanelTexture(), []);

  return (
    <group scale={scale}>
      {[-1.2 - wingSpread, 1.2 + wingSpread].map((x, idx) => (
        <group key={idx} position={[x, 0.4, 0]}>
          {/* Decagonal 10-Sided Solar Array Disc */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.95, 0.95, 0.015, 10]} />
            <meshStandardMaterial
              map={solarTex}
              color="#1e3a8a"
              metalness={0.88}
              roughness={0.22}
              wireframe={wireframe}
            />
          </mesh>
          {/* Central Hub & Deployment Springs */}
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Phoenix Weather Station & Laser Lidar
 * Fired green laser beams into arctic cirrus clouds to detect snowfall.
 */
export function PhoenixLidarStation3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const mastY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Canadian Space Agency Meteorological Mast */}
      <mesh position={[0, 0.65 + mastY * 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Laser Lidar Optics Housing */}
      <mesh position={[0, 1.28 + mastY, 0]} castShadow>
        <boxGeometry args={[0.14, 0.18, 0.12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Upward Green Neodymium-YAG Laser Beam into Cirrus Clouds */}
      <mesh position={[0, 2.8 + mastY, 0]}>
        <cylinderGeometry args={[0.006, 0.012, 3.0, 8]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.75} wireframe={wireframe} />
      </mesh>
    </group>
  );
}
