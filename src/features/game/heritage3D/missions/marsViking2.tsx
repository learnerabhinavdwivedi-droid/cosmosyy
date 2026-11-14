import { useMemo } from "react";
import * as THREE from "three";
import type { ArtifactProps } from "./shared";
import { getGoldKaptonTexture } from "../textures";

/**
 * Viking 2 Lander Body — Utopia Planitia, Mars (1976)
 * Twin lander to Viking 1, touched down on the northern plains of Utopia Planitia.
 */
export function Viking2LanderBody3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const legSpread = explode * 0.35;
  const rtgSpread = explode * 0.3;
  const antennaY = explode * 0.4;
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);

  return (
    <group scale={scale}>
      {/* Hexagonal Titanium Main Equipment Bus with Utopia Planitia frost-dusted white finish */}
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.88, 0.98, 0.46, 6]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.72} roughness={0.28} wireframe={wireframe} />
      </mesh>

      {/* Underside Multi-Layer Gold Kapton MLI Thermal Blanket */}
      <mesh position={[0, 0.28, 0]} receiveShadow>
        <cylinderGeometry args={[0.96, 0.85, 0.04, 6]} />
        <meshStandardMaterial
          map={goldKaptonTex}
          color="#d97706"
          metalness={0.92}
          roughness={0.18}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3 Outrigger Landing Legs with Inverted Tripod Struts & Dished Footpads */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={deg} rotation={[0, rad, 0]}>
            {/* Primary Telescoping Shock Strut */}
            <mesh position={[0.78 + legSpread, 0.28, 0]} rotation={[0, 0, -0.68]} castShadow>
              <cylinderGeometry args={[0.028, 0.028, 0.82, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
            </mesh>
            {/* Diagonal Stabilizer Tension Strut */}
            <mesh position={[0.55 + legSpread * 0.6, 0.38, 0]} rotation={[0, 0, -0.28]}>
              <cylinderGeometry args={[0.016, 0.016, 0.52, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} wireframe={wireframe} />
            </mesh>
            {/* 12-inch Circular Dished Footpad */}
            <mesh position={[1.12 + legSpread, 0.02, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.22, 0.04, 20]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
            </mesh>
          </group>
        );
      })}

      {/* Two SNAP-19 Radioisotope Thermoelectric Generators (RTGs) in Cylindrical Wind Covers */}
      {[-0.82 - rtgSpread, 0.82 + rtgSpread].map((x, idx) => (
        <group key={idx} position={[x, 0.62, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.32, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.88} roughness={0.22} wireframe={wireframe} />
          </mesh>
          {[0, 45, 90, 135].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <mesh key={deg} rotation={[0, rad, 0]}>
                <boxGeometry args={[0.42, 0.28, 0.01]} />
                <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} wireframe={wireframe} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* S-Band High-Gain Parabolic Dish Antenna */}
      <group position={[0, 0.82 + antennaY, -0.22]} rotation={[0.45, 0.2, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.38, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
          <meshStandardMaterial color="#ffffff" metalness={0.65} roughness={0.25} side={THREE.DoubleSide} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.008, 0.014, 0.24, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Low-Gain Omni Antenna Mast */}
      <mesh position={[0.35, 0.95, 0.25]} castShadow>
        <cylinderGeometry args={[0.008, 0.012, 0.55, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * Viking 2 Robotic Soil Sampler with "Mr. Badger" Boulder
 */
export function Viking2SamplerArm3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const armExtend = explode * 0.4;

  return (
    <group scale={scale}>
      {/* Swivel Shoulder Turret Housing */}
      <mesh position={[-0.45, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.22, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* Primary Extendable Boom */}
      <group position={[-0.45, 0.48, 0]} rotation={[0, 0, -0.35]}>
        <mesh position={[0.45 + armExtend * 0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.95 + armExtend, 0.065, 0.065]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} wireframe={wireframe} />
        </mesh>

        {/* Articulated Wrist Joint */}
        <mesh position={[0.95 + armExtend, 0, 0]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>

        {/* Backhoe Soil Collector Scoop */}
        <group position={[1.05 + armExtend, -0.04, 0]} rotation={[0, 0, 0.8]}>
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.08, 0.12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.25} wireframe={wireframe} />
          </mesh>
          {/* Sieve Teeth */}
          {[-0.04, 0, 0.04].map((z, idx) => (
            <mesh key={idx} position={[0.09, -0.02, z]}>
              <coneGeometry args={[0.012, 0.04, 4]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} wireframe={wireframe} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Famous "Mr. Badger" Basalt Rock Nudged by Viking 2 */}
      <mesh position={[0.95, 0.14, 0.1]} rotation={[0.2, 0.6, 0.1]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial color="#473a36" roughness={0.95} metalness={0.05} wireframe={wireframe} />
      </mesh>

      {/* Trench Cut in Regolith */}
      <mesh position={[0.4, 0.01, 0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.8, 0.15]} />
        <meshStandardMaterial color="#301f18" roughness={0.98} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * Viking 2 Surface Seismometer
 * The only functional seismometer during the Viking missions, recorded marsquake tremors.
 */
export function Viking2Seismometer3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const domeY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Base Mounting Ring on Lander Body */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.08, 24]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Internal Three-Axis Inertial Sensor Package */}
      <group position={[0, 0.18, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.18, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} wireframe={wireframe} />
        </mesh>
        {/* Unlocked Suspension Flexures */}
        {[0, 120, 240].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh key={deg} position={[Math.cos(rad) * 0.15, 0, Math.sin(rad) * 0.15]}>
              <cylinderGeometry args={[0.008, 0.008, 0.16, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
            </mesh>
          );
        })}
      </group>

      {/* Protective Anodized Environmental Cover Dome */}
      <mesh position={[0, 0.32 + domeY, 0]} castShadow>
        <sphereGeometry args={[0.24, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.3} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * Viking 2 Meteorology Sensor Mast
 */
export function Viking2Meteorology3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const mastY = explode * 0.3;

  return (
    <group scale={scale}>
      {/* Base Flange */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.08, 0.11, 0.08, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* Vertical Sensor Mast (1.3m tall) */}
      <mesh position={[0, 0.65 + mastY * 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Hot-Film Wind Sensor Boom */}
      <group position={[0, 1.25 + mastY, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.28, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Platinum Temperature Sensor Ring */}
        <mesh position={[0.14, 0, 0]}>
          <torusGeometry args={[0.025, 0.004, 8, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} wireframe={wireframe} />
        </mesh>
        <mesh position={[-0.14, 0, 0]}>
          <torusGeometry args={[0.025, 0.004, 8, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Viking 2 Dual Facsimile Cameras
 */
export function Viking2FacsimileCameras3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const cameraSpread = explode * 0.35;

  return (
    <group scale={scale}>
      {[-0.32 - cameraSpread, 0.32 + cameraSpread].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Base Pylon Support */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.075, 0.7, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.75} roughness={0.28} wireframe={wireframe} />
          </mesh>
          {/* Nodding Mirror Camera Head */}
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.22, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.88} roughness={0.22} wireframe={wireframe} />
          </mesh>
          {/* Quartz Window & Optical Sensor Aperture */}
          <mesh position={[0, 0.75, 0.078]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.035, 0.12, 0.015]} />
            <meshStandardMaterial color="#0ea5e9" metalness={0.95} roughness={0.05} wireframe={wireframe} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Viking 2 GCMS Soil Inlet & Oven Chamber
 */
export function Viking2GCMSInlet3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const lidY = explode * 0.3;

  return (
    <group scale={scale}>
      {/* Deck Integration Housing */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.24, 0.38]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.82} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Soil Collection Funnel */}
      <mesh position={[0, 0.28, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.15, 0.12, 20]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} wireframe={wireframe} />
      </mesh>

      {/* Motorized Protective Sieve Cover */}
      <mesh position={[0, 0.36 + lidY, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.88} roughness={0.22} wireframe={wireframe} />
      </mesh>
    </group>
  );
}
