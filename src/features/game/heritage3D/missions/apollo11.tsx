import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { ArtifactProps } from "./shared";
import {
  getAmericanFlagTexture,
  getLRRRTexture,
  getSolarPanelTexture,
  getGoldKaptonTexture,
  getSilverMLITexture,
} from "../textures";

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

export function PSEPSeismometer3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const solarTex = useMemo(() => getSolarPanelTexture(), []);
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const wingExplode = explode * 0.4;

  return (
    <group scale={scale}>
      {/* Central Seismometer Electronics Drum */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.35, 24]} />
        <meshStandardMaterial
          map={goldKaptonTex}
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
          map={goldKaptonTex}
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

export function SolarWindComp3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const poleY = explode * 0.3;
  const foilX = explode * 0.4;

  return (
    <group scale={scale}>
      {/* Telescopic Staff */}
      <group position={[0, poleY, 0]}>
        {/* Main Aluminum Pole */}
        <mesh position={[0, 0.92, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.022, 1.84, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.65} roughness={0.25} wireframe={wireframe} />
        </mesh>
        {/* Telescoping Joint Collars */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.03, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.03, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Top T-Reel Housing */}
        <mesh position={[0, 1.84, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.46, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.22} wireframe={wireframe} />
        </mesh>
        {/* Top Mount Cap */}
        <mesh position={[0, 1.86, 0]}>
          <sphereGeometry args={[0.024, 12, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* Red Swiss Deployment Pull-Tab */}
        <mesh position={[0.22, 1.84, 0]}>
          <boxGeometry args={[0.01, 0.025, 0.02]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Hanging Swiss Platinum-Aluminum Foil Sheet */}
      <group position={[foilX, poleY, 0]}>
        {/* Front & Back Gleaming Foil Face */}
        <mesh position={[0.18, 1.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.36, 1.32, 0.008]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.5}
            roughness={0.28}
            emissive="#334155"
            emissiveIntensity={0.2}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
        {/* Subtle Reinforcement Seam Lines for Authentic Wrinkled Foil Sheen */}
        {[-0.09, 0, 0.09].map((xOffset, idx) => (
          <mesh key={idx} position={[0.18 + xOffset, 1.15, 0.005]}>
            <boxGeometry args={[0.004, 1.30, 0.002]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.2} wireframe={wireframe} />
          </mesh>
        ))}
        {/* Top Attachment Flange */}
        <mesh position={[0.18, 1.82, 0]}>
          <boxGeometry args={[0.36, 0.015, 0.012]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* Bottom Tension Weight Bar */}
        <mesh position={[0.18, 0.48, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.38, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} wireframe={wireframe} />
        </mesh>
        {/* Bottom Knurled End-Plugs */}
        <mesh position={[-0.01, 0.48, 0]}>
          <sphereGeometry args={[0.016, 10, 10]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.3} wireframe={wireframe} />
        </mesh>
        <mesh position={[0.37, 0.48, 0]}>
          <sphereGeometry args={[0.016, 10, 10]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

export function MESA3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const shelfY = explode * 0.25;
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const silverMLITex = useMemo(() => getSilverMLITexture(), []);

  return (
    <group scale={scale}>
      {/* Outer Descent Stage Quad Structural Frame */}
      <mesh position={[0, 0.5, -0.15]} castShadow>
        <boxGeometry args={[1.1, 1.0, 0.2]} />
        <meshStandardMaterial
          map={goldKaptonTex}
          color="#d4a338"
          metalness={0.92}
          roughness={0.25}
          wireframe={wireframe}
        />
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
          <meshStandardMaterial
            map={silverMLITex}
            color="#f1f5f9"
            metalness={0.95}
            roughness={0.15}
            wireframe={wireframe}
          />
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
          <meshStandardMaterial
            map={goldKaptonTex}
            color="#e5b842"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

export function LunarModuleDescentStage3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const { scene } = useGLTF("/models/lm-descent.glb");
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (wireframe) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: "#44eeff",
            emissive: "#0088cc",
            emissiveIntensity: 0.4,
            wireframe: true,
          });
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [cloned, wireframe]);

  return (
    <group scale={scale}>
      <primitive object={cloned} position={[0, -explode * 0.3, 0]} />
    </group>
  );
}
