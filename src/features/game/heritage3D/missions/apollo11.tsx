import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { ArtifactProps } from "./shared";
import {
  getAmericanFlagTexture,
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

  useEffect(() => {
    return () => {
      fabricGeo.dispose();
    };
  }, [fabricGeo]);

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
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const tripodY = -explode * 0.3;
  const cameraY = 0.95 + explode * 0.4;
  const lensZ = 0.22 + explode * 0.5;

  return (
    <group scale={scale}>
      {/* 3-Legged Aluminum Tripod */}
      <group position={[0, tripodY, 0]}>
        {/* Center mounting hub with pan/tilt lock knob */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.05, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} wireframe={wireframe} />
        </mesh>
        <mesh position={[0.06, 0.9, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.04, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>

        {/* 3 Tripod legs spaced at 120° with disc footpads */}
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
                  metalness={0.88}
                  roughness={0.22}
                  wireframe={wireframe}
                />
              </mesh>
              {/* Spreader tension strut */}
              <mesh position={[lx * 0.7, 0.3, lz * 0.7]} rotation={[0, -angle, 0]}>
                <boxGeometry args={[spreadR * 0.4, 0.008, 0.008]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} wireframe={wireframe} />
              </mesh>
              {/* Circular lunar regolith footpad */}
              <mesh position={[footX, 0.01, footZ]}>
                <cylinderGeometry args={[0.045, 0.05, 0.016, 16]} />
                <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} wireframe={wireframe} />
              </mesh>
            </group>
          );
        })}

        {/* Coiled 100ft rubber telemetry power cable on ground */}
        <mesh position={[0.2, 0.02, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.015, 8, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Pan / Tilt Mounting Head & Aiming Handle */}
      <group position={[0, cameraY - 0.04, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.038, 0.048, 0.065, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} wireframe={wireframe} />
        </mesh>
        {/* Aiming handle pointing back */}
        <mesh position={[0, -0.01, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Camera Housing Body */}
      <group position={[0, cameraY + 0.08, 0]}>
        {/* Upper black textured camera body with Westinghouse electronics */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.16, 0.28]} />
          <meshStandardMaterial color="#18181b" metalness={0.5} roughness={0.5} wireframe={wireframe} />
        </mesh>
        {/* Lower authentic gold Kapton MLI thermal blanket wrap */}
        <mesh position={[0, -0.06, 0]} castShadow>
          <boxGeometry args={[0.228, 0.055, 0.288]} />
          <meshStandardMaterial
            map={goldKaptonTex}
            color="#d97706"
            metalness={0.95}
            roughness={0.16}
            wireframe={wireframe}
          />
        </mesh>
        {/* Top carrying handle and optical gunsight tube */}
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[0.06, 0.04, 0.16]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.25} wireframe={wireframe} />
        </mesh>
        <mesh position={[0.06, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.22, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Optical Lens Barrel Assembly */}
      <group position={[0, cameraY + 0.08, lensZ]}>
        {/* Conical lens barrel with sunshade */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.058, 0.046, 0.15, 24]} />
          <meshStandardMaterial color="#09090b" metalness={0.8} roughness={0.25} wireframe={wireframe} />
        </mesh>
        {/* Knurled ribbed aperture & focus rings */}
        <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.062, 0.062, 0.025, 24]} />
          <meshStandardMaterial color="#a1a1aa" metalness={0.95} roughness={0.18} wireframe={wireframe} />
        </mesh>
        {/* Front glass lens element with deep cyan anti-reflective sheen */}
        <mesh position={[0, 0, 0.076]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.052, 24]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.3}
            metalness={0.95}
            roughness={0.06}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

