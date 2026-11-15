import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { ArtifactProps } from "./shared";
import {
  getAmericanFlagTexture,
  getSolarPanelTexture,
  getGoldKaptonTexture,
  getSilverMLITexture,
  getBlackInconelTexture,
  getApolloPlaqueTexture,
  getWestinghouseDecalTexture,
  getSRCLabelTexture,
  getLunarRegolithTexture,
} from "../textures";

/* ══════════════════════════════════════════════════════════════════════════════
   1. AMERICAN FLAG (Apollo 11 Tranquility Base)
   3x5 ft nylon flag with horizontal spreader crossbar, permanent ripples,
   anodized aluminum mast, gold finial spearhead, and regolith mound.
   ══════════════════════════════════════════════════════════════════════════════ */
export function AmericanFlag3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const flagTex = useMemo(() => getAmericanFlagTexture(), []);
  const regolithTex = useMemo(() => getLunarRegolithTexture(), []);

  // Fabric geometry with authentic permanent Apollo 11 corrugated ripples
  const fabricGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1.5, 0.9, 32, 16);
    const pos = geo.attributes.position;
    if (pos) {
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        // Realistic vacuum ripples from the stuck horizontal telescoping arm
        const wave1 = Math.sin((x + 0.75) * 5.2) * 0.055;
        const wave2 = Math.cos((x + 0.75) * 2.8 + y * 1.5) * 0.025;
        const crinkle = Math.sin((x * 12.0 + y * 16.0)) * 0.008;
        pos.setZ(i, wave1 + wave2 + crinkle);
      }
      geo.computeVertexNormals();
    }
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      fabricGeo.dispose();
    };
  }, [fabricGeo]);

  const staffY = explode * 0.4;
  const flagX = explode * 0.6;
  const armY = explode * 0.5;

  return (
    <group scale={scale} position={[0, -0.22, 0]}>
      {/* Vertical Aluminum Staff (approx 2.3m high) */}
      <group position={[0, staffY, 0]}>
        {/* Lower tubular pole section planted into lunar regolith */}
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.022, 0.024, 1.3, 16]} />
          <meshStandardMaterial
            color="#d1d5db"
            metalness={0.9}
            roughness={0.18}
            wireframe={wireframe}
          />
        </mesh>

        {/* Telescopic upper pole section */}
        <mesh position={[0, 1.65, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.018, 0.018, 1.0, 16]} />
          <meshStandardMaterial
            color="#e5e7eb"
            metalness={0.92}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>

        {/* Telescoping Coupler Ring Collar */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.045, 16]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.92}
            roughness={0.12}
            wireframe={wireframe}
          />
        </mesh>

        {/* Gold Anodized Top Finial Spearhead / Ball */}
        <mesh position={[0, 2.18, 0]} castShadow>
          <sphereGeometry args={[0.038, 16, 16]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={0.95}
            roughness={0.12}
            wireframe={wireframe}
          />
        </mesh>

        {/* Disturbed Lunar Regolith Mound with Bootprint Tread */}
        <mesh position={[0, 0.035, 0]} receiveShadow>
          <coneGeometry args={[0.26, 0.08, 20]} />
          <meshStandardMaterial
            map={wireframe ? undefined : regolithTex}
            color={wireframe ? "#00ffff" : "#475569"}
            roughness={0.95}
            metalness={0.05}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Horizontal Spreader Crossbar with Top Sleeve Latch */}
      <group position={[flagX * 0.5, 2.13 + armY, 0]}>
        <mesh position={[0.76, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 1.54, 12]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.88}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Hinge Pivot Bracket at Staff Intersection */}
        <mesh position={[0.012, 0, 0]}>
          <boxGeometry args={[0.035, 0.04, 0.035]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.85}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Flag Fabric with double-sided 50-star Stars & Stripes */}
      <group position={[0.76 + flagX, 1.68 + staffY, 0]}>
        <mesh geometry={fabricGeo} castShadow receiveShadow>
          <meshStandardMaterial
            map={wireframe ? undefined : flagTex}
            color={wireframe ? "#00eeff" : "#ffffff"}
            roughness={0.65}
            metalness={0.04}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   2. WESTINGHOUSE LUNAR SURFACE TV CAMERA (Apollo 11)
   Historic slow-scan SSTV camera on 3-legged tubular tripod with gold Kapton
   thermal blanket, black wide-angle lens, optical gunsight, and coiled cable.
   ══════════════════════════════════════════════════════════════════════════════ */
