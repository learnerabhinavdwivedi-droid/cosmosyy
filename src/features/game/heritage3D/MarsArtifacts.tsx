import * as THREE from "three";
import { useMemo } from "react";
import {
  getCharredHeatShieldTexture,
  getCalibrationTargetTexture,
  getSolarPanelTexture,
} from "./textures";

export interface ArtifactProps {
  explode?: number;
  wireframe?: boolean;
  scale?: number;
}

/**
 * 1. Mars Heat Shield Wreckage (Opportunity, Spirit)
 * Charred conical aeroshell with hexagonal PICA-X tiles and fractured honeycomb core
 */
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

/**
 * 2. Ingenuity Mars Helicopter (Perseverance)
 * 1.8 kg coaxial twin carbon-fiber rotor blades, solar panel, avionics cube, 4 landing legs
 */
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

/**
 * 3. Mars Sample Cache Tubes Depot (Perseverance)
 * Hermetically sealed titanium sample collection tubes resting on regolith
 */
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

/**
 * 4. Sojourner Rover (Pathfinder)
 * 6-wheel microrover with solar panel deck and APXS spectrometer
 */
export function SojournerRover3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const solarTex = useMemo(() => getSolarPanelTexture(), []);
  const wheelSpread = explode * 0.2;

  return (
    <group scale={scale}>
      {/* Warm Gold-foiled Chassis Body */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.16, 0.36]} />
        <meshStandardMaterial color="#dfa230" metalness={0.9} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Top Silicon Solar Panel Deck */}
      <mesh position={[0, 0.31, 0]}>
        <boxGeometry args={[0.52, 0.015, 0.34]} />
        <meshStandardMaterial map={solarTex} metalness={0.7} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* 6 Cleated Aluminum Wheels with Rocker-Bogie Linkage */}
      {(([
        [-0.24, 0.1, 0.22 + wheelSpread],
        [0, 0.1, 0.23 + wheelSpread],
        [0.24, 0.1, 0.22 + wheelSpread],
        [-0.24, 0.1, -0.22 - wheelSpread],
        [0, 0.1, -0.23 - wheelSpread],
        [0.24, 0.1, -0.22 - wheelSpread],
      ]) as [number, number, number][]).map(([wx, wy, wz], idx) => (
        <group key={idx} position={[wx, wy, wz]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.075, 0.075, 0.05, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.3} wireframe={wireframe} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} wireframe={wireframe} />
          </mesh>
        </group>
      ))}

      {/* Rear APXS Spectrometer Sensor Head */}
      <group position={[-0.32 - explode * 0.25, 0.18, 0]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.12, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>

      {/* UHF Whip Antenna */}
      <mesh position={[0.2, 0.45 + explode * 0.2, 0.12]}>
        <cylinderGeometry args={[0.004, 0.004, 0.28, 6]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * 5. MAHLI Calibration Target (Curiosity)
 * Calibration fixture with 4 color chips, sundial gnomon, and 1909 Lincoln Penny
 */
export function MarsCalibrationTarget3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const calibTex = useMemo(() => getCalibrationTargetTexture(), []);
  const gnomonY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Anodized Aluminum Mounting Bracket */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.55, 0.55, 0.05]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* Color and Metric Target Face */}
      <mesh position={[0, 0.25, 0.03]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial map={calibTex} roughness={0.5} metalness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Center Sundial Gnomon Pin */}
      <mesh position={[0, 0.25, 0.12 + gnomonY]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.015, 0.16, 12]} />
        <meshStandardMaterial color="#e5b842" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>

      {/* 1909 VDB Lincoln Wheat Penny Replica */}
      <group position={[0.16, 0.09, 0.035]} rotation={[0, 0, 0.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.006, 16]} />
          <meshStandardMaterial color="#b45309" metalness={0.88} roughness={0.35} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 6. Haematite 'Blueberries' Discovery (Opportunity)
 * Bedrock matrix with spherical blue-gray hematite concretions
 */
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

/**
 * 7. Curiosity Rock Drill Holes & Laser Zap Marks
 * Twin 1.6 cm cylindrical drilled boreholes with grey pulverized rock tailings
 */
