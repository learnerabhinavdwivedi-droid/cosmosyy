import { useMemo } from "react";
import * as THREE from "three";
import type { ArtifactProps } from "./shared";
import { getGoldKaptonTexture, getSolarPanelTexture } from "../textures";

// ============================================================================
// DAWN MISSION (Ceres Dwarf Planet)
// ============================================================================

/**
 * Dawn Spacecraft 3D Model
 * Main octagonal bus, 1.5m parabolic antenna dish, and twin 8-meter solar wings.
 */
export function DawnSpacecraft3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const solarTex = useMemo(() => getSolarPanelTexture(), []);
  const wingExplode = explode * 0.45;
  const dishExplode = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Central Equipment Bus */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.9, 1.1]} />
        <meshStandardMaterial
          map={goldKaptonTex}
          color="#d97706"
          metalness={0.88}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>

      {/* High-Gain Antenna Dish */}
      <group position={[0, 0.75 + dishExplode, 0.2]} rotation={[-0.35, 0, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.32]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.3}
            roughness={0.4}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.32, 8]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <coneGeometry args={[0.045, 0.08, 12]} />
          <meshStandardMaterial
            color="#38bdf8"
            metalness={0.8}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Port Solar Wing */}
      <group position={[-1.45 - wingExplode, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.02, 0.65]} />
          <meshStandardMaterial
            map={solarTex}
            color="#1e1b4b"
            metalness={0.6}
            roughness={0.3}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0.95, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.25, 8]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.8}
            roughness={0.3}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Starboard Solar Wing */}
      <group position={[1.45 + wingExplode, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.02, 0.65]} />
          <meshStandardMaterial
            map={solarTex}
            color="#1e1b4b"
            metalness={0.6}
            roughness={0.3}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[-0.95, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.25, 8]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.8}
            roughness={0.3}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Aft Ion Engine Thruster Pods */}
      <group position={[0, -0.65 - explode * 0.2, 0]}>
        {[-0.2, 0.2].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[Math.PI, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.08, 0.24, 16]} />
            <meshStandardMaterial
              color="#475569"
              metalness={0.85}
              roughness={0.25}
              wireframe={wireframe}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Cerealia Facula 3D Salt Dome
 * Brilliant sodium carbonate salt mound in Occator Crater.
 */
