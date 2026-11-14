import { useMemo } from "react";
import * as THREE from "three";
import {
  getAmericanFlagTexture,
  getLRRRTexture,
  getDukeFamilyPhotoTexture,
  getSolarPanelTexture,
} from "./textures";

interface ArtifactProps {
  explode?: number;
  wireframe?: boolean;
  scale?: number;
}

/**
 * 1. American Flag planted on the Moon (Apollo 11, 12, 14, 15, 16, 17)
 * Authentic 3x5 ft flag with telescoping crossbar, gold finial, and rippled fabric
 */
export function AmericanFlag3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const flagTex = useMemo(() => getAmericanFlagTexture(), []);

  // Fabric geometry with realistic Apollo horizontal wave ripple
  const fabricGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1.5, 0.9, 24, 12);
    const pos = geo.attributes.position;
    if (!pos) return geo;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const wave = Math.sin((x + 0.75) * 5.0) * 0.045 + Math.cos((x + 0.75) * 2.5) * 0.02;
      pos.setZ(i, wave);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const staffY = explode * 0.4;
  const flagX = explode * 0.6;

  return (
    <group scale={scale}>
      {/* Vertical Aluminum Staff (approx 2.3m high) */}
      <group position={[0, staffY, 0]}>
        {/* Lower pole section */}
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.022, 0.025, 1.4, 16]} />
          <meshStandardMaterial
            color="#d1d5db"
            metalness={0.85}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Telescopic upper pole section with coupler */}
        <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.9, 16]} />
          <meshStandardMaterial
            color="#e5e7eb"
            metalness={0.88}
            roughness={0.18}
            wireframe={wireframe}
          />
        </mesh>
        {/* Coupler ring */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.04, 16]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.15} wireframe={wireframe} />
        </mesh>
        {/* Gold Anodized Top Finial Cap */}
        <mesh position={[0, 2.16, 0]} castShadow>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={0.92}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
        {/* Regolith Soil Mound at Base */}
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <coneGeometry args={[0.22, 0.07, 16]} />
          <meshStandardMaterial color="#555860" roughness={0.98} metalness={0.0} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Horizontal Spreader Crossbar */}
      <group position={[flagX * 0.5, 2.12 + staffY, 0]}>
        <mesh position={[0.76, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 1.54, 12]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.85}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
        {/* Hinge latch mount */}
        <mesh position={[0.01, 0, 0]}>
          <boxGeometry args={[0.03, 0.035, 0.03]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Flag Fabric with double-sided Stars & Stripes */}
      <group position={[0.76 + flagX, 1.67 + staffY, 0]}>
        <mesh geometry={fabricGeo} castShadow receiveShadow>
          <meshStandardMaterial
            map={wireframe ? undefined : flagTex}
            color={wireframe ? "#00eeff" : "#ffffff"}
            roughness={0.75}
            metalness={0.05}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 2. Westinghouse Lunar TV Camera on Tripod (Apollo 11)
 * Authentic black & white camera body with gold thermal wrap, lens, and 3-legged tripod
 */