export function TVCamera3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const westinghouseTex = useMemo(() => getWestinghouseDecalTexture(), []);

  const tripodY = -explode * 0.35;
  const cameraY = 0.98 + explode * 0.35;
  const lensZ = 0.24 + explode * 0.5;
  const handleY = 0.12 + explode * 0.3;

  return (
    <group scale={scale}>
      {/* 3-Legged Tubular Aluminum Tripod */}
      <group position={[0, tripodY, 0]}>
        {/* Center Mounting Hub with Pan/Tilt Lock Knob */}
        <mesh position={[0, 0.92, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.88}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Friction Lock T-Bar Knob */}
        <mesh position={[0.065, 0.92, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.05, 12]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.92}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0.09, 0.92, 0]}>
          <boxGeometry args={[0.015, 0.04, 0.015]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* 3 Tripod Legs spaced at 120° with Spreader Struts and Saucer Footpads */}
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => {
          const legLen = 1.08;
          const spreadR = 0.48;
          const lx = Math.cos(angle) * (spreadR * 0.5);
          const lz = Math.sin(angle) * (spreadR * 0.5);
          const footX = Math.cos(angle) * spreadR;
          const footZ = Math.sin(angle) * spreadR;

          return (
            <group key={i}>
              {/* Primary tubular aluminum telescoping leg */}
              <mesh
                position={[lx, 0.47, lz]}
                rotation={[Math.sin(angle) * 0.42, 0, -Math.cos(angle) * 0.42]}
                castShadow
              >
                <cylinderGeometry args={[0.016, 0.013, legLen, 12]} />
                <meshStandardMaterial
                  color="#94a3b8"
                  metalness={0.9}
                  roughness={0.18}
                  wireframe={wireframe}
                />
              </mesh>
              {/* Spreader tension strut */}
              <mesh position={[lx * 0.72, 0.32, lz * 0.72]} rotation={[0, -angle, 0]}>
                <boxGeometry args={[spreadR * 0.42, 0.01, 0.01]} />
                <meshStandardMaterial
                  color="#64748b"
                  metalness={0.8}
                  roughness={0.3}
                  wireframe={wireframe}
                />
              </mesh>
              {/* Circular saucer footpad for lunar regolith */}
              <mesh position={[footX, 0.015, footZ]}>
                <cylinderGeometry args={[0.05, 0.058, 0.02, 16]} />
                <meshStandardMaterial
                  color="#334155"
                  metalness={0.8}
                  roughness={0.35}
                  wireframe={wireframe}
                />
              </mesh>
            </group>
          );
        })}

        {/* Coiled 100ft Rubber Telemetry & Power Umbilical Cable on Ground */}
        <group position={[0.22, 0.02, 0.18]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.18, 0.016, 8, 24]} />
            <meshStandardMaterial color="#18181b" roughness={0.92} wireframe={wireframe} />
          </mesh>
          <mesh position={[0.04, 0.01, 0.02]} rotation={[-Math.PI / 2, 0, 0.4]}>
            <torusGeometry args={[0.14, 0.014, 8, 20]} />
            <meshStandardMaterial color="#18181b" roughness={0.92} wireframe={wireframe} />
          </mesh>
        </group>
      </group>

      {/* Pan / Tilt Gimbal Mounting Head & Aiming Handle */}
      <group position={[0, cameraY - 0.05, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.042, 0.052, 0.07, 16]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.88}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Aiming grip handle pointing rearward */}
        <mesh position={[0, -0.01, -0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 12]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.65}
            roughness={0.4}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Camera Housing Body (Two-Tone Aerospace Casing) */}
      <group position={[0, cameraY + 0.08, 0]}>
        {/* Upper matte white / silver aluminum casing */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.17, 0.3]} />
          <meshStandardMaterial
            color="#f1f5f9"
            metalness={0.7}
            roughness={0.3}
            wireframe={wireframe}
          />
        </mesh>

        {/* Westinghouse Nameplate & Specs Decal on Side Panel */}
        <mesh position={[0.121, 0.01, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.24, 0.12]} />
          <meshStandardMaterial
            map={wireframe ? undefined : westinghouseTex}
            color={wireframe ? "#00ffff" : "#ffffff"}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>

        {/* Lower Crinkled Gold Kapton MLI Thermal Blanket Wrap */}
        <mesh position={[0, -0.065, 0]} castShadow>
          <boxGeometry args={[0.248, 0.065, 0.308]} />
          <meshStandardMaterial
            map={wireframe ? undefined : goldKaptonTex}
            color={wireframe ? "#ffcc00" : "#f59e0b"}
            metalness={0.45}
            roughness={0.3}
            emissive="#b45309"
            emissiveIntensity={0.2}
            wireframe={wireframe}
          />
        </mesh>

        {/* Top U-Shaped Astronaut EVA Glove Carrying Handle */}
        <group position={[0, handleY, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.06, 0.045, 0.18]} />
            <meshStandardMaterial
              color="#64748b"
              metalness={0.85}
              roughness={0.22}
              wireframe={wireframe}
            />
          </mesh>
        </group>

        {/* Optical Gunsight Sight Tube mounted along top right edge */}
        <mesh position={[0.08, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.009, 0.009, 0.24, 12]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.92}
            roughness={0.18}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Optical Lens Barrel Assembly */}
      <group position={[0, cameraY + 0.08, lensZ]}>
        {/* Conical lens barrel with sunshade hood */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.062, 0.048, 0.16, 24]} />
          <meshStandardMaterial
            color="#09090b"
            metalness={0.85}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>

        {/* Knurled ribbed aperture & focus rings */}
        <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.066, 0.066, 0.028, 24]} />
          <meshStandardMaterial
            color="#a1a1aa"
            metalness={0.95}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>

        {/* Front glass lens element with deep cyan anti-reflective sheen */}
        <mesh position={[0, 0, 0.082]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.055, 24]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.35}
            metalness={0.95}
            roughness={0.05}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   3. LASER RANGING RETROREFLECTOR - LRRR (Apollo 11 EASEP)
   100 precision fused-silica corner-cube prisms in 10x10 array, white anodized
   pallet at 45° tilt, sun compass gnomon, circular bubble level, and tripod base.
   ══════════════════════════════════════════════════════════════════════════════ */