export function MarsDrillHoles3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const liftY = explode * 0.15;

  return (
    <group scale={scale} position={[0, liftY, 0]}>
      {/* Grey Lakebed Mudstone Bedrock Outcrop */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.12, 0.8]} />
        <meshStandardMaterial color="#78716c" roughness={0.92} metalness={0.1} wireframe={wireframe} />
      </mesh>

      {/* Drill Hole 1 (Deep borehole + pulverized grey cuttings ring) */}
      <group position={[-0.15 - explode * 0.1, 0.125, 0]}>
        {/* Grey tailings powder halo */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.14, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.95} metalness={0.05} wireframe={wireframe} />
        </mesh>
        {/* Cylindrical Borehole recess */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.1, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.95} metalness={0.1} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Drill Hole 2 */}
      <group position={[0.15 + explode * 0.1, 0.125, -0.05]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.14, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.95} metalness={0.05} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.1, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.95} metalness={0.1} wireframe={wireframe} />
        </mesh>
      </group>

      {/* 5-point ChemCam Laser Plasma Scorch Marks */}
      {[-0.08, -0.04, 0, 0.04, 0.08].map((lx, idx) => (
        <mesh key={idx} position={[lx, 0.122, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.008, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} wireframe={wireframe} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 8. Sky Crane Descent Stage Crash Wreckage (Curiosity, Perseverance)
 * Charred hydrazine propellant tanks, descent engines, and severed bridles
 */
export function SkyCraneDescentStage3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const spread = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Impact Debris Crater Berm */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.5, 1.4, 24]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.96} metalness={0.05} wireframe={wireframe} />
      </mesh>

      {/* Charred Spherical Titanium Propellant Tanks */}
      <mesh position={[-0.25 - spread, 0.18, -0.1]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.3} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.3 + spread, 0.16, 0.15]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* Canted Mars Lander Descent Rocket Engines (MLE Nozzles) */}
      <mesh position={[0, 0.14 + explode * 0.2, 0.28]} rotation={[0.4, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.16, 0.28, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Twisted Carbon Composite Tubular Truss Structure */}
      <mesh position={[-0.05, 0.12, 0]} rotation={[0.3, 0.6, -0.2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.85, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * 9. Viking 1 Lander Body & Terminal Propulsion
 * Hexagonal body with 3 shock struts, footpads, and terminal descent engines
 */
export function VikingLanderBody3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const legSpread = explode * 0.3;

  return (
    <group scale={scale}>
      {/* Hexagonal Titanium Main Equipment Bus */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.95, 0.45, 6]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* 3 Outrigger Landing Legs with Round Footpads */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={deg} rotation={[0, rad, 0]}>
            <mesh position={[0.75 + legSpread, 0.26, 0]} rotation={[0, 0, -0.7]}>
              <cylinderGeometry args={[0.03, 0.03, 0.75, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
            </mesh>
            <mesh position={[1.05 + legSpread, 0.02, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
            </mesh>
          </group>
        );
      })}

      {/* Dual Terminal Descent Engine Nozzle Assemblies */}
      <mesh position={[-0.35, 0.25 - explode * 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.18, 0.22, 12]} />
        <meshStandardMaterial color="#2d3036" metalness={0.88} roughness={0.25} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.35, 0.25 - explode * 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.18, 0.22, 12]} />
        <meshStandardMaterial color="#2d3036" metalness={0.88} roughness={0.25} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * 10. Viking 1 Soil Sampler Arm & Sieve
 * Extendable 3-meter boom with motorized backhoe scoop and collector sieve
 */
export function VikingSamplerArm3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const boomLen = 0.85 + explode * 0.4;

  return (
    <group scale={scale}>
      {/* Extendable Lattice Tubular Boom */}
      <mesh position={[0, 0.25, boomLen * 0.5]} rotation={[0.3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, boomLen, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Motorized Backhoe Soil Scoop & Sieve Chamber */}
      <group position={[0, 0.25 - boomLen * 0.15, boomLen]}>
        <mesh castShadow>
          <boxGeometry args={[0.14, 0.1, 0.16]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* Scoop Teeth */}
        <mesh position={[0, -0.06, 0.08]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.12, 0.02, 0.06]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 11. Viking Meteorology Station Boom
 * Vertical sensor boom with wind, temperature, and pressure sensors
 */
export function VikingMeteorology3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const mastY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Vertical Deployable Sensor Mast */}
      <mesh position={[0, 0.5 + mastY * 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 1.0 + mastY, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Hot-film Anemometer Sensor Head */}
      <mesh position={[0, 1.05 + mastY, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.06, 1.05 + mastY, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#e5b842" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * 12. Viking Facsimile Cameras
 * Twin scanning optical facsimile cameras with protective nodding mirrors
 */
export function VikingFacsimileCameras3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const spread = explode * 0.25;

  return (
    <group scale={scale}>
      {/* Camera 1 */}
      <group position={[-0.18 - spread, 0.35, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.45, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.16, 0.04]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Camera 2 */}
      <group position={[0.18 + spread, 0.35, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.45, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.16, 0.04]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 13. Viking Steerable High-Gain S-Band Antenna
 * 1-meter parabolic dish antenna on 2-axis gimbal
 */
export function VikingAntenna3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const dishY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* 2-Axis Articulated Gimbal Stand */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.03, 0.045, 0.44, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Parabolic Reflector Dish */}
      <group position={[0, 0.55 + dishY, 0]} rotation={[0.5, 0.3, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.08, 0.1, 24]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.35} wireframe={wireframe} />
        </mesh>
        {/* Feed Horn Strut */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.008, 0.015, 0.28, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 14. Viking / Mars Surface Seismometer
 * Deck-mounted seismic instrument enclosed in thermal cannister
 */
export function VikingSeismometer3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const capY = explode * 0.3;

  return (
    <group scale={scale}>
      {/* Thermal Cannister Base Drum */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.28, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.3} wireframe={wireframe} />
      </mesh>
      {/* Gold Thermal Dome Cap */}
      <mesh position={[0, 0.32 + capY, 0]}>
        <sphereGeometry args={[0.21, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#e5b842" metalness={0.92} roughness={0.2} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * 15. Pathfinder Base Station (Carl Sagan Memorial Station)
 * 3-Petal tetrahedron lander with solar cells and deflated Kevlar airbags
 */
export function PathfinderBaseStation3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const solarTex = useMemo(() => getSolarPanelTexture(), []);
  const petalSpread = explode * 0.4;

  return (
    <group scale={scale}>
      {/* Central Equipment Electronics Triangle */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.2, 3]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* 3 Fold-down Triangular Solar Petals */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={deg} rotation={[0, rad, 0]}>
            <mesh position={[0.65 + petalSpread, 0.08, 0]} rotation={[0, 0, 0.15]}>
              <boxGeometry args={[0.6, 0.02, 0.45]} />
              <meshStandardMaterial map={solarTex} metalness={0.7} roughness={0.25} wireframe={wireframe} />
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
            <meshStandardMaterial color="#fef08a" roughness={0.9} metalness={0.1} wireframe={wireframe} />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * 16. Pathfinder Deployment Ramp
 * Metallic/fabric rollout ramps for Sojourner microrover
 */
export function MarsDeploymentRamp3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const rampSpread = explode * 0.15;

  return (
    <group scale={scale}>
      {/* Dual Rollout Track Ramps */}
      <mesh position={[-0.12 - rampSpread, 0.14, 0.45]} rotation={[0.35, 0, 0]} castShadow>
        <boxGeometry args={[0.16, 0.015, 0.95]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.3} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.12 + rampSpread, 0.14, 0.45]} rotation={[0.35, 0, 0]} castShadow>
        <boxGeometry args={[0.16, 0.015, 0.95]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.3} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * 17. IMP Camera Mast (Imager for Mars Pathfinder)
 * Stereo camera head on 80 cm telescoping mast
 */
export function IMPCameraMast3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const mastY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Telescoping Tubular Mast */}
      <mesh position={[0, 0.45 + mastY * 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.016, 0.02, 0.9 + mastY, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Stereo Camera Binocular Head */}
      <group position={[0, 0.95 + mastY, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.12, 0.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} wireframe={wireframe} />
        </mesh>
        {/* Left Eye Filter Wheel */}
        <mesh position={[-0.07, 0, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} wireframe={wireframe} />
        </mesh>
        {/* Right Eye Filter Wheel */}
        <mesh position={[0.07, 0, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 18. Barnacle Bill Rock (Pathfinder)
 * Volcanic andesite rock with weathered cavities and circular APXS contact mark
 */
export function BarnacleBillRock3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const liftY = explode * 0.15;

  return (
    <group scale={scale} position={[0, liftY, 0]}>
      {/* Faceted Volcanic Andesite Boulder */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#57534e" roughness={0.92} metalness={0.15} wireframe={wireframe} />
      </mesh>
      {/* Circular APXS Contact Abutment Mark */}
      <mesh position={[0.22, 0.26, 0.26]} rotation={[0.4, 0.6, 0]}>
        <ringGeometry args={[0.03, 0.055, 12]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * 19. Yogi Rock (Pathfinder)
 * Large angular basalt boulder resembling a reclining bear with wind drift
 */
export function YogiRock3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const liftY = explode * 0.15;

  return (
    <group scale={scale} position={[0, liftY, 0]}>
      {/* Large Angular Basalt Boulder */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial color="#44403c" roughness={0.94} metalness={0.12} wireframe={wireframe} />
      </mesh>
      {/* Wind-blown Red Dust Drift Tail on Leeward Side */}
      <mesh position={[0.45, 0.04, -0.2]} rotation={[-Math.PI / 2, 0, 0.5]} receiveShadow>
        <planeGeometry args={[0.9, 0.6]} />
        <meshStandardMaterial color="#9a3412" roughness={0.98} metalness={0.02} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * 20. SuperCam Laser Marks Target Rock (Perseverance)
 * Basalt target rock with series of 10 micro-laser ablation pits and plasma halos
 */
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

/**
 * 21. Backshell and Parachute (Spirit)
 * Intact supersonic parachute canopy draped over martian rocks with crumpled conical backshell
 */
export function BackshellParachute3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const spread = explode * 0.4;

  return (
    <group scale={scale}>
      {/* Crumpled Conical Backshell */}
      <mesh position={[-0.35 - spread, 0.22, 0]} rotation={[0.4, 0.3, 0.6]} castShadow>
        <coneGeometry args={[0.55, 0.35, 16]} />
        <meshStandardMaterial color="#ebe7de" roughness={0.65} metalness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Draped Orange-and-White Striped Nylon Parachute Canopy */}
      <mesh position={[0.45 + spread, 0.06, 0.1]} rotation={[-Math.PI / 2, 0, 0.2]} receiveShadow>
        <planeGeometry args={[1.2, 0.8, 6, 6]} />
        <meshStandardMaterial color="#ea580c" roughness={0.85} metalness={0.05} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.55 + spread, 0.07, 0.15]} rotation={[-Math.PI / 2, 0, 0.2]}>
        <planeGeometry args={[0.4, 0.7, 4, 4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} metalness={0.05} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * 22. Rover Wheel Tracks (Spirit)
 * Distinctive twin tracks with right track carving deep trench exposing bright white silica
 */
export function RoverWheelTracks3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const trackSpread = explode * 0.15;

  return (
    <group scale={scale}>
      {/* Regular Left Track (Shallow red tread imprints) */}
      <mesh position={[-0.25 - trackSpread, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.18, 1.4]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.96} metalness={0.02} wireframe={wireframe} />
      </mesh>

      {/* Right Track (Stalled wheel dug 10 cm trench exposing 90% pure opaline white silica) */}
      <mesh position={[0.25 + trackSpread, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.22, 1.4]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.7}
          metalness={0.15}
          emissive="#e2e8f0"
          emissiveIntensity={0.2}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

/**
 * 23. Geological Features (Mount Sharp, Columbia Hills, Home Plate, Delta, Craters)
 */
export function MarsLandscapeFeature3D({
  name,
  wireframe = false,
  scale = 1,
}: {
  name: string;
  wireframe?: boolean;
  scale?: number;
}) {
  return (
    <group name={name} scale={scale}>
      {/* Stratified Layered Rock Formation */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.95, 0.65, 8]} />
        <meshStandardMaterial color="#9a3412" roughness={0.95} metalness={0.05} wireframe={wireframe} />
      </mesh>
      {/* Sedimentary Bench Ledges */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 0.1, 8]} />
        <meshStandardMaterial color="#c2410c" roughness={0.92} metalness={0.08} wireframe={wireframe} />
      </mesh>
      {/* Upper Summit Crest */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <coneGeometry args={[0.35, 0.45, 8]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.96} metalness={0.05} wireframe={wireframe} />
      </mesh>
    </group>
  );
}
