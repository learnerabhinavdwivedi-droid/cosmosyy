import { useMemo } from "react";
import type { ArtifactProps } from "./shared";
import { getSolarPanelTexture, getGoldKaptonTexture } from "../textures";

/**
 * InSight Mars Lander Body — Elysium Planitia, Mars (2018)
 * First geophysics station on Mars, mapped the crust, mantle, and liquid core.
 */
export function InSightLanderBody3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const legSpread = explode * 0.35;
  const antennaY = explode * 0.4;
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);

  return (
    <group scale={scale}>
      {/* Hexagonal Equipment Bus with Elysium Dust Weathering */}
      <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.92, 0.36, 6]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.7} roughness={0.32} wireframe={wireframe} />
      </mesh>

      {/* Underside Gold Kapton Multi-Layer Insulation Thermal Skirt */}
      <mesh position={[0, 0.26, 0]} receiveShadow>
        <cylinderGeometry args={[0.92, 0.76, 0.04, 6]} />
        <meshStandardMaterial
          map={goldKaptonTex}
          color="#d97706"
          metalness={0.92}
          roughness={0.18}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3 Landing Legs with Shock Absorber Cylinders */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={deg} rotation={[0, rad, 0]}>
            <mesh position={[0.74 + legSpread, 0.26, 0]} rotation={[0, 0, -0.66]} castShadow>
              <cylinderGeometry args={[0.024, 0.024, 0.78, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
            </mesh>
            <mesh position={[1.06 + legSpread, 0.02, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.16, 0.2, 0.035, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
            </mesh>
          </group>
        );
      })}

      {/* Twin RISE Radio Science X-Band Horn Antennas */}
      {[-0.32, 0.32].map((x, i) => (
        <group key={i} position={[x, 0.68 + antennaY, -0.3]} rotation={[0.4, 0, 0]}>
          <mesh castShadow>
            <coneGeometry args={[0.08, 0.16, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.85} roughness={0.2} wireframe={wireframe} />
          </mesh>
        </group>
      ))}

      {/* UHF Cylindrical Helical Antenna for Mars Reconnaissance Orbiter Relay */}
      <mesh position={[0, 0.85 + antennaY, 0.28]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.45, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * InSight SEIS Seismometer under Golden Wind and Thermal Shield (WTS) Dome
 * Recorded 1,319+ marsquakes on Elysium Planitia.
 */
export function InSightSEIS3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const domeLift = explode * 0.4;
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);

  return (
    <group scale={scale}>
      {/* Internal Three-Axis Evacuated Spherical Vacuum Sensor */}
      <group position={[0, 0.14, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.15, 20, 16]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.95} roughness={0.1} wireframe={wireframe} />
        </mesh>
        {/* Three Leveling Feet planted in soil */}
        {[30, 150, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh key={deg} position={[Math.cos(rad) * 0.18, -0.1, Math.sin(rad) * 0.18]}>
              <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} wireframe={wireframe} />
            </mesh>
          );
        })}
      </group>

      {/* Aerodynamic Wind and Thermal Shield (WTS) Golden Dome */}
      <group position={[0, 0.18 + domeLift, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.34, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
          <meshStandardMaterial
            map={goldKaptonTex}
            color="#fbbf24"
            metalness={0.92}
            roughness={0.16}
            wireframe={wireframe}
          />
        </mesh>
        {/* Top Grapple Pin for IDA Robot Arm */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} wireframe={wireframe} />
        </mesh>
        {/* Thermal Perimeter Chain Mail Skirt resting on soil */}
        <mesh position={[0, -0.02, 0]}>
          <torusGeometry args={[0.34, 0.022, 12, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Flexible Ribbon Tether Cable running back toward lander */}
      <mesh position={[-0.32, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.6, 8]} />
        <meshStandardMaterial color="#ea580c" roughness={0.8} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * InSight HP³ Heat Flow and Physical Properties Package ("The Mole")
 */
export function InSightHP3Mole3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const moleExtract = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Surface Support Structure Housing (SSA) */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.42, 0.26]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.82} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Trailing Science Tether with 14 Temperature Sensors */}
      <mesh position={[0, 0.02, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.5, 8]} />
        <meshStandardMaterial color="#f97316" roughness={0.6} wireframe={wireframe} />
      </mesh>

      {/* 40-cm Self-Hammering Tungsten Mole Penetrator entering Duricrust */}
      <group position={[0.22, 0.08 - moleExtract, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.38, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.15} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <coneGeometry args={[0.028, 0.08, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.98} roughness={0.1} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * InSight Twin 2.15-Meter UltraFlex Circular Solar Arrays
 * High-efficiency fan-fold arrays that powered InSight for 1,445 sols.
 */
export function InSightUltraFlexArrays3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const wingSpread = explode * 0.5;
  const solarTex = useMemo(() => getSolarPanelTexture(), []);

  return (
    <group scale={scale}>
      {[-1.35 - wingSpread, 1.35 + wingSpread].map((x, idx) => (
        <group key={idx} position={[x, 0.42, 0]}>
          {/* Circular UltraFlex Array with Martian Dust Coating */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.05, 1.05, 0.015, 32]} />
            <meshStandardMaterial
              map={solarTex}
              color="#9a3412"
              metalness={0.78}
              roughness={0.45}
              wireframe={wireframe}
            />
          </mesh>
          {/* Radial Carbon Composite Structural Ribs */}
          {[0, 30, 60, 90, 120, 150].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <mesh key={deg} rotation={[0, rad, 0]}>
                <boxGeometry args={[2.08, 0.018, 0.012]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
              </mesh>
            );
          })}
          {/* Central Motorized Deployment Gimbal */}
          <mesh>
            <cylinderGeometry args={[0.09, 0.09, 0.05, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * InSight Instrument Deployment Arm (IDA) & Grapple
 */
export function InSightIDCArm3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const armExtend = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Shoulder Joint Turret */}
      <mesh position={[-0.35, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.085, 0.16, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Upper Arm Segment */}
      <group position={[-0.35, 0.42, 0]} rotation={[0, 0, -0.45]}>
        <mesh position={[0.32 + armExtend * 0.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.68 + armExtend, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Elbow Joint */}
        <mesh position={[0.68 + armExtend, 0, 0]}>
          <sphereGeometry args={[0.042, 12, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>

        {/* Forearm & Grapple Claw with IDC Camera */}
        <group position={[0.68 + armExtend, 0, 0]} rotation={[0, 0, 0.85]}>
          <mesh position={[0.26, 0, 0]} castShadow>
            <cylinderGeometry args={[0.024, 0.024, 0.54, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} wireframe={wireframe} />
          </mesh>
          {/* IDC Deployment Camera */}
          <mesh position={[0.38, 0.05, 0]}>
            <boxGeometry args={[0.08, 0.06, 0.06]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} wireframe={wireframe} />
          </mesh>
          {/* Five-Pronged Wax-Actuated Grapple Claw */}
          <group position={[0.54, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.035, 0.04, 0.06, 12]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} wireframe={wireframe} />
            </mesh>
            {[0, 72, 144, 216, 288].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <mesh key={deg} position={[0.03, Math.sin(rad) * 0.035, Math.cos(rad) * 0.035]} rotation={[0, 0, -0.4]}>
                  <cylinderGeometry args={[0.005, 0.005, 0.05, 6]} />
                  <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} wireframe={wireframe} />
                </mesh>
              );
            })}
          </group>
        </group>
      </group>
    </group>
  );
}

/**
 * InSight TWINS Temperature & Wind Sensor Booms
 */
export function InSightTWINS3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const boomSpread = explode * 0.3;

  return (
    <group scale={scale}>
      {[-0.4 - boomSpread, 0.4 + boomSpread].map((x, i) => (
        <group key={i} position={[x, 0.5, 0]} rotation={[0, 0, i === 0 ? 0.35 : -0.35]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} wireframe={wireframe} />
          </mesh>
          <mesh position={[0, 0.52, 0]} castShadow>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} wireframe={wireframe} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