export function LaserRetroreflector3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const panelY = 0.35 + explode * 0.45;
  const mountY = -explode * 0.25;
  const handleY = 0.32 + explode * 0.3;

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
          <cylinderGeometry args={[0.4, 0.44, 0.045, 16]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.88}
            roughness={0.22}
            wireframe={wireframe}
          />
        </mesh>

        {/* 3 Outrigger Telescoping Leveling Legs with Disc Footpads */}
        {[0, 120, 240].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <group key={deg} rotation={[0, rad, 0]}>
              <mesh position={[0.24, 0.13, 0]} rotation={[0, 0, -0.46]} castShadow>
                <cylinderGeometry args={[0.016, 0.016, 0.3, 12]} />
                <meshStandardMaterial
                  color="#94a3b8"
                  metalness={0.92}
                  roughness={0.18}
                  wireframe={wireframe}
                />
              </mesh>
              {/* Circular footpad disc on regolith */}
              <mesh position={[0.34, 0.016, 0]}>
                <cylinderGeometry args={[0.06, 0.065, 0.02, 16]} />
                <meshStandardMaterial
                  color="#64748b"
                  metalness={0.75}
                  roughness={0.35}
                  wireframe={wireframe}
                />
              </mesh>
            </group>
          );
        })}

        {/* Swivel Pivot Ball Joint & 45° Elevation Bracket */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.058, 16, 16]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.038, 0.048, 0.14, 16]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.92}
            roughness={0.18}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* 45-degree Angled Retroreflector Pallet Assembly */}
      <group position={[0, panelY, 0]} rotation={[-Math.PI / 4, 0, 0]}>
        {/* Main Solid White Anodized Aerospace Pallet Tray */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.6, 0.095]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.4}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>

        {/* Underside Gold Kapton Thermal MLI Blanket Wrap */}
        <mesh position={[0, 0, -0.05]} receiveShadow>
          <boxGeometry args={[0.58, 0.58, 0.012]} />
          <meshStandardMaterial
            map={wireframe ? undefined : goldKaptonTex}
            color={wireframe ? "#ffcc00" : "#d97706"}
            metalness={0.95}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>

        {/* Outer Aluminum Beveled Retaining Rim */}
        <mesh position={[0, 0, 0.048]} castShadow>
          <boxGeometry args={[0.56, 0.56, 0.014]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.85}
            roughness={0.18}
            wireframe={wireframe}
          />
        </mesh>

        {/* 100 Individual Recessed Quartz Corner-Cube Prism Cells */}
        <group position={[0, 0, 0.054]}>
          {prismCoords.map(([px, py], idx) => (
            <group key={idx} position={[px, py, 0]}>
              {/* Recessed cylindrical aluminum reflector cup */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.019, 0.019, 0.015, 12]} />
                <meshStandardMaterial
                  color="#0f172a"
                  metalness={0.92}
                  roughness={0.18}
                  wireframe={wireframe}
                />
              </mesh>
              {/* Corner-cube fused silica prism with optical facet reflection */}
              <mesh position={[0, 0, 0.004]} rotation={[0, 0, (idx % 4) * (Math.PI / 2)]}>
                <cylinderGeometry args={[0.015, 0.009, 0.009, 6]} />
                <meshStandardMaterial
                  color="#e0f2fe"
                  emissive="#0284c7"
                  emissiveIntensity={0.3}
                  metalness={0.9}
                  roughness={0.06}
                  wireframe={wireframe}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* Yellow/Gold Fiberglass Aiming & Carrying Handle on top edge */}
        <group position={[0, handleY, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.44, 12]} />
            <meshStandardMaterial
              color="#eab308"
              metalness={0.65}
              roughness={0.35}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0, 0.21, -0.02]}>
            <boxGeometry args={[0.03, 0.02, 0.05]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.21, -0.02]}>
            <boxGeometry args={[0.03, 0.02, 0.05]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.75} roughness={0.25} />
          </mesh>
        </group>

        {/* Circular Liquid Spirit Level Vial with Crosshairs */}
        <group position={[0.25, 0.25, 0.062]}>
          <mesh>
            <cylinderGeometry args={[0.024, 0.024, 0.018, 16]} />
            <meshStandardMaterial
              color="#94a3b8"
              metalness={0.92}
              roughness={0.15}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <circleGeometry args={[0.018, 16]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#16a34a"
              emissiveIntensity={0.5}
              roughness={0.1}
            />
          </mesh>
        </group>

        {/* Calibrated Sun Compass Gnomon Shadow Pin */}
        <group position={[-0.24, 0.24, 0.052]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.085, 8]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.92}
              roughness={0.15}
              wireframe={wireframe}
            />
          </mesh>
          {/* Degree scale ring */}
          <mesh position={[0, 0, 0.003]}>
            <ringGeometry args={[0.012, 0.032, 16]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.85}
              roughness={0.25}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   4. PASSIVE SEISMIC EXPERIMENT PACKAGE - PSEP (Apollo 11 EASEP)
   Central gold Kapton sensor drum, white thermal dome, Aldrin spirit level,
   dual blue photovoltaic solar wings, wide gold Mylar skirt, and antenna mast.
   ══════════════════════════════════════════════════════════════════════════════ */