export function CerealiaFacula3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const domeExplode = explode * 0.35;
  return (
    <group scale={scale}>
      {/* Dark Ceres Impact Basin Floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.6, 0.15, 32]} />
        <meshStandardMaterial
          color="#2d3036"
          roughness={0.95}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* Radial Impact Fractures */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <ringGeometry args={[0.55, 1.35, 24]} />
        <meshStandardMaterial color="#475569" roughness={0.9} wireframe={wireframe} />
      </mesh>

      {/* Central Dazzling White Sodium Carbonate Salt Mound */}
      <group position={[0, 0.15 + domeExplode, 0]}>
        <mesh castShadow receiveShadow>
          <coneGeometry args={[0.65, 0.42, 24]} />
          <meshStandardMaterial
            color="#f8fafc"
            emissive="#e2e8f0"
            emissiveIntensity={0.25}
            roughness={0.35}
            metalness={0.15}
            wireframe={wireframe}
          />
        </mesh>
        {/* Central Cryovolcanic Vent Pit */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.14, 0.08, 0.12, 16]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={0.4}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * GRaND Gamma-Ray and Neutron Detector 3D Model
 */
export function GRaNDSensor3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const headExplode = explode * 0.3;
  return (
    <group scale={scale}>
      {/* Sensor Housing Cube */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.5, 0.38]} />
        <meshStandardMaterial
          color="#d1d5db"
          metalness={0.8}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>
      {/* Collimator Crystal Slits */}
      <group position={[0, 0.52 + headExplode, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.22, 16]} />
          <meshStandardMaterial
            color="#0284c7"
            metalness={0.9}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <torusGeometry args={[0.14, 0.02, 8, 24]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.5}
            wireframe={wireframe}
          />
        </mesh>
      </group>
      {/* Telemetry Electronics Base */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.48, 0.08, 0.44]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.7}
          roughness={0.35}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

/**
 * NSTAR Xenon Ion Engine 3D Model
 */
export function DawnIonEngine3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const gridExplode = explode * 0.35;
  return (
    <group scale={scale}>
      {/* Cylindrical Thruster Body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.32, 0.45, 24]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.85}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>
      {/* Molybdenum Accelerator Grids */}
      <mesh position={[0, 0.55 + gridExplode, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.06, 24]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.92}
          roughness={0.18}
          wireframe={wireframe}
        />
      </mesh>
      {/* Glowing Xenon Plasma Discharge Cone */}
      <mesh position={[0, 0.72 + gridExplode * 1.4, 0]}>
        <coneGeometry args={[0.26, 0.35, 24]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.85}
          transparent
          opacity={0.75}
          wireframe={wireframe}
        />
      </mesh>
      {/* Xenon Gas Feed Conduits */}
      <mesh position={[0.22, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.38, 8]} />
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

// ============================================================================
// NEAR SHOEMAKER (Asteroid 433 Eros)
// ============================================================================

/**
 * NEAR Shoemaker Spacecraft 3D Model
 */
export function NEARShoemaker3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const solarTex = useMemo(() => getSolarPanelTexture(), []);
  const wingExplode = explode * 0.4;
  const dishExplode = explode * 0.3;

  return (
    <group scale={scale}>
      {/* Octagonal Aluminum Spacecraft Bus */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.65, 0.72, 0.75, 8]} />
        <meshStandardMaterial
          map={goldKaptonTex}
          color="#d97706"
          metalness={0.88}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>

      {/* High-Gain Antenna Dish */}
      <group position={[0, 0.95 + dishExplode, 0]}>
        <mesh rotation={[Math.PI, 0, 0]} castShadow>
          <sphereGeometry args={[0.5, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
          <meshStandardMaterial
            color="#f1f5f9"
            metalness={0.3}
            roughness={0.35}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* 4 Gallium Arsenide Solar Array Wings */}
      {[0, 90, 180, 270].map((deg) => (
        <group key={deg} rotation={[0, (deg * Math.PI) / 180, 0]}>
          <group position={[1.15 + wingExplode, 0.45, 0]} rotation={[0, 0, 0.15]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.9, 0.02, 0.55]} />
              <meshStandardMaterial
                map={solarTex}
                color="#1e1b4b"
                metalness={0.65}
                roughness={0.3}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        </group>
      ))}

      {/* Rest Position Touchdown Boulders on Eros */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[1.1, 1.25, 0.1, 16]} />
        <meshStandardMaterial
          color="#424448"
          roughness={0.95}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

/**
 * XGRS X-Ray & Gamma-Ray Spectrometer 3D Model
 */
export function XGRSSpectrometer3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const crystalExplode = explode * 0.3;
  return (
    <group scale={scale}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.48, 16]} />
        <meshStandardMaterial
          color="#64748b"
          metalness={0.8}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0, 0.55 + crystalExplode, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          metalness={0.9}
          roughness={0.15}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.38, 0.08, 0.38]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.7}
          roughness={0.4}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

/**
 * Gallium Arsenide Solar Arrays 3D Model
 */
