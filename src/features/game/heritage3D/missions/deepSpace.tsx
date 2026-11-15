import { useMemo } from "react";
import * as THREE from "three";
import type { ArtifactProps } from "./shared";
import { getSolarPanelTexture, getGoldKaptonTexture } from "../textures";

/* =========================================================================
 * 1. NEAR Shoemaker (Asteroid 433 Eros — 2001)
 * ========================================================================= */

/**
 * NEAR Shoemaker Main Bus Structure
 */
export function NearBus3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const engineOffset = explode * 0.45;
  const thrusterOffset = explode * 0.3;
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);

  return (
    <group scale={scale} dispose={null}>
      {/* Octagonal spacecraft main bus */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.95, 1.4, 8]} />
        <meshStandardMaterial
          map={goldKaptonTex}
          color="#d4af37"
          roughness={0.28}
          metalness={0.85}
          wireframe={wireframe}
        />
      </mesh>

      {/* Titanium top equipment deck */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.86, 0.86, 0.06, 8]} />
        <meshStandardMaterial color="#888f98" metalness={0.88} roughness={0.22} wireframe={wireframe} />
      </mesh>

      {/* 450N LEROS Bipropellant Liquid Engine Bell */}
      <group position={[0, -0.7 - engineOffset, 0]}>
        <mesh castShadow>
          <coneGeometry args={[0.34, 0.65, 24, 1, true]} />
          <meshStandardMaterial
            color="#2a2e33"
            metalness={0.8}
            roughness={0.3}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.12, 0.16, 0.2, 16]} />
          <meshStandardMaterial color="#b87333" metalness={0.7} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Four Attitude Control Thruster Quads */}
      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, i) => (
        <group
          key={i}
          position={[
            Math.cos(angle) * (0.95 + thrusterOffset),
            0.3,
            Math.sin(angle) * (0.95 + thrusterOffset),
          ]}
          rotation={[0, -angle, 0]}
        >
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.12, 0.12]} />
            <meshStandardMaterial color="#3a3f47" metalness={0.8} roughness={0.3} wireframe={wireframe} />
          </mesh>
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.04, 0.1, 8]} />
            <meshStandardMaterial color="#1a1d20" metalness={0.9} roughness={0.2} wireframe={wireframe} />
          </mesh>
        </group>
      ))}

      {/* Central High-Gain Fixed Parabolic Dish */}
      <group position={[0, 0.9, 0]}>
        <mesh rotation={[Math.PI, 0, 0]} castShadow>
          <sphereGeometry args={[0.75, 24, 12, 0, Math.PI * 2, 0, 0.7]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.65}
            roughness={0.25}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
        {/* Antenna feed horn tripod */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * NEAR GaAs Fixed Solar Array Wings
 */
export function NearSolarArray3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const wingOffset = explode * 0.5;
  const solarTex = useMemo(() => getSolarPanelTexture(), []);

  return (
    <group scale={scale} dispose={null}>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (1.6 + wingOffset), 0, 0]}>
          {/* Main rectangular panel frame */}
          <mesh castShadow>
            <boxGeometry args={[1.5, 0.05, 1.1]} />
            <meshStandardMaterial color="#1e2430" metalness={0.8} roughness={0.3} wireframe={wireframe} />
          </mesh>
          {/* Blue Gallium Arsenide solar cells */}
          <mesh position={[0, 0.03, 0]}>
            <planeGeometry args={[1.42, 1.02]} />
            <meshStandardMaterial
              map={solarTex}
              color="#0d2b45"
              metalness={0.9}
              roughness={0.15}
              wireframe={wireframe}
            />
          </mesh>
          {/* Metallic yoke spar connector */}
          <mesh position={[-side * 0.85, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * NEAR Multispectral Imager (MSI Camera)
 */
export function NearMsiCamera3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const baffleOffset = explode * 0.35;

  return (
    <group scale={scale} dispose={null}>
      {/* Heavy anodized instrument bracket */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>
      {/* Camera body enclosure */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.42, 0.45, 0.55]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.3} wireframe={wireframe} />
      </mesh>
      {/* Stepped Optical Telephoto Barrel */}
      <mesh position={[0, 0, 0.35 + baffleOffset]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 0.38, 24]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>
      {/* Front Lens Optical Glass */}
      <mesh position={[0, 0, 0.55 + baffleOffset]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.14, 24]} />
        <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.08} wireframe={wireframe} />
      </mesh>
      {/* Filter wheel mechanism cylindrical bulge */}
      <mesh position={[0.22, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * NEAR XGRS (X-Ray & Gamma-Ray Spectrometer)
 */
export function NearXgrs3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const detectorOffset = explode * 0.4;

  return (
    <group scale={scale} dispose={null}>
      {/* Structural mounting arm */}
      <mesh position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>
      {/* NaI Scintillation detector housing (gold-wrapped cylinder) */}
      <mesh position={[0, 0.15 + detectorOffset, 0.1]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.6, 24]} />
        <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>
      {/* Gas Proportional Counter Solar Monitor Grids */}
      <mesh position={[0.28 + detectorOffset, -0.1, 0.1]}>
        <boxGeometry args={[0.22, 0.35, 0.35]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} wireframe={wireframe} />
      </mesh>
      {/* Collimator honeycomb grid front face */}
      <mesh position={[0.28 + detectorOffset, -0.1, 0.28]}>
        <planeGeometry args={[0.18, 0.3]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.4} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * NEAR Laser Rangefinder (NLR)
 */
export function NearLaserAltimeter3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const opticsOffset = explode * 0.35;

  return (
    <group scale={scale} dispose={null}>
      {/* Base chassis housing electronics */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.48, 0.25, 0.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.75} roughness={0.3} wireframe={wireframe} />
      </mesh>
      {/* Gold receiver telescope tube */}
      <mesh position={[-0.12, 0.2 + opticsOffset, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.45, 24]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} wireframe={wireframe} />
      </mesh>
      {/* Laser diode transmitter aperture */}
      <mesh position={[0.14, 0.15 + opticsOffset, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.35, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>
      {/* 1064nm pulsed emitter optical element */}
      <mesh position={[0.14, 0.33 + opticsOffset, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>
    </group>
  );
}

/**
 * 433 Eros Asteroid Regolith & Boulders
 */
export function NearErosRegolith3D({ wireframe = false, scale = 1 }: ArtifactProps) {
  return (
    <group scale={scale} dispose={null}>
      {/* Low-gravity undulating asteroid terrain mound */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.5, 0.6, 24]} />
        <meshStandardMaterial color="#57534e" roughness={0.92} metalness={0.15} wireframe={wireframe} />
      </mesh>
      {/* Flat electrostatic dust pond */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.1, 24]} />
        <meshStandardMaterial color="#78716c" roughness={0.75} metalness={0.1} wireframe={wireframe} />
      </mesh>
      {/* Jagged shattered ejecta boulders */}
      {([
        [-0.8, 0.18, 0.6, 0.35],
        [0.9, 0.12, -0.7, 0.28],
        [-0.4, 0.08, -0.9, 0.22],
        [0.7, 0.15, 0.8, 0.32],
      ] as const).map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[i, i * 0.7, i * 1.3]} castShadow>
          <dodecahedronGeometry args={[s, 0]} />
          <meshStandardMaterial color="#44403c" roughness={0.88} metalness={0.2} wireframe={wireframe} />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================================
 * 2. Dawn Spacecraft (Ceres & Vesta — 2007-2018)
 * ========================================================================= */

/**
 * Dawn Spacecraft Hexagonal Core Bus
 */
export function DawnBus3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const dishOffset = explode * 0.5;
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);

  return (
    <group scale={scale} dispose={null}>
      {/* Hexagonal graphite composite spacecraft core */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.9, 1.8, 6]} />
        <meshStandardMaterial
          map={goldKaptonTex}
          color="#d97706"
          roughness={0.3}
          metalness={0.82}
          wireframe={wireframe}
        />
      </mesh>

      {/* 1.52m High-Gain Parabolic S/X-Band Antenna Dish */}
      <group position={[0, 0, 1.05 + dishOffset]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.76, 24, 12, 0, Math.PI * 2, 0, 0.65]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.5}
            roughness={0.25}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.45, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Star Trackers and Inertial Reference Units */}
      <mesh position={[0.7, 0.6, -0.4]} rotation={[0.4, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.25, 12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * Dawn NSTAR Xenon Ion Thruster Trio
 */
export function DawnIonEngine3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const plumeOffset = explode * 0.4;

  return (
    <group scale={scale} dispose={null}>
      {/* Thruster mounting gimbal platform */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.12, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Three 30cm Electrostatic Ion Propulsion Thrusters */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <group key={i} position={[Math.cos(angle) * 0.32, 0.1, Math.sin(angle) * 0.32]}>
          {/* Molybdenum accelerator grid bell */}
          <mesh rotation={[Math.PI, 0, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.18, 0.35, 20]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
          </mesh>
          {/* Glowing cyan electrostatic xenon plasma plume */}
          <mesh position={[0, -0.45 - plumeOffset, 0]}>
            <coneGeometry args={[0.16, 0.7, 16, 1, true]} />
            <meshBasicMaterial
              color="#06b6d4"
              transparent
              opacity={0.65}
              side={THREE.DoubleSide}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Dawn 19.7-Meter UltraFlex Solar Arrays
 */
export function DawnSolarWings3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const wingOffset = explode * 0.6;
  const solarTex = useMemo(() => getSolarPanelTexture(), []);

  return (
    <group scale={scale} dispose={null}>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (2.2 + wingOffset), 0, 0]}>
          {/* Main solar wing frame */}
          <mesh castShadow>
            <boxGeometry args={[2.4, 0.06, 0.95]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe={wireframe} />
          </mesh>
          {/* High-efficiency photovoltaic cells */}
          <mesh position={[0, 0.035, 0]}>
            <planeGeometry args={[2.3, 0.88]} />
            <meshStandardMaterial
              map={solarTex}
              color="#0c4a6e"
              metalness={0.92}
              roughness={0.12}
              wireframe={wireframe}
            />
          </mesh>
          {/* Articulated motor drive gimbal yoke */}
          <mesh position={[-side * 1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.45, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Dawn DLR Framing Cameras
 */
export function DawnFramingCamera3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const opticOffset = explode * 0.35;

  return (
    <group scale={scale} dispose={null}>
      {/* Aluminum instrument baseplate */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.4]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>
      {/* Twin German DLR refractive camera bodies */}
      {[-0.16, 0.16].map((x, i) => (
        <group key={i} position={[x, 0.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.24, 0.3, 0.35]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.65} roughness={0.25} wireframe={wireframe} />
          </mesh>
          <mesh position={[0, 0, 0.22 + opticOffset]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.11, 0.22, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} wireframe={wireframe} />
          </mesh>
          <mesh position={[0, 0, 0.34 + opticOffset]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.08, 16]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Dawn VIR (Visible & Infrared Spectrometer)
 */
export function DawnVirSpectrometer3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const coolOffset = explode * 0.4;

  return (
    <group scale={scale} dispose={null}>
      {/* ASI Spectrometer optical head */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.45, 0.55]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>
      {/* Cryocooler radiator panel for infrared sensor cooling */}
      <mesh position={[0.32 + coolOffset, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.42, 0.04, 0.5]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.4} roughness={0.2} wireframe={wireframe} />
      </mesh>
      {/* Entrance telescope aperture */}
      <mesh position={[0, 0.1, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
        <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.15} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * Dawn Occator Crater Cerealia Facula Bright Salt Dome
 */
export function DawnCeresBrightSpots3D({ wireframe = false, scale = 1 }: ArtifactProps) {
  return (
    <group scale={scale} dispose={null}>
      {/* Dark asteroid crater floor */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[2.0, 2.2, 0.4, 32]} />
        <meshStandardMaterial color="#292524" roughness={0.95} metalness={0.1} wireframe={wireframe} />
      </mesh>
      {/* Cerealia Facula bright central salt dome */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <coneGeometry args={[0.85, 0.45, 24]} />
        <meshStandardMaterial
          color="#f1f5f9"
          emissive="#cbd5e1"
          emissiveIntensity={0.25}
          roughness={0.35}
          metalness={0.3}
          wireframe={wireframe}
        />
      </mesh>
      {/* Radial sodium carbonate fractures */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i * Math.PI) / 3) * 0.65, 0.02, Math.sin((i * Math.PI) / 3) * 0.65]}
          rotation={[0, -(i * Math.PI) / 3, 0]}
        >
          <planeGeometry args={[0.6, 0.08]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} wireframe={wireframe} />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================================
 * 3. Pioneer 10 & 11 (Interstellar Trajectory — 1972)
 * ========================================================================= */

/**
 * Pioneer 10 2.74-Meter High-Gain Antenna Dish
 */
export function PioneerDish3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const hornOffset = explode * 0.45;

  return (
    <group scale={scale} dispose={null}>
      {/* Parabolic reflector dish */}
      <mesh rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.37, 32, 16, 0, Math.PI * 2, 0, 0.6]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.7}
          roughness={0.25}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>
      {/* Feed Horn Tripod Struts */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.5, 0.4 + hornOffset * 0.5, Math.sin(angle) * 0.5]}
          rotation={[0.3 * Math.sin(angle), -angle, 0.3 * Math.cos(angle)]}
        >
          <cylinderGeometry args={[0.015, 0.015, 0.95, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} wireframe={wireframe} />
        </mesh>
      ))}
      {/* Sub-reflector apex feed horn */}
      <mesh position={[0, 0.85 + hornOffset, 0]}>
        <coneGeometry args={[0.12, 0.25, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * Pioneer SNAP-19 RTG Power Booms
 */
export function PioneerRtgBooms3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const boomOffset = explode * 0.5;

  return (
    <group scale={scale} dispose={null}>
      {/* Twin deployable truss booms */}
      {[-1, 1].map((dir) => (
        <group key={dir} position={[dir * (1.6 + boomOffset), 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 1.8, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} wireframe={wireframe} />
          </mesh>
          {/* Pair of SNAP-19 RTGs per boom */}
          {[-0.25, 0.25].map((z, j) => (
            <group key={j} position={[dir * 0.8, 0, z]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.18, 0.18, 0.42, 16]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
              </mesh>
              {/* Radiator cooling fins */}
              {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((fAngle, fi) => (
                <mesh key={fi} rotation={[0, fAngle, 0]}>
                  <boxGeometry args={[0.48, 0.36, 0.02]} />
                  <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} wireframe={wireframe} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

/**
 * The Pioneer Golden Plaque
 */
export function PioneerPlaque3D({ wireframe = false, scale = 1 }: ArtifactProps) {
  return (
    <group scale={scale} dispose={null}>
      {/* 6x9 inch Gold-anodized aluminum plaque */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.0, 0.04]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.95}
          roughness={0.18}
          wireframe={wireframe}
        />
      </mesh>
      {/* Engraved pulsar map center radial burst */}
      <mesh position={[-0.3, 0.05, 0.025]}>
        <ringGeometry args={[0.02, 0.25, 16]} />
        <meshBasicMaterial color="#78350f" wireframe={true} />
      </mesh>
      {/* Human figures silhouette imprint */}
      <mesh position={[0.35, 0.05, 0.025]}>
        <planeGeometry args={[0.35, 0.65]} />
        <meshBasicMaterial color="#92400e" transparent opacity={0.8} />
      </mesh>
      {/* Hyperfine transition of neutral hydrogen symbol */}
      <mesh position={[-0.3, 0.35, 0.025]}>
        <ringGeometry args={[0.04, 0.08, 16]} />
        <meshBasicMaterial color="#78350f" wireframe={true} />
      </mesh>
    </group>
  );
}

/**
 * Pioneer Quadraspherical Plasma Analyzer
 */
export function PioneerPlasmaAnalyzer3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const plateOffset = explode * 0.35;

  return (
    <group scale={scale} dispose={null}>
      {/* Curved electrostatic analyzer dome */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.38, 24, 16, 0, Math.PI, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} wireframe={wireframe} />
      </mesh>
      {/* Curved deflection plates */}
      <mesh position={[0, 0.1 + plateOffset, 0.15]}>
        <torusGeometry args={[0.22, 0.04, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>
      {/* Base flange mount */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * Pioneer Helium Vector Magnetometer Boom
 */
export function PioneerMagnetometerBoom3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const sensorOffset = explode * 0.5;

  return (
    <group scale={scale} dispose={null}>
      {/* 6.6m folding fiberglass mast */}
      <mesh position={[0, 0, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.4, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.3} roughness={0.6} wireframe={wireframe} />
      </mesh>
      {/* Spherical Helium Gas Cell Sensor at boom tip */}
      <mesh position={[0, 0, 0.2 + sensorOffset]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.15} wireframe={wireframe} />
      </mesh>
      {/* Infrared optical pumping lamp housing */}
      <mesh position={[0, 0.22, 0.2 + sensorOffset]}>
        <cylinderGeometry args={[0.06, 0.06, 0.18, 12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * Pioneer Interstellar Dust & Cosmic Ray Telescope
 */
export function PioneerInterstellarDust3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const detOffset = explode * 0.35;

  return (
    <group scale={scale} dispose={null}>
      {/* Main telescope canister */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.55, 20]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.25} wireframe={wireframe} />
      </mesh>
      {/* Silicon solid-state detector rings */}
      {[-0.1, 0.1].map((y, i) => (
        <mesh key={i} position={[0, y + (i === 1 ? detOffset : 0), 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.15} wireframe={wireframe} />
        </mesh>
      ))}
      {/* Front dust impact grid sensor */}
      <mesh position={[0, 0.3 + detOffset, 0]}>
        <ringGeometry args={[0.05, 0.2, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/* =========================================================================
 * 4. Kepler Space Telescope (Earth-Trailing Orbit — 2009-2018)
 * ========================================================================= */

/**
 * Kepler 0.95m Schmidt Photometer Telescope Tube
 */
export function KeplerPhotometer3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const mirrorOffset = explode * 0.45;
  const ccdOffset = explode * 0.35;

  return (
    <group scale={scale} dispose={null}>
      {/* Carbon fiber cylindrical telescope barrel */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 1.9, 32, 1, true]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.4}
          metalness={0.8}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>

      {/* 1.4-meter primary mirror at bottom base */}
      <mesh position={[0, -0.9 - mirrorOffset, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.08, 32]} />
        <meshStandardMaterial color="#e0f2fe" metalness={0.98} roughness={0.05} wireframe={wireframe} />
      </mesh>

      {/* Curved 42-CCD Focal Plane Array in center */}
      <group position={[0, 0.2 + ccdOffset, 0]}>
        <mesh>
          <boxGeometry args={[0.48, 0.06, 0.48]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* Silicon CCD grid tiles */}
        <mesh position={[0, 0.04, 0]}>
          <planeGeometry args={[0.42, 0.42]} />
          <meshStandardMaterial color="#0369a1" metalness={0.92} roughness={0.1} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Kepler Curved Carbon-Fiber Sunshade Baffle
 */
export function KeplerSolarHood3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const hoodOffset = explode * 0.4;

  return (
    <group scale={scale} dispose={null}>
      {/* Angled sunshade hood cut at 45 degrees */}
      <mesh position={[0, 0.5 + hoodOffset, 0]} rotation={[0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.68, 0.68, 1.1, 32, 1, true]} />
        <meshStandardMaterial
          color="#020617"
          roughness={0.6}
          metalness={0.6}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>
      {/* Specular lip ring */}
      <mesh position={[0, 0.95 + hoodOffset, -0.2]} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[0.68, 0.02, 8, 32]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * Kepler Reaction Wheel Assembly
 */
export function KeplerReactionWheels3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const wheelOffset = explode * 0.35;

  return (
    <group scale={scale} dispose={null}>
      {/* Pyramidal structural mount */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.65, 0.15, 0.65]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* Four Precision Momentum Reaction Wheels in tetrahedral pyramid geometry */}
      {[
        [0.2, 0.1, 0.2, 0.5, 0.5],
        [-0.2, 0.1, 0.2, 0.5, -0.5],
        [0.2, 0.1, -0.2, -0.5, 0.5],
        [-0.2, 0.1, -0.2, -0.5, -0.5],
      ].map(([x, y, z, rx, rz], i) => (
        <group
          key={i}
          position={[
            (x as number) * (1 + wheelOffset),
            (y as number) + wheelOffset * 0.3,
            (z as number) * (1 + wheelOffset),
          ]}
          rotation={[rx as number, 0, rz as number]}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.09, 24]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} wireframe={wireframe} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
            <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.2} wireframe={wireframe} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Kepler Curved Body-Mounted Solar Panels
 */
export function KeplerSolarArray3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const panelOffset = explode * 0.45;
  const solarTex = useMemo(() => getSolarPanelTexture(), []);

  return (
    <group scale={scale} dispose={null}>
      {/* Curved body panel wrapping the sun-facing side */}
      <mesh position={[0, 0, panelOffset]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.72, 1.5, 24, 1, true, 0, Math.PI]} />
        <meshStandardMaterial
          map={solarTex}
          color="#0369a1"
          metalness={0.9}
          roughness={0.15}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>
      {/* Silver thermal radiators on back */}
      <mesh position={[0, 0, -panelOffset]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.71, 0.71, 1.45, 24, 1, true, 0, Math.PI]} />
        <meshStandardMaterial
          color="#f8fafc"
          metalness={0.85}
          roughness={0.2}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

/**
 * Kepler High-Gain Communications Antenna
 */
export function KeplerLgaDish3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const dishOffset = explode * 0.4;

  return (
    <group scale={scale} dispose={null}>
      {/* Articulated gimbal boom */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
        <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} wireframe={wireframe} />
      </mesh>
      {/* Parabolic reflector dish */}
      <mesh position={[0, 0.1 + dishOffset, 0]} rotation={[0.5, 0, 0]} castShadow>
        <sphereGeometry args={[0.5, 24, 12, 0, Math.PI * 2, 0, 0.65]} />
        <meshStandardMaterial
          color="#f1f5f9"
          metalness={0.65}
          roughness={0.25}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>
      {/* Feed horn */}
      <mesh position={[0, 0.35 + dishOffset, 0.15]}>
        <cylinderGeometry args={[0.03, 0.03, 0.25, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * Kepler Gold Kapton MLI Equipment Enclosure
 */
export function KeplerGoldFoilBody3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const boxOffset = explode * 0.35;
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);

  return (
    <group scale={scale} dispose={null}>
      {/* Gold Kapton MLI wrapped hexagonal equipment bay */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.75, 1.2, 6]} />
        <meshStandardMaterial
          map={goldKaptonTex}
          color="#d97706"
          roughness={0.26}
          metalness={0.85}
          wireframe={wireframe}
        />
      </mesh>

      {/* Avionics electronics box pods */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x * (1 + boxOffset), 0, 0]} castShadow>
          <boxGeometry args={[0.22, 0.45, 0.35]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} wireframe={wireframe} />
        </mesh>
      ))}

      {/* Hydrazine propellant tank sphere visible inside cutout */}
      <mesh position={[0, 0.2 + boxOffset, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.15} wireframe={wireframe} />
      </mesh>
    </group>
  );
}