export function PSEPSeismometer3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const solarTex = useMemo(() => getSolarPanelTexture(), []);
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const wingExplode = explode * 0.45;
  const domeY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Central Seismometer Electronics Drum */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.36, 24]} />
        <meshStandardMaterial
          map={wireframe ? undefined : goldKaptonTex}
          color={wireframe ? "#ffaa00" : "#f59e0b"}
          metalness={0.48}
          roughness={0.28}
          emissive="#b45309"
          emissiveIntensity={0.22}
          wireframe={wireframe}
        />
      </mesh>

      {/* Top Spun-Aluminum White Thermal Dome Cover */}
      <mesh position={[0, 0.4 + domeY, 0]} castShadow>
        <sphereGeometry args={[0.21, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#f1f5f9"
          metalness={0.82}
          roughness={0.22}
          wireframe={wireframe}
        />
      </mesh>

      {/* Buzz Aldrin's Leveling Bubble Spirit Vial */}
      <group position={[0.12, 0.42 + domeY, 0.08]}>
        <mesh>
          <cylinderGeometry args={[0.022, 0.022, 0.016, 12]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.92}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.009, 0]}>
          <circleGeometry args={[0.016, 12]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#16a34a"
            emissiveIntensity={0.6}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Gold Anodized Carrying / Deployment Handle */}
      <group position={[-0.14, 0.43 + domeY, 0]} rotation={[0, 0, -0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.009, 0.009, 0.18, 8]} />
          <meshStandardMaterial
            color="#ca8a04"
            metalness={0.85}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Omni-Directional Helical Antenna Mast */}
      <mesh position={[0, 0.68 + domeY * 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.48, 8]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.92}
          roughness={0.15}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0, 0.92 + domeY * 1.5, 0]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.95}
          roughness={0.15}
          wireframe={wireframe}
        />
      </mesh>

      {/* Radioisotope Heater Units (RHUs) on Sides */}
      <mesh position={[0.26, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.07, 12]} />
        <meshStandardMaterial
          map={wireframe ? undefined : goldKaptonTex}
          color="#f59e0b"
          metalness={0.9}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[-0.26, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.07, 12]} />
        <meshStandardMaterial
          map={wireframe ? undefined : goldKaptonTex}
          color="#f59e0b"
          metalness={0.9}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Wide Gold Mylar Thermal Fringe Skirt on Lunar Regolith */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.24, 0.52, 28]} />
        <meshStandardMaterial
          map={wireframe ? undefined : goldKaptonTex}
          color={wireframe ? "#ffaa00" : "#f59e0b"}
          metalness={0.92}
          roughness={0.2}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>

      {/* Left Wing Solar Panel */}
      <group position={[-0.48 - wingExplode, 0.29, 0]} rotation={[0, 0, 0.26]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.44, 0.022, 0.64]} />
          <meshStandardMaterial
            map={wireframe ? undefined : solarTex}
            color={wireframe ? "#00ffff" : "#ffffff"}
            metalness={0.85}
            roughness={0.18}
            wireframe={wireframe}
          />
        </mesh>
        {/* Support hinge arm */}
        <mesh position={[0.23, -0.045, 0]}>
          <cylinderGeometry args={[0.013, 0.013, 0.15, 8]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.85}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Right Wing Solar Panel */}
      <group position={[0.48 + wingExplode, 0.29, 0]} rotation={[0, 0, -0.26]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.44, 0.022, 0.64]} />
          <meshStandardMaterial
            map={wireframe ? undefined : solarTex}
            color={wireframe ? "#00ffff" : "#ffffff"}
            metalness={0.85}
            roughness={0.18}
            wireframe={wireframe}
          />
        </mesh>
        {/* Support hinge arm */}
        <mesh position={[-0.23, -0.045, 0]}>
          <cylinderGeometry args={[0.013, 0.013, 0.15, 8]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.85}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   5. SOLAR WIND COMPOSITION EXPERIMENT - SWC (Apollo 11)
   High-purity platinum-aluminum foil sheet unrolled on telescopic aluminum
   mast, red Swiss cross pull-tab, and stainless steel tension roller bar.
   ══════════════════════════════════════════════════════════════════════════════ */
