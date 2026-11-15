import { useMemo } from "react";
import * as THREE from "three";
import type { ArtifactProps } from "./shared";
import { getGoldKaptonTexture } from "../textures";

/**
 * Viking 1 Lander Body — Chryse Planitia, Mars (1976)
 * First spacecraft to successfully operate on the Martian surface.
 */
export function VikingLanderBody3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const legSpread = explode * 0.35;
  const rtgSpread = explode * 0.3;
  const antennaY = explode * 0.4;
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);

  return (
    <group scale={scale}>
      {/* Hexagonal Titanium Main Equipment Bus */}
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.88, 0.98, 0.46, 6]} />
        <meshStandardMaterial
          color="#f1f5f9"
          metalness={0.7}
          roughness={0.3}
          wireframe={wireframe}
        />
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
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.9}
                roughness={0.2}
                wireframe={wireframe}
              />
            </mesh>
            {/* Diagonal Stabilizer Tension Strut */}
            <mesh position={[0.55 + legSpread * 0.6, 0.38, 0]} rotation={[0, 0, -0.28]}>
              <cylinderGeometry args={[0.016, 0.016, 0.52, 8]} />
              <meshStandardMaterial
                color="#94a3b8"
                metalness={0.85}
                roughness={0.25}
                wireframe={wireframe}
              />
            </mesh>
            {/* 12-inch Circular Dished Footpad */}
            <mesh position={[1.12 + legSpread, 0.02, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.22, 0.04, 20]} />
              <meshStandardMaterial
                color="#64748b"
                metalness={0.8}
                roughness={0.3}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        );
      })}

      {/* Two SNAP-19 Radioisotope Thermoelectric Generators (RTGs) in Cylindrical Wind Covers */}
      {[-0.82 - rtgSpread, 0.82 + rtgSpread].map((x, idx) => (
        <group key={idx} position={[x, 0.62, 0]}>
          {/* Cylindrical Beryllium Aerodynamic Heat Shield Cover */}
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.32, 16]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.88}
              roughness={0.22}
              wireframe={wireframe}
            />
          </mesh>
          {/* Vertical Heat Dissipation Radiator Fins */}
          {[0, 45, 90, 135].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <mesh key={deg} rotation={[0, rad, 0]}>
                <boxGeometry args={[0.42, 0.28, 0.01]} />
                <meshStandardMaterial
                  color="#475569"
                  metalness={0.9}
                  roughness={0.2}
                  wireframe={wireframe}
                />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* S-Band High-Gain Parabolic Dish Antenna */}
      <group position={[0, 0.82 + antennaY, -0.22]} rotation={[0.45, 0.2, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.38, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.6}
            roughness={0.3}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.008, 0.014, 0.24, 8]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Low-Gain Omni Antenna Mast */}
      <mesh position={[0.35, 0.95, 0.25]} castShadow>
        <cylinderGeometry args={[0.008, 0.012, 0.55, 8]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.9}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Dual Martin Marietta Facsimile Cameras on White Pylons */}
      {[-0.26, 0.26].map((x, i) => (
        <group key={i} position={[x, 0.84, 0.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.055, 0.065, 0.32, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.6}
              roughness={0.3}
              wireframe={wireframe}
            />
          </mesh>
          {/* Vertical Optical Scanning Window */}
          <mesh position={[0, 0.08, 0.045]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.025, 0.1, 0.01]} />
            <meshStandardMaterial color="#0284c7" roughness={0.05} metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Color & Metric Calibration Target on Top Deck */}
      <group position={[-0.2, 0.76, -0.1]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <mesh>
          <planeGeometry args={[0.12, 0.08]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <cylinderGeometry args={[0.004, 0.004, 0.04, 8]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Dual Terminal Descent Aerojet Rocket Engines (three 600-lbf engines) */}
      {[-0.38, 0.38].map((x, idx) => (
        <group key={idx} position={[x, 0.22 - explode * 0.2, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.09, 0.18, 0.22, 16]} />
            <meshStandardMaterial
              color="#1e222a"
              metalness={0.92}
              roughness={0.2}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Viking 1 Surface Sampler Arm & Backhoe Collector Head
 * Dug the first trenches in Martian soil to search for biosignatures.
 */
export function VikingSamplerArm3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const boomLen = 0.95 + explode * 0.45;
  const scoopTilt = 0.35 + explode * 0.2;

  return (
    <group scale={scale}>
      {/* Shoulder Gimbal Drive Housing on Lander Deck */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.18, 0.16, 0.2]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.88}
          roughness={0.22}
          wireframe={wireframe}
        />
      </mesh>

      {/* Extendable Triangular Lattice Tubular Boom */}
      <mesh position={[0, 0.28, boomLen * 0.5]} rotation={[0.26, 0, 0]} castShadow>
        <cylinderGeometry args={[0.016, 0.022, boomLen, 8]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.9}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Wrist Joint Actuator */}
      <group position={[0, 0.28 - boomLen * 0.14, boomLen]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.08, 12]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>

        {/* Motorized Backhoe Soil Scoop & Organic Sieve Chamber */}
        <group position={[0, -0.06, 0.06]} rotation={[scoopTilt, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.11, 0.18]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.85}
              roughness={0.25}
              wireframe={wireframe}
            />
          </mesh>
          {/* Soil Excavation Cutting Teeth */}
          <mesh position={[0, -0.07, 0.09]} rotation={[0.42, 0, 0]}>
            <boxGeometry args={[0.13, 0.025, 0.07]} />
            <meshStandardMaterial
              color="#94a3b8"
              metalness={0.95}
              roughness={0.15}
              wireframe={wireframe}
            />
          </mesh>
          {/* Fine Sieve Mesh Screen for Biology / GCMS Sample Distribution */}
          <mesh position={[0, 0.06, 0]}>
            <planeGeometry args={[0.12, 0.14]} />
            <meshStandardMaterial
              color="#64748b"
              metalness={0.8}
              roughness={0.3}
              wireframe={true}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * Viking 1 Meteorology Boom
 * Monitored Martian winds, temperature and atmospheric pressure for over 6 years.
 */
export function VikingMeteorology3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const mastY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Base Deployment Hinge and Pylon */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.12, 0.18, 0.14]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.85}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>

      {/* Vertical Deployable Sensor Mast */}
      <mesh position={[0, 0.58 + mastY * 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.018, 1.1 + mastY, 12]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.92}
          roughness={0.18}
          wireframe={wireframe}
        />
      </mesh>

      {/* Meteorology Sensor Head (Wind & Temp Array) */}
      <group position={[0, 1.18 + mastY, 0]}>
        <mesh>
          <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.85}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
        {/* Hot-film Anemometer Probe */}
        <mesh position={[0.07, 0, 0]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={0.95}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
        {/* Thermocouple Reference Rings */}
        {[-0.04, 0.04].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]}>
            <torusGeometry args={[0.05, 0.005, 8, 16]} />
            <meshStandardMaterial
              color="#94a3b8"
              metalness={0.9}
              roughness={0.2}
              wireframe={wireframe}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Viking 1 Facsimile Scanning Cameras
 * Transmitted the very first photograph from the Martian surface.
 */
export function VikingFacsimileCameras3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const spread = explode * 0.3;

  return (
    <group scale={scale}>
      {/* Camera 1 */}
      <group position={[-0.2 - spread, 0.38, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.065, 0.075, 0.48, 16]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.7}
            roughness={0.3}
            wireframe={wireframe}
          />
        </mesh>
        {/* Quartz Scanning Window */}
        <mesh position={[0, 0.16, 0.048]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.05}
            metalness={0.95}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Camera 2 */}
      <group position={[0.2 + spread, 0.38, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.065, 0.075, 0.48, 16]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.7}
            roughness={0.3}
            wireframe={wireframe}
          />
        </mesh>
        {/* Quartz Scanning Window */}
        <mesh position={[0, 0.16, 0.048]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.05}
            metalness={0.95}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Viking 1 High-Gain Parabolic S-Band Antenna
 */
export function VikingAntenna3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const dishY = explode * 0.4;

  return (
    <group scale={scale}>
      {/* 2-Axis Articulated Gimbal Stand */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.048, 0.44, 16]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.85}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>

      {/* Parabolic Reflector Dish */}
      <group position={[0, 0.58 + dishY, 0]} rotation={[0.5, 0.3, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.65}
            roughness={0.28}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
        {/* Feed Horn Strut & Sub-reflector */}
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.008, 0.016, 0.34, 8]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <coneGeometry args={[0.035, 0.06, 12]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={0.92}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Viking 1 Seismometer (mounted on lander top deck)
 */
export function VikingSeismometer3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const capY = explode * 0.3;

  return (
    <group scale={scale}>
      {/* Shock-isolation Mount Platform */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.26, 0.28, 0.06, 16]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.85}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>

      {/* Thermal Cannister Base Drum */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.28, 20]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.88}
          roughness={0.22}
          wireframe={wireframe}
        />
      </mesh>

      {/* Gold MLI Thermal Dome Cap */}
      <mesh position={[0, 0.36 + capY, 0]}>
        <sphereGeometry args={[0.21, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#e5b842"
          metalness={0.92}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}