export function LaserRetroreflector3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const panelY = 0.32 + explode * 0.45;
  const mountY = explode * -0.25;

  // 10x10 array coordinates for authentic 100 quartz retroreflector prisms
  const prismCoords = useMemo(() => {
    const coords: [number, number][] = [];
    const step = 0.046;
    const start = -4.5 * step;
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        coords.push([start + c * step, start + r * step]);
      }
    }
    return coords;
  }, []);

  return (
    <group scale={scale}>
      {/* Supporting Pedestal & Adjustable Mounting Legs */}
      <group position={[0, mountY, 0]}>
        {/* Ground Footprint Support Frame & Leveling Base */}
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <cylinderGeometry args={[0.38, 0.42, 0.04, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} wireframe={wireframe} />
        </mesh>

        {/* 3 Outrigger Telescoping Leveling Legs with Disc Footpads */}
        {[0, 120, 240].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <group key={deg} rotation={[0, rad, 0]}>
              <mesh position={[0.22, 0.12, 0]} rotation={[0, 0, -0.45]} castShadow>
                <cylinderGeometry args={[0.016, 0.016, 0.28, 12]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
              </mesh>
              {/* Circular footpad disc on regolith */}
              <mesh position={[0.32, 0.015, 0]}>
                <cylinderGeometry args={[0.055, 0.06, 0.02, 16]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} wireframe={wireframe} />
              </mesh>
            </group>
          );
        })}

        {/* Swivel Pivot Ball Joint & Elevation Elevation Bracket */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.88} roughness={0.25} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.035, 0.045, 0.14, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>

      {/* 45-degree Angled Retroreflector Pallet Assembly */}
      <group position={[0, panelY, 0]} rotation={[-Math.PI / 4, 0, 0]}>
        {/* Main Solid White Anodized Aerospace Pallet Tray */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.58, 0.58, 0.09]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.35}
            roughness={0.3}
            wireframe={wireframe}
          />
        </mesh>

        {/* Underside Gold Kapton Thermal MLI Blanket Wrap */}
        <mesh position={[0, 0, -0.048]} receiveShadow>
          <boxGeometry args={[0.56, 0.56, 0.01]} />
          <meshStandardMaterial
            map={goldKaptonTex}
            color="#d97706"
            metalness={0.95}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>

        {/* Outer Aluminum Beveled Retaining Rim */}
        <mesh position={[0, 0, 0.046]} castShadow>
          <boxGeometry args={[0.54, 0.54, 0.012]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} wireframe={wireframe} />
        </mesh>

        {/* 100 Individual Recessed Quartz Corner-Cube Prism Cells */}
        <group position={[0, 0, 0.052]}>
          {prismCoords.map(([px, py], idx) => (
            <group key={idx} position={[px, py, 0]}>
              {/* Recessed cylindrical aluminum reflector cup */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.018, 0.018, 0.014, 12]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} wireframe={wireframe} />
              </mesh>
              {/* Corner-cube fused silica prism with optical facet reflection */}
              <mesh position={[0, 0, 0.003]} rotation={[0, 0, (idx % 4) * (Math.PI / 2)]}>
                <cylinderGeometry args={[0.014, 0.008, 0.008, 6]} />
                <meshStandardMaterial
                  color="#e0f2fe"
                  emissive="#0284c7"
                  emissiveIntensity={0.25}
                  metalness={0.85}
                  roughness={0.08}
                  wireframe={wireframe}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* Yellow/Gold Fiberglass Aiming & Carrying Handle on top edge */}
        <group position={[0, 0.31, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.42, 12]} />
            <meshStandardMaterial color="#eab308" metalness={0.65} roughness={0.35} wireframe={wireframe} />
          </mesh>
          <mesh position={[0, 0.2, -0.02]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.03, 0.02, 0.05]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.7} roughness={0.3} wireframe={wireframe} />
          </mesh>
          <mesh position={[0, -0.2, -0.02]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.03, 0.02, 0.05]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.7} roughness={0.3} wireframe={wireframe} />
          </mesh>
        </group>

        {/* Circular Liquid Spirit Level Vial with Crosshairs */}
        <group position={[0.24, 0.24, 0.06]}>
          <mesh>
            <cylinderGeometry args={[0.022, 0.022, 0.016, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.15} wireframe={wireframe} />
          </mesh>
          <mesh position={[0, 0, 0.009]}>
            <circleGeometry args={[0.016, 16]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.4} roughness={0.1} />
          </mesh>
        </group>

        {/* Calibrated Sun Compass Gnomon Shadow Pin */}
        <group position={[-0.23, 0.23, 0.05]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.08, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} wireframe={wireframe} />
          </mesh>
          {/* Degree scale ring */}
          <mesh position={[0, 0, 0.002]}>
            <ringGeometry args={[0.01, 0.03, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.3} wireframe={wireframe} />
          </mesh>
        </group>
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
      {/* Buzz Aldrin's Leveling Bubble Spirit Vial */}
      <group position={[0.12, 0.41, 0.08]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.015, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.008, 0]}>
          <circleGeometry args={[0.015, 12]} />
          <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.5} roughness={0.1} />
        </mesh>
      </group>
      {/* Carrying / Deployment Handle */}
      <group position={[-0.14, 0.42, 0]} rotation={[0, 0, -0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.16, 8]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
      </group>
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

  // Realistic physically-accurate unrolled foil sheet with subtle micro-wrinkles
  const foilGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.38, 1.34, 16, 32);
    const pos = geo.attributes.position;
    if (pos) {
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const x = pos.getX(i);
        // Vertical ripple folds and authentic unrolling creases
        const wave =
          Math.sin(y * 9.0) * 0.012 +
          Math.cos(x * 16.0) * 0.006 +
          Math.sin((x + y) * 22.0) * 0.003;
        pos.setZ(i, wave);
      }
      geo.computeVertexNormals();
    }
    return geo;
  }, []);

  return (
    <group scale={scale}>
      {/* Telescopic Staff planted into lunar regolith */}
      <group position={[0, poleY, 0]}>
        {/* Ground Spike Collar */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.024, 0.012, 0.08, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* Lower Main Aluminum Mast */}
        <mesh position={[0, 0.92, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.022, 1.84, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.85} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Telescoping Joint Detent Collars */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.035, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.035, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Top T-Reel Housing Cylinder */}
        <mesh position={[0.18, 1.84, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.026, 0.026, 0.44, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Top Mast Finial Mount Cap */}
        <mesh position={[0, 1.86, 0]}>
          <sphereGeometry args={[0.024, 12, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.25} wireframe={wireframe} />
        </mesh>
        {/* Red Swiss Deployment Pull-Tab with Cross Emblem */}
        <group position={[0.39, 1.84, 0]}>
          <mesh>
            <boxGeometry args={[0.015, 0.04, 0.03]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} wireframe={wireframe} />
          </mesh>
          <mesh position={[0.009, 0, 0]}>
            <boxGeometry args={[0.002, 0.025, 0.008]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh position={[0.009, 0, 0]}>
            <boxGeometry args={[0.002, 0.008, 0.025]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Hanging Swiss Platinum-Aluminum Foil Sheet */}
      <group position={[foilX, poleY, 0]}>
        {/* Gleaming Platinum-Aluminum Foil with physically-accurate wave displacement */}
        <mesh position={[0.19, 1.15, 0]} geometry={foilGeo} castShadow receiveShadow>
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.92}
            roughness={0.16}
            emissive="#1e293b"
            emissiveIntensity={0.2}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
        {/* Top Reel Attachment Clamp Bar */}
        <mesh position={[0.19, 1.82, 0]}>
          <boxGeometry args={[0.38, 0.015, 0.014]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} wireframe={wireframe} />
        </mesh>
        {/* Bottom Tension Roller Weight Bar */}
        <mesh position={[0.19, 0.48, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.42, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Knurled Stainless Steel End Plugs */}
        <mesh position={[-0.02, 0.48, 0]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.2} wireframe={wireframe} />
        </mesh>
        <mesh position={[0.40, 0.48, 0]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.2} wireframe={wireframe} />
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