export function SolarWindComp3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const poleY = explode * 0.35;
  const foilX = explode * 0.45;

  // Realistic physically-accurate unrolled foil sheet with subtle micro-wrinkles
  const foilGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.38, 1.36, 16, 32);
    const pos = geo.attributes.position;
    if (pos) {
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const x = pos.getX(i);
        // Vertical ripple folds and authentic unrolling creases
        const wave =
          Math.sin(y * 8.5) * 0.014 +
          Math.cos(x * 15.0) * 0.007 +
          Math.sin((x + y) * 20.0) * 0.004;
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
          <meshStandardMaterial
            color="#475569"
            metalness={0.92}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
        {/* Lower Main Aluminum Mast */}
        <mesh position={[0, 0.94, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.022, 1.88, 16]} />
          <meshStandardMaterial
            color="#f1f5f9"
            metalness={0.88}
            roughness={0.18}
            wireframe={wireframe}
          />
        </mesh>
        {/* Telescoping Joint Detent Collars */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.038, 16]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.92}
            roughness={0.18}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.038, 16]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.92}
            roughness={0.18}
            wireframe={wireframe}
          />
        </mesh>
        {/* Top T-Reel Housing Cylinder */}
        <mesh position={[0.19, 1.86, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.026, 0.026, 0.44, 16]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.9}
            roughness={0.18}
            wireframe={wireframe}
          />
        </mesh>
        {/* Top Mast Finial Mount Cap */}
        <mesh position={[0, 1.88, 0]}>
          <sphereGeometry args={[0.024, 12, 12]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.92}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Red Swiss Deployment Pull-Tab with Cross Emblem */}
        <group position={[0.4, 1.86, 0]}>
          <mesh>
            <boxGeometry args={[0.015, 0.042, 0.032]} />
            <meshStandardMaterial color="#dc2626" roughness={0.25} wireframe={wireframe} />
          </mesh>
          <mesh position={[0.009, 0, 0]}>
            <boxGeometry args={[0.002, 0.026, 0.008]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh position={[0.009, 0, 0]}>
            <boxGeometry args={[0.002, 0.008, 0.026]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Hanging Swiss Platinum-Aluminum Foil Sheet */}
      <group position={[foilX, poleY, 0]}>
        {/* Gleaming Platinum-Aluminum Foil with physically-accurate wave displacement */}
        <mesh position={[0.19, 1.16, 0]} geometry={foilGeo} castShadow receiveShadow>
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.48}
            roughness={0.22}
            emissive="#64748b"
            emissiveIntensity={0.25}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
        {/* Top Reel Attachment Clamp Bar */}
        <mesh position={[0.19, 1.84, 0]}>
          <boxGeometry args={[0.38, 0.016, 0.014]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.88}
            roughness={0.22}
            wireframe={wireframe}
          />
        </mesh>
        {/* Bottom Tension Roller Weight Bar */}
        <mesh position={[0.19, 0.48, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.42, 16]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.92}
            roughness={0.18}
            wireframe={wireframe}
          />
        </mesh>
        {/* Knurled Stainless Steel End Plugs */}
        <mesh position={[-0.02, 0.48, 0]}>
          <sphereGeometry args={[0.019, 12, 12]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.95}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0.4, 0.48, 0]}>
          <sphereGeometry args={[0.019, 12, 12]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.95}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   6. MODULAR EQUIPMENT STOWAGE ASSEMBLY - MESA (Apollo 11 Quad IV)
   Authentic LM Descent Stage Quad IV bay with gold/black MLI thermal blankets,
   adjacent ladder strut with deployment lanyard, hinged aluminum pallet,
   stowed Westinghouse TV camera pointed at ladder, 2 SRC rock boxes with
   toggle latches and handles, lunar sampling tools, and regolith terrain base.
   ══════════════════════════════════════════════════════════════════════════════ */