export function TVCamera3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const tripodY = -explode * 0.3;
  const cameraY = 0.95 + explode * 0.4;
  const lensZ = 0.22 + explode * 0.5;

  return (
    <group scale={scale}>
      {/* 3-Legged Aluminum Tripod */}
      <group position={[0, tripodY, 0]}>
        {/* Center mounting hub */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* 3 Tripod legs spaced at 120° */}
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => {
          const legLen = 1.05;
          const spreadR = 0.45;
          const lx = Math.cos(angle) * (spreadR * 0.5);
          const lz = Math.sin(angle) * (spreadR * 0.5);
          const footX = Math.cos(angle) * spreadR;
          const footZ = Math.sin(angle) * spreadR;

          return (
            <group key={i}>
              <mesh
                position={[lx, 0.46, lz]}
                rotation={[Math.sin(angle) * 0.4, 0, -Math.cos(angle) * 0.4]}
                castShadow
              >
                <cylinderGeometry args={[0.015, 0.012, legLen, 8]} />
                <meshStandardMaterial
                  color="#94a3b8"
                  metalness={0.85}
                  roughness={0.25}
                  wireframe={wireframe}
                />
              </mesh>
              {/* Spreader bar */}
              <mesh position={[lx * 0.7, 0.3, lz * 0.7]} rotation={[0, -angle, 0]}>
                <boxGeometry args={[spreadR * 0.4, 0.008, 0.008]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} wireframe={wireframe} />
              </mesh>
              {/* Tripod footpad */}
              <mesh position={[footX, 0.01, footZ]}>
                <cylinderGeometry args={[0.035, 0.035, 0.015, 12]} />
                <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.5} wireframe={wireframe} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Pan / Tilt Mounting Head & Handle */}
      <group position={[0, cameraY - 0.04, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.035, 0.045, 0.06, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* Aiming handle pointing back */}
        <mesh position={[0, -0.01, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.18, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.6} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Camera Housing Body */}
      <group position={[0, cameraY + 0.08, 0]}>
        {/* Upper black textured camera body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.16, 0.28]} />
          <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.6} wireframe={wireframe} />
        </mesh>
        {/* Lower gold Kapton MLI thermal blanket wrap */}
        <mesh position={[0, -0.06, 0]} castShadow>
          <boxGeometry args={[0.225, 0.05, 0.285]} />
          <meshStandardMaterial
            color="#d97706"
            metalness={0.92}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Top carrying handle */}
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[0.06, 0.04, 0.14]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Optical Lens Barrel Assembly */}
      <group position={[0, cameraY + 0.08, lensZ]}>
        {/* Conical lens barrel */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.045, 0.14, 24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* Aperture ring */}
        <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.058, 0.058, 0.02, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Front glass lens element with blue anti-reflective sheen */}
        <mesh position={[0, 0, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.05, 24]} />
          <meshStandardMaterial
            color="#38bdf8"
            metalness={0.9}
            roughness={0.1}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 3. Laser Ranging Retroreflector (LRRR - Apollo 11, 14, 15, 17)
 * 100 quartz corner-cube prisms in 45-degree angled white pallet with leveling bubble & shadow pin
 */