export function NEARSolarWings3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const solarTex = useMemo(() => getSolarPanelTexture(), []);
  const panelSpread = explode * 0.35;
  return (
    <group scale={scale}>
      {[-0.6 - panelSpread, 0.6 + panelSpread].map((x, i) => (
        <group key={i} position={[x, 0.35, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.85, 0.02, 0.65]} />
            <meshStandardMaterial
              map={solarTex}
              color="#1e1b4b"
              metalness={0.65}
              roughness={0.25}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.42, 8]} />
            <meshStandardMaterial
              color="#94a3b8"
              metalness={0.85}
              roughness={0.25}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Eros Ponded Regolith Feature 3D Model
 */
export function ErosPondedRegolith3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const dustLift = explode * 0.25;
  return (
    <group scale={scale}>
      {/* Outer rugged asteroid rim */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.4, 1.55, 0.16, 24]} />
        <meshStandardMaterial
          color="#383a3e"
          roughness={0.96}
          metalness={0.04}
          wireframe={wireframe}
        />
      </mesh>
      {/* Smooth glass-flat electrostatic dust pond */}
      <mesh position={[0, 0.09 + dustLift, 0]} receiveShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.04, 24]} />
        <meshStandardMaterial
          color="#64666a"
          roughness={0.5}
          metalness={0.1}
          wireframe={wireframe}
        />
      </mesh>
      {/* Fractured boulders sitting on edge */}
      {[-0.55, 0.62].map((x, i) => (
        <mesh key={i} position={[x, 0.14, 0.4]} castShadow>
          <dodecahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial color="#2d3036" roughness={0.9} wireframe={wireframe} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// VOYAGER INTERSTELLAR MISSION
// ============================================================================

/**
 * Voyager Interstellar Spacecraft 3D Model
 * Iconic 3.7-meter white high-gain antenna dish, 10-sided bus, and instrument booms.
 */
export function VoyagerProbe3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const dishExplode = explode * 0.45;
  const boomExplode = explode * 0.35;

  return (
    <group scale={scale}>
      {/* 3.7m Parabolic High-Gain Antenna Dish */}
      <group position={[0, 0.7 + dishExplode, 0]}>
        <mesh rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
          <sphereGeometry args={[1.05, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.34]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.2}
            roughness={0.35}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
        {/* Subreflector Tripod Feed */}
        <mesh position={[0, 0.45, 0]}>
          <coneGeometry args={[0.14, 0.22, 16]} />
          <meshStandardMaterial
            color="#0284c7"
            metalness={0.8}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* 10-Sided Decagonal Mission Electronics Bus */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.48, 10]} />
        <meshStandardMaterial
          map={goldKaptonTex}
          color="#d97706"
          metalness={0.88}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>

      {/* RTG Power Boom */}
      <group position={[-1.25 - boomExplode, -0.1, 0]} rotation={[0, 0, 0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.85, 12]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.85}
            roughness={0.3}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Magnetometer 13m Boom Structure */}
      <group position={[1.45 + boomExplode, -0.05, 0]} rotation={[0, 0, -0.25]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.4, 8]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * The Golden Record 3D Model
 * 12-inch gleaming gold-plated phonograph record with engraved pulsar map.
 */
export function GoldenRecord3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const coverLift = explode * 0.4;
  return (
    <group scale={scale}>
      {/* 12-inch Gold-Plated Copper Phonograph Disc */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.025, 48]} />
        <meshStandardMaterial
          color="#eab308"
          metalness={0.96}
          roughness={0.12}
          wireframe={wireframe}
        />
      </mesh>

      {/* Microgroove Tracks (Subtle Concentric Rings) */}
      <mesh position={[0, 0.034, 0]}>
        <ringGeometry args={[0.22, 0.61, 48]} />
        <meshStandardMaterial
          color="#ca8a04"
          metalness={0.92}
          roughness={0.18}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>

      {/* Central Spindle Hole & Inscription Label */}
      <mesh position={[0, 0.038, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.015, 24]} />
        <meshStandardMaterial color="#713f12" roughness={0.5} wireframe={wireframe} />
      </mesh>

      {/* Protective Aluminum Cover Jacket with Pulsar Engravings */}
      <group position={[0, 0.15 + coverLift, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.68, 0.68, 0.02, 48]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.85}
            roughness={0.28}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * MHW-RTG Nuclear Power Boom 3D Model
 */
export function RTGPowerBoom3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const rtgExplode = explode * 0.35;
  return (
    <group scale={scale}>
      {/* Structural Boom Truss */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.1, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#64748b"
          metalness={0.8}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>
      {/* 3 Stacked Multi-Hundred-Watt RTG Canisters with Heat Dissipation Fins */}
      {[-0.32 - rtgExplode, 0, 0.32 + rtgExplode].map((x, i) => (
        <group key={i} position={[x, 0.32, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.38, 16]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.85}
              roughness={0.35}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.18, 0.015, 8, 24]} />
            <meshStandardMaterial
              color="#ea580c"
              emissive="#c2410c"
              emissiveIntensity={0.35}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * PWS Plasma Wave Dipole Antenna 3D Model
 */
export function PlasmaWaveAntenna3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const antennaSpread = explode * 0.35;
  return (
    <group scale={scale}>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.35, 0.15, 0.25]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.8}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>
      {/* 10-meter V-shaped Be-Cu Dipole Elements */}
      {[-0.38 - antennaSpread, 0.38 + antennaSpread].map((rot, i) => (
        <group key={i} position={[0, 0.2, 0]} rotation={[0, 0, rot]}>
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 1.3, 8]} />
            <meshStandardMaterial
              color="#f59e0b"
              metalness={0.9}
              roughness={0.15}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================================================
// KEPLER SPACE TELESCOPE
// ============================================================================

/**
 * Kepler Space Observatory 3D Model
 * 0.95-meter Schmidt telescope tube with angled sunshade and solar array wings.
 */
export function KeplerTelescope3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const solarTex = useMemo(() => getSolarPanelTexture(), []);
  const baffleLift = explode * 0.45;
  const busLower = -explode * 0.25;

  return (
    <group scale={scale}>
      {/* Cylindrical Schmidt Optical Tube Barrel */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.95, 24]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.5}
          roughness={0.35}
          wireframe={wireframe}
        />
      </mesh>

      {/* Angled Carbon-Composite Sunshade Baffle */}
      <group position={[0, 1.1 + baffleLift, 0]} rotation={[0.22, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.58, 0.55, 0.48, 24, 1, true]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.8}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Hexagonal Spacecraft Service Bus */}
      <mesh position={[0, busLower, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.76, 0.45, 6]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.85}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>

      {/* Curved Integrated Solar Panel Arrays */}
      <mesh position={[0, 0.35, -0.6]} rotation={[0, Math.PI, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.85, 16, 1, true, 0, Math.PI * 0.7]} />
        <meshStandardMaterial
          map={solarTex}
          color="#1e1b4b"
          metalness={0.65}
          roughness={0.3}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

/**
 * 95-Megapixel CCD Focal Plane 3D Model
 * Array of 42 curved science CCD chips with gold wire bonds.
 */
export function CCDFocalPlane3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const chipLift = explode * 0.35;
  return (
    <group scale={scale}>
      {/* Curved Silicon Substrate Base */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.75, 0.78, 0.08, 32]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Grid of 42 Silicon CCD Science Chips */}
      <group position={[0, 0.12 + chipLift, 0]}>
        {[-0.35, 0, 0.35].map((x, xi) =>
          [-0.35, 0, 0.35].map((z, zi) => (
            <mesh key={`${xi}-${zi}`} position={[x, 0, z]} castShadow>
              <boxGeometry args={[0.26, 0.025, 0.26]} />
              <meshStandardMaterial
                color="#6366f1"
                emissive="#4338ca"
                emissiveIntensity={0.28}
                metalness={0.95}
                roughness={0.12}
                wireframe={wireframe}
              />
            </mesh>
          )),
        )}
      </group>

      {/* Gold Bond Wires & Readout Preamps */}
      <mesh position={[0, 0.18 + chipLift * 1.5, 0]}>
        <torusGeometry args={[0.62, 0.015, 8, 32]} />
        <meshStandardMaterial
          color="#eab308"
          metalness={0.95}
          roughness={0.15}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

/**
 * Precision Reaction Wheel Assembly 3D Model
 */
export function ReactionWheelAssembly3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const wheelSpread = explode * 0.35;
  return (
    <group scale={scale}>
      {/* Core Mounting Structure */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.5, 0.12, 0.5]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.8}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>

      {/* 4 Precision Flywheels in Pyramidal Orthogonal Orientation */}
      {[0, 90, 180, 270].map((deg) => (
        <group key={deg} rotation={[0, (deg * Math.PI) / 180, 0]}>
          <group position={[0.22 + wheelSpread, 0.24, 0]} rotation={[0.45, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.08, 24]} />
              <meshStandardMaterial
                color="#94a3b8"
                metalness={0.92}
                roughness={0.18}
                wireframe={wireframe}
              />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
              <meshStandardMaterial
                color="#38bdf8"
                metalness={0.85}
                roughness={0.2}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/**
 * Solar Array & Thermal Sunshade 3D Model
 */
export function PhotometerSunshield3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const solarTex = useMemo(() => getSolarPanelTexture(), []);
  const shieldLift = explode * 0.35;
  return (
    <group scale={scale}>
      <mesh position={[0, 0.3 + shieldLift, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.58, 0.65, 24, 1, true, 0, Math.PI * 1.2]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.7}
          roughness={0.35}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0, 0.15, -0.4]} rotation={[0, Math.PI, 0]}>
        <boxGeometry args={[0.95, 0.02, 0.55]} />
        <meshStandardMaterial
          map={solarTex}
          color="#1e1b4b"
          metalness={0.65}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}