export function MESA3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const silverMLITex = useMemo(() => getSilverMLITexture(), []);
  const blackInconelTex = useMemo(() => getBlackInconelTexture(), []);
  const srcLabelTex = useMemo(() => getSRCLabelTexture(), []);
  const westinghouseTex = useMemo(() => getWestinghouseDecalTexture(), []);
  const regolithTex = useMemo(() => getLunarRegolithTexture(), []);

  const shelfY = explode * 0.2;
  const srcBoxY = explode * 0.45;
  const tvCamY = explode * 0.4;
  const toolY = explode * 0.55;

  return (
    <group scale={scale}>
      {/* ── Ground Regolith Slope Base under LM Quad IV ── */}
      <mesh position={[0, -0.02, 0.15]} receiveShadow>
        <cylinderGeometry args={[0.85, 0.95, 0.05, 24]} />
        <meshStandardMaterial
          map={wireframe ? undefined : regolithTex}
          color={wireframe ? "#00ffff" : "#475569"}
          roughness={0.96}
          metalness={0.04}
          wireframe={wireframe}
        />
      </mesh>

      {/* ── LM Descent Stage Quad IV Recess Structure ── */}
      <group position={[0, 0.65, -0.22]}>
        {/* Main recessed bulkhead with authentic crinkled Gold Kapton MLI thermal blanket */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.15, 1.25, 0.18]} />
          <meshStandardMaterial
            map={wireframe ? undefined : goldKaptonTex}
            color={wireframe ? "#ffcc00" : "#f59e0b"}
            metalness={0.42}
            roughness={0.32}
            emissive="#b45309"
            emissiveIntensity={0.22}
            wireframe={wireframe}
          />
        </mesh>

        {/* Lower Inconel Pyromark black thermal blanket skirt */}
        <mesh position={[0, -0.42, 0.05]} castShadow>
          <boxGeometry args={[1.12, 0.38, 0.04]} />
          <meshStandardMaterial
            map={wireframe ? undefined : blackInconelTex}
            color={wireframe ? "#333333" : "#27272a"}
            metalness={0.35}
            roughness={0.85}
            wireframe={wireframe}
          />
        </mesh>

        {/* Outer Descent Stage Gold Kapton thermal foil patchwork panels */}
        <mesh position={[-0.45, 0.1, 0.06]} castShadow>
          <boxGeometry args={[0.3, 1.15, 0.06]} />
          <meshStandardMaterial
            map={wireframe ? undefined : goldKaptonTex}
            color={wireframe ? "#ffcc00" : "#f59e0b"}
            metalness={0.45}
            roughness={0.3}
            emissive="#b45309"
            emissiveIntensity={0.2}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0.45, 0.1, 0.06]} castShadow>
          <boxGeometry args={[0.3, 1.15, 0.06]} />
          <meshStandardMaterial
            map={wireframe ? undefined : goldKaptonTex}
            color={wireframe ? "#ffcc00" : "#f59e0b"}
            metalness={0.45}
            roughness={0.3}
            emissive="#b45309"
            emissiveIntensity={0.2}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.56, 0.06]} castShadow>
          <boxGeometry args={[1.15, 0.18, 0.06]} />
          <meshStandardMaterial
            map={wireframe ? undefined : goldKaptonTex}
            color={wireframe ? "#ffcc00" : "#f59e0b"}
            metalness={0.45}
            roughness={0.3}
            emissive="#b45309"
            emissiveIntensity={0.2}
            wireframe={wireframe}
          />
        </mesh>

        {/* Structural Aluminum I-Beams and Corner Gussets */}
        <mesh position={[-0.56, 0, 0.08]}>
          <cylinderGeometry args={[0.018, 0.018, 1.22, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.56, 0, 0.08]}>
          <cylinderGeometry args={[0.018, 0.018, 1.22, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Adjacent Forward Landing Gear Strut & Astronaut Ladder (Right Side) ── */}
      <group position={[0.58, 0, -0.05]}>
        {/* Primary tubular landing gear strut wrapped in gold Kapton */}
        <mesh position={[0, 0.75, 0]} rotation={[0, 0, -0.1]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 1.5, 16]} />
          <meshStandardMaterial
            map={wireframe ? undefined : goldKaptonTex}
            color={wireframe ? "#ffaa00" : "#facc15"}
            metalness={0.5}
            roughness={0.28}
            emissive="#ca8a04"
            emissiveIntensity={0.25}
            wireframe={wireframe}
          />
        </mesh>

        {/* Astronaut Nine-Rung Crew Ladder with Tubular Handrails */}
        <group position={[0.08, 0, 0.12]}>
          {/* Left and right vertical ladder stringers */}
          <mesh position={[-0.14, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 1.4, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.15} />
          </mesh>
          <mesh position={[0.14, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 1.4, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.15} />
          </mesh>
          {/* 7 Visible ladder rungs with anti-slip corrugations */}
          {[0.15, 0.32, 0.49, 0.66, 0.83, 1.0, 1.17, 1.34].map((ry, idx) => (
            <mesh key={idx} position={[0, ry, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.009, 0.009, 0.28, 8]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.18} />
            </mesh>
          ))}
          {/* Deployment Lanyard Cable D-Ring on Ladder Porch (Armstrong pull ring) */}
          <group position={[-0.14, 1.25, 0.03]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.024, 0.005, 8, 16]} />
              <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.25} />
            </mesh>
            <mesh position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.003, 0.003, 0.08, 6]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── MESA Fold-Down Equipment Pallet Tray Assembly ── */}
      <group position={[0, 0.32 + shelfY, 0.12]}>
        {/* Main Ribbed Aerospace Aluminum Equipment Table */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.96, 0.05, 0.68]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.88}
            roughness={0.22}
            wireframe={wireframe}
          />
        </mesh>

        {/* Pallet Perimeter Raised Retaining Lip */}
        <mesh position={[0, 0.035, 0.33]}>
          <boxGeometry args={[0.96, 0.04, 0.02]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.47, 0.035, 0]}>
          <boxGeometry args={[0.02, 0.04, 0.68]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.47, 0.035, 0]}>
          <boxGeometry args={[0.02, 0.04, 0.68]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Underside Multi-Layer Insulation Thermal Quilting */}
        <mesh position={[0, -0.032, 0]}>
          <boxGeometry args={[0.94, 0.016, 0.66]} />
          <meshStandardMaterial
            map={wireframe ? undefined : goldKaptonTex}
            color={wireframe ? "#ffcc00" : "#d97706"}
            metalness={0.94}
            roughness={0.16}
            wireframe={wireframe}
          />
        </mesh>

        {/* Heavy-Duty Rear Steel Hinge Brackets */}
        <mesh position={[-0.38, 0, -0.34]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.06, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.92} roughness={0.15} />
        </mesh>
        <mesh position={[0.38, 0, -0.34]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.06, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.92} roughness={0.15} />
        </mesh>

        {/* Dual High-Tensile Steel Suspension Cables (Lanyards) */}
        <mesh position={[-0.44, 0.28, -0.06]} rotation={[0.45, 0, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.68, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0.44, 0.28, -0.06]} rotation={[0.45, 0, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.68, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* ── Sample Return Container 1 (SRC-1 Rock Box) ── */}
        <group position={[-0.24, 0.14 + srcBoxY, 0.04]}>
          {/* Machined aluminum-lithium rock container body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.34, 0.2, 0.26]} />
            <meshStandardMaterial
              map={wireframe ? undefined : silverMLITex}
              color={wireframe ? "#ffffff" : "#f1f5f9"}
              metalness={0.95}
              roughness={0.12}
              wireframe={wireframe}
            />
          </mesh>

          {/* NASA SRC Identification Label on Box Top Lid */}
          <mesh position={[0, 0.102, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 0.22]} />
            <meshStandardMaterial
              map={wireframe ? undefined : srcLabelTex}
              color={wireframe ? "#00ffff" : "#ffffff"}
              roughness={0.25}
              wireframe={wireframe}
            />
          </mesh>

          {/* Dual Stainless Steel Toggle Latches on front face */}
          <mesh position={[-0.1, 0.02, 0.133]}>
            <boxGeometry args={[0.032, 0.05, 0.015]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.1, 0.02, 0.133]}>
            <boxGeometry args={[0.032, 0.05, 0.015]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* Pivoting Wire-Bail Carrying Handle */}
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[0.18, 0.014, 0.02]} />
            <meshStandardMaterial color="#475569" metalness={0.88} roughness={0.2} />
          </mesh>
          <mesh position={[-0.09, 0.11, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.05, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.88} roughness={0.2} />
          </mesh>
          <mesh position={[0.09, 0.11, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.05, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.88} roughness={0.2} />
          </mesh>
        </group>

        {/* ── Stowed Westinghouse Lunar TV Camera (Pointing toward Ladder) ── */}
        <group position={[0.22, 0.12 + tvCamY, 0.06]} rotation={[0, -0.42, 0]}>
          {/* Heavy-Duty Pallet Camera Mounting Bracket */}
          <mesh position={[0, -0.06, 0]} castShadow>
            <boxGeometry args={[0.26, 0.04, 0.28]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Camera Upper White Aluminum Housing */}
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 0.15, 0.26]} />
            <meshStandardMaterial
              color="#f8fafc"
              metalness={0.65}
              roughness={0.3}
              wireframe={wireframe}
            />
          </mesh>

          {/* Westinghouse Decal on Outer Side Panel */}
          <mesh position={[0.101, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.2, 0.1]} />
            <meshStandardMaterial
              map={wireframe ? undefined : westinghouseTex}
              color={wireframe ? "#00ffff" : "#ffffff"}
              roughness={0.2}
              wireframe={wireframe}
            />
          </mesh>

          {/* Camera Lower Gold Kapton Thermal Wrap */}
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.208, 0.05, 0.268]} />
            <meshStandardMaterial
              map={wireframe ? undefined : goldKaptonTex}
              color={wireframe ? "#ffcc00" : "#d97706"}
              metalness={0.95}
              roughness={0.16}
              wireframe={wireframe}
            />
          </mesh>

          {/* Camera Black Optical Lens pointing towards the ladder */}
          <group position={[0, 0.08, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.05, 0.04, 0.11, 20]} />
              <meshStandardMaterial color="#09090b" metalness={0.88} roughness={0.2} />
            </mesh>
            {/* Front cyan antireflective glass lens */}
            <mesh position={[0, 0.056, 0]}>
              <circleGeometry args={[0.042, 16]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0369a1"
                emissiveIntensity={0.35}
                metalness={0.95}
                roughness={0.06}
              />
            </mesh>
          </group>

          {/* Top glove carry handle */}
          <mesh position={[0, 0.18, 0]}>
            <boxGeometry args={[0.05, 0.035, 0.14]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>

        {/* ── Lunar Surface Tool Set (ALHT - Tongs, Scoop & Extension Handle) ── */}
        <group position={[-0.4, 0.08 + toolY, -0.08]}>
          {/* Extension Handle with knurled lock collar stowed in side spring clips */}
          <mesh position={[0, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.52, 12]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.16} />
          </mesh>
          <mesh position={[0.08, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.016, 0.016, 0.04, 12]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* Lunar Sampling Tongs with articulated double fingers */}
          <group position={[0.06, 0.06, 0.12]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.007, 0.007, 0.44, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0.22, 0.015, 0.01]} rotation={[0, 0, 0.3]}>
              <boxGeometry args={[0.05, 0.008, 0.02]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.18} />
            </mesh>
            <mesh position={[0.22, -0.015, 0.01]} rotation={[0, 0, -0.3]}>
              <boxGeometry args={[0.05, 0.008, 0.02]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.18} />
            </mesh>
          </group>

          {/* Lunar Sample Scoop */}
          <group position={[0.06, 0.06, 0.22]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, 0.38, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.18} />
            </mesh>
            <mesh position={[0.2, 0.01, 0]}>
              <boxGeometry args={[0.08, 0.03, 0.06]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.15} />
            </mesh>
          </group>
        </group>

        {/* ── Stowed Solar Wind Composition (SWC) Roll Canister ── */}
        <group position={[0.02, 0.06 + toolY, -0.22]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.024, 0.024, 0.42, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.18} />
          </mesh>
          {/* Red Swiss pull-tab stowed */}
          <mesh position={[0, 0.2, 0.01]}>
            <boxGeometry args={[0.02, 0.01, 0.03]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   7. EAGLE LUNAR MODULE DESCENT STAGE (Apollo 11)
   Clones NASA official 3D model (lm-descent.glb) and enriches it with museum-grade
   gold/black PBR thermal insulation materials and the historic stainless steel
   Apollo 11 commemorative plaque on the ladder strut.
   ══════════════════════════════════════════════════════════════════════════════ */
export function LunarModuleDescentStage3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const { scene } = useGLTF("/models/lm-descent.glb");
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const blackInconelTex = useMemo(() => getBlackInconelTexture(), []);
  const plaqueTex = useMemo(() => getApolloPlaqueTexture(), []);

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
        } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
          const matName = (mesh.material.name || "").toLowerCase();
          if (matName.includes("kapton") || matName.includes("gold")) {
            mesh.material.map = goldKaptonTex;
            mesh.material.color.set("#fbbf24");
            mesh.material.metalness = 0.45;
            mesh.material.roughness = 0.3;
            mesh.material.emissive.set("#b45309");
            mesh.material.emissiveIntensity = 0.2;
            mesh.material.needsUpdate = true;
          } else if (matName.includes("black") || matName.includes("thermal")) {
            mesh.material.map = blackInconelTex;
            mesh.material.color.set("#18181b");
            mesh.material.metalness = 0.35;
            mesh.material.roughness = 0.85;
            mesh.material.needsUpdate = true;
          } else {
            mesh.material.metalness = Math.max(mesh.material.metalness, 0.85);
            mesh.material.roughness = Math.min(mesh.material.roughness, 0.28);
          }
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [cloned, wireframe, goldKaptonTex, blackInconelTex]);

  const plaqueY = 0.72 - explode * 0.15;
  const plaqueZ = 1.48 + explode * 0.25;

  return (
    <group scale={scale}>
      <primitive object={cloned} position={[0, -explode * 0.3, 0]} />

      {/* Historic Apollo 11 Stainless Steel Commemorative Plaque mounted directly on Ladder Rungs 3 & 4 */}
      {!wireframe && (
        <group position={[-0.75, plaqueY - 0.04, plaqueZ - 0.06]} rotation={[0.14, 0.36, -0.04]}>
          {/* Stainless steel backing plate */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.28, 0.22, 0.012]} />
            <meshStandardMaterial
              map={plaqueTex}
              color="#ffffff"
              metalness={0.92}
              roughness={0.18}
            />
          </mesh>
          {/* Dual mounting brackets clamping to ladder rungs 3 & 4 */}
          <mesh position={[-0.12, 0.09, -0.012]}>
            <boxGeometry args={[0.02, 0.026, 0.016]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.12, 0.09, -0.012]}>
            <boxGeometry args={[0.02, 0.026, 0.016]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.12, -0.09, -0.012]}>
            <boxGeometry args={[0.02, 0.026, 0.016]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.12, -0.09, -0.012]}>
            <boxGeometry args={[0.02, 0.026, 0.016]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      )}
    </group>
  );
}