export function LaserRetroreflector3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const lrrrTex = useMemo(() => getLRRRTexture(), []);
  const panelY = 0.28 + explode * 0.4;
  const mountY = explode * -0.2;

  return (
    <group scale={scale}>
      {/* Supporting Pedestal & Adjustable Mounting Legs */}
      <group position={[0, mountY, 0]}>
        {/* Bottom regolith footprint frame */}
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <boxGeometry args={[0.65, 0.03, 0.65]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* Tubular leveling legs */}
        {([[-0.26, -0.26], [0.26, -0.26], [0, 0.26]] as [number, number][]).map(([x, z], i) => (
          <mesh key={i} position={[x, 0.14, z]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.22, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} wireframe={wireframe} />
          </mesh>
        ))}
        {/* Universal swivel joint */}
        <mesh position={[0, 0.24, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} wireframe={wireframe} />
        </mesh>
      </group>

      {/* 45-degree Angled Retroreflector Panel */}
      <group position={[0, panelY, 0]} rotation={[-Math.PI / 4, 0, 0]}>
        {/* White thermal control aluminum pallet frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.54, 0.54, 0.08]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.4}
            roughness={0.35}
            wireframe={wireframe}
          />
        </mesh>

        {/* 10x10 Quartz Prism Array Front Face */}
        <mesh position={[0, 0, 0.042]} castShadow receiveShadow>
          <planeGeometry args={[0.48, 0.48]} />
          <meshStandardMaterial
            map={wireframe ? undefined : lrrrTex}
            color={wireframe ? "#00ffff" : "#ffffff"}
            metalness={0.7}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>

        {/* Leveling bubble vial on corner */}
        <mesh position={[0.23, 0.23, 0.05]}>
          <cylinderGeometry args={[0.015, 0.015, 0.04, 12]} />
          <meshStandardMaterial color="#22c55e" metalness={0.3} roughness={0.2} wireframe={wireframe} />
        </mesh>

        {/* Shadow-pin sun compass gnomon */}
        <mesh position={[-0.22, 0.22, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.06, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 4. Passive Seismic Experiment Package (PSEP - Apollo 11)
 * Central cylinder electronics drum, gold thermal skirt, and fold-out solar array wings
 */
export function PSEPSeismometer3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const solarTex = useMemo(() => getSolarPanelTexture(), []);
  const wingExplode = explode * 0.4;

  return (
    <group scale={scale}>
      {/* Central Seismometer Electronics Drum */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.35, 24]} />
        <meshStandardMaterial
          color="#d97706"
          metalness={0.92}
          roughness={0.18}
          wireframe={wireframe}
        />
      </mesh>
      {/* Top thermal dome cover */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.85} roughness={0.2} wireframe={wireframe} />
      </mesh>
      {/* Omni-directional helical antenna mast */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.45, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>
      <mesh position={[0, 0.88, 0]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>
      {/* Gold Mylar thermal fringe skirt on ground */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.48, 24]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.9}
          roughness={0.22}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>

      {/* Left Wing Solar Panel */}
      <group position={[-0.45 - wingExplode, 0.28, 0]} rotation={[0, 0, 0.25]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.02, 0.62]} />
          <meshStandardMaterial
            map={wireframe ? undefined : solarTex}
            color={wireframe ? "#00ffff" : "#ffffff"}
            metalness={0.8}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Support hinge arm */}
        <mesh position={[0.22, -0.04, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Right Wing Solar Panel */}
      <group position={[0.45 + wingExplode, 0.28, 0]} rotation={[0, 0, -0.25]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.02, 0.62]} />
          <meshStandardMaterial
            map={wireframe ? undefined : solarTex}
            color={wireframe ? "#00ffff" : "#ffffff"}
            metalness={0.8}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Support hinge arm */}
        <mesh position={[-0.22, -0.04, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 5. Solar Wind Composition Experiment (SWC - Apollo 11)
 * Ultra-pure reflective aluminum foil sheet on telescoping pole
 */
export function SolarWindComp3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const poleY = explode * 0.3;
  const foilX = explode * 0.4;

  return (
    <group scale={scale}>
      {/* Telescopic Staff */}
      <group position={[0, poleY, 0]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.02, 1.8, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} wireframe={wireframe} />
        </mesh>
        {/* Top reel housing */}
        <mesh position={[0, 1.82, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.44, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Hanging Foil Sheet */}
      <group position={[foilX, poleY, 0]}>
        <mesh position={[0.18, 1.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.36, 1.25, 0.005]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.96}
            roughness={0.08}
            wireframe={wireframe}
          />
        </mesh>
        {/* Bottom tension weight bar */}
        <mesh position={[0.18, 0.52, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.38, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 6. Alan Shepard's Golf Balls & 6-Iron Club (Apollo 14)
 * Two dimpled white golf balls on regolith and improvised Wilson 6-iron club head on extension handle
 */
export function GolfBallsClub3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const clubY = explode * 0.4;

  return (
    <group scale={scale}>
      {/* First Golf Ball */}
      <mesh position={[-0.15, 0.025, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.025, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* Second Golf Ball (further out) */}
      <mesh position={[0.32, 0.025, 0.18]} castShadow receiveShadow>
        <sphereGeometry args={[0.025, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* Alan Shepard's 6-Iron Club */}
      <group position={[0.05, 0.12 + clubY, -0.08]} rotation={[0.4, 0.2, -0.85]}>
        {/* Shaft / Extension Handle */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.009, 0.012, 0.95, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} wireframe={wireframe} />
        </mesh>
        {/* Chrome Hosel joint */}
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.012, 0.014, 0.06, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.12} wireframe={wireframe} />
        </mesh>
        {/* 6-Iron Forged Blade Head with Loft Angle */}
        <mesh position={[0.045, -0.04, 0]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[0.09, 0.045, 0.018]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.95}
            roughness={0.12}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 7. Charlie Duke's Family Photo (Apollo 16)
 * Plastic shrink-wrapped color photograph left on Descartes Highlands regolith
 */
export function FamilyPhoto3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const photoTex = useMemo(() => getDukeFamilyPhotoTexture(), []);
  const wrapY = explode * 0.25;

  return (
    <group scale={scale}>
      {/* Photograph Board */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0.18]} castShadow receiveShadow>
        <planeGeometry args={[0.32, 0.24]} />
        <meshStandardMaterial
          map={wireframe ? undefined : photoTex}
          color={wireframe ? "#00ffff" : "#ffffff"}
          roughness={0.25}
          metalness={0.1}
          wireframe={wireframe}
        />
      </mesh>

      {/* Clear Plastic Shrink-Wrap Envelope */}
      <group position={[0, wrapY, 0]}>
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0.18]}>
          <planeGeometry args={[0.36, 0.28]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={wireframe ? 0.3 : 0.22}
            roughness={0.1}
            metalness={0.15}
            wireframe={wireframe}
          />
        </mesh>
        {/* Shrink-wrap seal crimp border */}
        <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0.18]}>
          <ringGeometry args={[0.15, 0.18, 4]} />
          <meshStandardMaterial
            color="#94a3b8"
            transparent
            opacity={0.35}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 8. Fallen Astronaut Memorial & Plaque (Apollo 15)
 * 8.5cm solid aluminum stylized astronaut statuette & engraved plaque
 */
export function FallenAstronaut3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const plaqueX = 0.16 + explode * 0.3;
  const statuetteY = explode * 0.2;

  return (
    <group scale={scale}>
      {/* 8.5cm Stylized Cast Aluminum Astronaut Statuette (Paul Van Hoeydonck) */}
      <group position={[-0.08, 0.02 + statuetteY, 0]} rotation={[0, 0.3, Math.PI / 2]}>
        {/* Torso */}
        <mesh castShadow>
          <boxGeometry args={[0.045, 0.085, 0.025]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} wireframe={wireframe} />
        </mesh>
        {/* Spherical Helmet Visor */}
        <mesh position={[0, 0.065, 0]} castShadow>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} wireframe={wireframe} />
        </mesh>
        {/* Tapered Legs */}
        <mesh position={[0, -0.07, 0]}>
          <cylinderGeometry args={[0.016, 0.012, 0.08, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Aluminum Memorial Plaque listing 14 fallen heroes */}
      <group position={[plaqueX, 0.015, 0]} rotation={[-Math.PI / 2, 0, -0.15]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.18, 0.24, 0.008]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.88}
            roughness={0.22}
            wireframe={wireframe}
          />
        </mesh>
        {/* Engraved name lines */}
        {[...Array(14)].map((_, idx) => (
          <mesh key={idx} position={[0, 0.09 - idx * 0.013, 0.005]}>
            <boxGeometry args={[0.14, 0.004, 0.001]} />
            <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.5} wireframe={wireframe} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * 9. S-Band Deployable Mesh Antenna (Apollo 12)
 * 10-foot collapsible parabolic umbrella mesh dish on tripod pedestal
 */
export function SBandAntenna3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const dishY = 1.25 + explode * 0.4;

  return (
    <group scale={scale}>
      {/* Tripod Stand */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 1.2, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * 0.35, 0.28, Math.sin(a) * 0.35]}
          rotation={[Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4]}
        >
          <cylinderGeometry args={[0.015, 0.012, 0.65, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
      ))}

      {/* Parabolic Mesh Umbrella Dish */}
      <group position={[0, dishY, 0]} rotation={[0.4, 0.2, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.85, 24, 16, 0, Math.PI * 2, 0, Math.PI / 3]} />
          <meshStandardMaterial
            color="#cbd5e1"
            wireframe={true}
            metalness={0.9}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Central feed horn */}
        <mesh position={[0, 0.45, 0]}>
          <coneGeometry args={[0.045, 0.12, 12]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 10. MET Cart - Modular Equipment Transporter (Apollo 14)
 * Two-wheeled lunar rickshaw with rubber tires and tubular aluminum frame
 */
export function METCart3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const wheelExplode = explode * 0.3;

  return (
    <group scale={scale}>
      {/* Main Aluminum Chassis Box */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.65, 0.25, 0.85]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Tow Handle */}
      <group position={[0, 0.4, -0.55]} rotation={[-0.45, 0, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.75, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* Triangular grip handle */}
        <mesh position={[0, 0.75, 0]}>
          <torusGeometry args={[0.08, 0.012, 8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.5} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Two Pneumatic Rubber Wheels */}
      {[-0.4 - wheelExplode, 0.4 + wheelExplode].map((x, i) => (
        <group key={i} position={[x, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          {/* Black Rubber Tire */}
          <mesh castShadow receiveShadow>
            <torusGeometry args={[0.2, 0.07, 16, 24]} />
            <meshStandardMaterial color="#1e293b" roughness={0.85} metalness={0.1} wireframe={wireframe} />
          </mesh>
          {/* Silver Spoked Wheel Hub */}
          <mesh>
            <cylinderGeometry args={[0.14, 0.14, 0.04, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} wireframe={wireframe} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 11. Orange Soil Discovery Trench & Gnomon (Apollo 17)
 * Shorty Crater trench with vibrant volcanic pyroclastic glass beads
 */
export function OrangeSoil3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const gnomonY = explode * 0.3;

  return (
    <group scale={scale}>
      {/* Lunar Soil Trench Depression */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.2, 0.8]} />
        <meshStandardMaterial color="#475569" roughness={0.98} metalness={0.05} wireframe={wireframe} />
      </mesh>

      {/* Exposed Vibrant Orange Pyroclastic Glass Bead Deposit */}
      <mesh position={[0.05, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0.1]} receiveShadow>
        <planeGeometry args={[0.65, 0.35, 12, 12]} />
        <meshStandardMaterial
          color="#ea580c"
          roughness={0.65}
          metalness={0.25}
          emissive="#c2410c"
          emissiveIntensity={0.25}
          wireframe={wireframe}
        />
      </mesh>

      {/* Trenching Scoop Tool */}
      <group position={[-0.35, 0.04, 0.15]} rotation={[0.2, 0.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.55, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[0.08, 0.08, 0.04]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Gnomon Color Calibration Rod */}
      <group position={[0.35, 0.22 + gnomonY, -0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.006, 0.006, 0.42, 8]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* Color calibration chips */}
        <mesh position={[0, 0.12, 0.01]}>
          <boxGeometry args={[0.03, 0.06, 0.005]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.4} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 12. MESA (Modular Equipment Stowage Assembly) - Apollo 11
 * Equipment pallet deployed from Quad IV of Eagle descent stage
 */
export function MESA3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const shelfY = explode * 0.25;

  return (
    <group scale={scale}>
      {/* Outer Descent Stage Quad Structural Frame */}
      <mesh position={[0, 0.5, -0.15]} castShadow>
        <boxGeometry args={[1.1, 1.0, 0.2]} />
        <meshStandardMaterial color="#d4a338" metalness={0.92} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Deployable Equipment Stowage Table Pallet */}
      <group position={[0, 0.25 + shelfY, 0.1]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.95, 0.06, 0.65]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>

        {/* Rock Sample Return Containers (SRC Boxes - Silver Al-Li alloy with handles) */}
        <mesh position={[-0.24, 0.14, 0.05]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.25]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.15} wireframe={wireframe} />
        </mesh>
        <mesh position={[-0.24, 0.25, 0.05]}>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>

        {/* TV Camera Stowage Bay & Bracket */}
        <mesh position={[0.22, 0.1, 0.08]} castShadow>
          <boxGeometry args={[0.25, 0.15, 0.22]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} wireframe={wireframe} />
        </mesh>

        {/* Thermal Blanket Silver/Gold Foil Insulation Layers */}
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[0.92, 0.02, 0.62]} />
          <meshStandardMaterial color="#e5b842" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 13. Apollo 12 Hand Tool Carrier (HTC)
 * Anodized tubular aluminum tote frame with sample bags and geology tools
 */
export function HandToolCarrier3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const toolY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Aluminum Tubular Tote Frame */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[0.5, 0.55, 0.3]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.25} wireframe={wireframe} />
      </mesh>
      {/* Central Carry Handle */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* Two White Fabric Sample Collection Bags (Teflon-coated Beta cloth) */}
      <mesh position={[-0.15, 0.28, 0]} castShadow>
        <boxGeometry args={[0.18, 0.35, 0.26]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} metalness={0.05} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.15, 0.28, 0]} castShadow>
        <boxGeometry args={[0.18, 0.35, 0.26]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} metalness={0.05} wireframe={wireframe} />
      </mesh>

      {/* Lunar Geology Hammer */}
      <group position={[0.28, 0.35 + toolY, 0.12]} rotation={[0, 0, 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.3} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.14, 0.04, 0.04]} />
          <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.15} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Spring-loaded Sampling Tongs */}
      <mesh position={[-0.28, 0.3 + toolY, -0.1]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.65, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * 14. Apollo 16 Far UV Camera / Spectrograph
 * Dr. George Carruthers' astronomical camera operated in Orion's shadow
 */
export function UVCamera3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const barrelY = explode * 0.3;

  return (
    <group scale={scale}>
      {/* 3-Legged Tripod Mount */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={deg} position={[0, 0.28, 0]} rotation={[0, rad, 0]}>
            <mesh position={[0.2, -0.15, 0]} rotation={[0, 0, -0.6]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.65, 8]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} wireframe={wireframe} />
            </mesh>
            <mesh position={[0.38, -0.42, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.015, 12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} wireframe={wireframe} />
            </mesh>
          </group>
        );
      })}

      {/* Camera Housing & Schmidt Telescope Barrel */}
      <group position={[0, 0.45 + barrelY, 0]}>
        {/* Main Gold-anodized Spectrograph Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.24, 0.35, 20]} />
          <meshStandardMaterial color="#dfa230" metalness={0.92} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Optical Aperture Schmidt Barrel */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.12, 0.16, 0.16, 20]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} wireframe={wireframe} />
        </mesh>
        {/* Optical Quartz Collector Window */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.01, 16]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} wireframe={wireframe} />
        </mesh>
        {/* Film Canister Drum on side */}
        <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 15. ALSEP Central Station (Apollo 12, 14, 15, 16, 17)
 * Central telemetry processor + SNAP-27 RTG nuclear power generator
 */
export function ALSEPCentralStation3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const rtgDist = 0.6 + explode * 0.4;
  const antennaY = explode * 0.3;

  return (
    <group scale={scale}>
      {/* Central Station Electronics Console Box */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.35, 0.55]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.4} wireframe={wireframe} />
      </mesh>
      {/* Thermal Radiator Louver Plate Top */}
      <mesh position={[0, 0.41, 0]}>
        <boxGeometry args={[0.62, 0.02, 0.62]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* Helical Telemetry Antenna Mast */}
      <group position={[0, 0.55 + antennaY, 0]}>
        <mesh>
          <cylinderGeometry args={[0.01, 0.01, 0.45, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.035, 0.015, 0.12, 12]} />
          <meshStandardMaterial color="#e5b842" metalness={0.88} roughness={0.25} wireframe={wireframe} />
        </mesh>
      </group>

      {/* SNAP-27 Radioisotope Thermoelectric Generator (RTG) */}
      <group position={[rtgDist, 0.18, 0]}>
        {/* Finned Beryllium Radiator Cylinder */}
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.35, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* Cooling Fins around perimeter */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh key={deg} position={[Math.cos(rad) * 0.14, 0, Math.sin(rad) * 0.14]} rotation={[0, -rad, 0]}>
              <boxGeometry args={[0.06, 0.32, 0.008]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
            </mesh>
          );
        })}
        {/* Thermal Hot Core Glow */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.32, 8]} />
          <meshStandardMaterial color="#ea580c" emissive="#c2410c" emissiveIntensity={0.6} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Interconnecting Flat Ribbon Cable on ground */}
      <mesh position={[rtgDist * 0.5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[rtgDist, 0.04]} />
        <meshStandardMaterial color="#e5b842" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

/**
 * 16. Surveyor 3 Lunar Lander (Apollo 12)
 * Triangular soft lander visited by Pete Conrad and Alan Bean
 */
export function Surveyor3Spacecraft3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const mastY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Triangular Aluminum Spaceframe */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.65, 0.4, 3]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.88} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* 3 Outrigger Landing Legs with Circular Footpads */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={deg} position={[0, 0.3, 0]} rotation={[0, rad, 0]}>
            <mesh position={[0.55, -0.15, 0]} rotation={[0, 0, -0.6]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
            </mesh>
            <mesh position={[0.82, -0.32, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.03, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} wireframe={wireframe} />
            </mesh>
          </group>
        );
      })}

      {/* Vertical Solar Mast + Planar Array */}
      <group position={[0, 0.75 + mastY, 0]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.45, 0.6, 0.02]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>

      {/* TV Camera (Retrieved by Apollo 12!) */}
      <group position={[0.22, 0.55, 0.15]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.25, 12]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.85} roughness={0.25} wireframe={wireframe} />
        </mesh>
        <mesh position={[0.04, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.06, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Soil Sampler Arm with Scoop */}
      <group position={[-0.25, 0.35, -0.1]} rotation={[0.4, 0.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, 0.65, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.08, 0.06, 0.06]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 17. Lunar Roving Vehicle (LRV) - Apollo 15, 16, 17
 * The Apollo Lunar Rover with wire mesh wheels, lawn chairs, and high-gain dish
 */
export function LunarRovingVehicle3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const dishY = explode * 0.35;
  const wheelSpread = explode * 0.2;

  const wheels: [number, number, number][] = [
    [-0.65 - wheelSpread, 0.2, 0.55 + wheelSpread],
    [0.65 + wheelSpread, 0.2, 0.55 + wheelSpread],
    [-0.65 - wheelSpread, 0.2, -0.55 - wheelSpread],
    [0.65 + wheelSpread, 0.2, -0.55 - wheelSpread],
  ];

  return (
    <group scale={scale}>
      {/* Aluminum Chassis */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.1, 0.9]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.88} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* 4 Spun-Aluminum Wire Mesh Wheels with Chevron Treads */}
      {wheels.map(([wx, wy, wz], idx) => (
        <group key={idx} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.3} wireframe={wireframe} />
          </mesh>
          {/* Wheel Hub */}
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.14, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} wireframe={wireframe} />
          </mesh>
        </group>
      ))}

      {/* Two Crew Lawn-Chair Seats */}
      <group position={[-0.1, 0.45, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.35, 0.03]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, -0.16, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.35, 0.3, 0.03]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} wireframe={wireframe} />
        </mesh>
      </group>
      <group position={[-0.1, 0.45, -0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.35, 0.03]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, -0.16, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.35, 0.3, 0.03]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Forward Console with T-Handle Controller */}
      <mesh position={[0.25, 0.42, 0]}>
        <boxGeometry args={[0.2, 0.25, 0.15]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* High-Gain Parabolic Umbrella Dish Antenna */}
      <group position={[0.55, 0.75 + dishY, 0.3]} rotation={[0.4, 0.3, 0]}>
        <mesh>
          <cylinderGeometry args={[0.012, 0.012, 0.75, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.05, 0.08, 16]} />
          <meshStandardMaterial color="#e5b842" metalness={0.85} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Color TV Camera on Front Mast */}
      <group position={[0.62, 0.55, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.12, 0.12]} />
          <meshStandardMaterial color="#c29b38" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 18. Lunar Module Descent Stage (Apollo 11-17)
 * Octagonal gold-foiled descent stage with 4 landing pads and descent engine bell
 */
export function LunarModuleDescentStage3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const engineY = -explode * 0.4;
  const legSpread = explode * 0.3;

  return (
    <group scale={scale}>
      {/* Octagonal Main Structure with Gold Kapton Foil Wrap */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.75, 8]} />
        <meshStandardMaterial color="#d4a338" metalness={0.92} roughness={0.22} wireframe={wireframe} />
      </mesh>
      {/* Upper Deck Black/Silver Inconel Thermal Shields */}
      <mesh position={[0, 1.04, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.04, 8]} />
        <meshStandardMaterial color="#1e222a" metalness={0.7} roughness={0.4} wireframe={wireframe} />
      </mesh>

      {/* Central Descent Propulsion Engine (DPS) Bell */}
      <mesh position={[0, 0.15 + engineY, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.68, 0.6, 20]} />
        <meshStandardMaterial color="#2d3036" metalness={0.88} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* 4 Landing Gear Outriggers with Inverted Dish Footpads */}
      {[45, 135, 225, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return (
          <group key={deg}>
            {/* Primary Shock Strut */}
            <mesh position={[cos * (1.6 + legSpread), 0.35, sin * (1.6 + legSpread)]} rotation={[0, -rad, 0.7]}>
              <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
              <meshStandardMaterial color="#e5b842" metalness={0.92} roughness={0.2} wireframe={wireframe} />
            </mesh>
            {/* 37-inch Inverted Dish Footpad */}
            <mesh position={[cos * (2.1 + legSpread), 0.02, sin * (2.1 + legSpread)]}>
              <cylinderGeometry args={[0.34, 0.34, 0.04, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} wireframe={wireframe} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
