import { useMemo } from "react";
import * as THREE from "three";
import type { ArtifactProps } from "./shared";
import {
  getGoldKaptonTexture,
  getSilverMLITexture,
  getMartianRegolithTexture,
  getVikingDeckDecalTexture,
  getVikingCalibrationTargetTexture,
  getVikingThermalShieldTexture,
} from "../textures";

/* ══════════════════════════════════════════════════════════════════════════════
   VIKING 1 HERITAGE 3D MODELS — CHRYSE PLANITIA, MARS (JULY 20, 1976)
   Museum-grade, scientifically authentic PBR models based on NASA/JPL/Martin Marietta
   blueprints, technical reports, and archival surface photography.
   ══════════════════════════════════════════════════════════════════════════════ */

/**
 * 1. VIKING 1 LANDER BODY (v1-lander-body)
 * The first spacecraft to safely touch down and operate long-term on Mars.
 * Features hexagonal titanium chassis, white thermal silicone enamel, gold Kapton MLI,
 * dual SNAP-19 RTGs with beryllium cooling fins, 3 inverted-tripod landing gear with
 * dished footpads, 3 monopropellant descent rocket clusters with 18-nozzle diffusers,
 * facsimile cameras, S-band parabolic dish, and authentic 1976 Bicentennial decals.
 */
export function VikingLanderBody3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const legSpread = explode * 0.4;
  const rtgSpread = explode * 0.35;
  const antennaY = explode * 0.5;
  const engineY = -explode * 0.3;

  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const thermalShieldTex = useMemo(() => getVikingThermalShieldTexture(), []);
  const deckDecalTex = useMemo(() => getVikingDeckDecalTexture(), []);
  const calibTargetTex = useMemo(() => getVikingCalibrationTargetTexture(), []);
  const regolithTex = useMemo(() => getMartianRegolithTexture(), []);

  return (
    <group scale={scale}>
      {/* ── Circular Martian Regolith Base with Landing Scorch Mark ── */}
      <group position={[0, -0.02, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[2.0, 2.1, 0.06, 36]} />
          <meshStandardMaterial
            map={regolithTex}
            color="#b45309"
            roughness={0.94}
            metalness={0.04}
            wireframe={wireframe}
          />
        </mesh>
        {/* Terminal descent rocket blast scorch ring */}
        <mesh position={[0, 0.032, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[0.45, 1.25, 32]} />
          <meshStandardMaterial
            color="#431407"
            roughness={0.96}
            metalness={0.05}
            transparent
            opacity={0.55}
          />
        </mesh>
      </group>

      {/* ── Hexagonal Titanium Main Equipment Bus ── */}
      <group position={[0, 0.56, 0]}>
        {/* Core Titanium Hex Chassis */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.92, 1.02, 0.46, 6]} />
          <meshStandardMaterial
            map={thermalShieldTex}
            color="#f8fafc"
            metalness={0.45}
            roughness={0.28}
            wireframe={wireframe}
          />
        </mesh>

        {/* Top Honeycomb Equipment Deck Plate */}
        <mesh position={[0, 0.235, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.93, 0.93, 0.025, 6]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.65}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>

        {/* Underside Multi-Layer Gold Kapton MLI Thermal Blanket */}
        <mesh position={[0, -0.24, 0]} receiveShadow>
          <cylinderGeometry args={[0.98, 0.88, 0.05, 6]} />
          <meshStandardMaterial
            map={goldKaptonTex}
            color="#d97706"
            metalness={0.48}
            roughness={0.3}
            emissive="#b45309"
            emissiveIntensity={0.2}
            wireframe={wireframe}
          />
        </mesh>

        {/* Side Equipment Bay Gold MLI Insets */}
        {[30, 90, 150, 210, 270, 330].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={deg}
              position={[Math.cos(rad) * 0.88, 0, Math.sin(rad) * 0.88]}
              rotation={[0, rad + Math.PI / 2, 0]}
            >
              <planeGeometry args={[0.42, 0.32]} />
              <meshStandardMaterial
                map={goldKaptonTex}
                color="#f59e0b"
                metalness={0.48}
                roughness={0.28}
                emissive="#b45309"
                emissiveIntensity={0.22}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}

        {/* Official 1976 USA / NASA / Martin Marietta Identification Decal */}
        <mesh position={[0, 0.02, 0.93]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.38, 0.19]} />
          <meshStandardMaterial
            map={deckDecalTex}
            roughness={0.25}
            metalness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Terminal Descent Radar (TDR) Antenna Dome on Underside */}
        <mesh position={[0, -0.28, 0]} castShadow>
          <sphereGeometry args={[0.18, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.85}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* ── 3 Outrigger Inverted-Tripod Landing Gear Assemblies (at 0°, 120°, 240°) ── */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={deg} rotation={[0, rad, 0]}>
            {/* Primary Telescoping Titanium Shock Strut */}
            <mesh position={[0.82 + legSpread, 0.3, 0]} rotation={[0, 0, -0.68]} castShadow>
              <cylinderGeometry args={[0.032, 0.032, 0.9, 16]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.7}
                roughness={0.25}
                wireframe={wireframe}
              />
            </mesh>

            {/* Internal Shock Absorber Cylinder Collar */}
            <mesh position={[0.7 + legSpread * 0.8, 0.38, 0]} rotation={[0, 0, -0.68]}>
              <cylinderGeometry args={[0.042, 0.042, 0.22, 16]} />
              <meshStandardMaterial
                color="#475569"
                metalness={0.85}
                roughness={0.2}
                wireframe={wireframe}
              />
            </mesh>

            {/* Inverted A-Frame Drag Strut 1 */}
            <mesh position={[0.58 + legSpread * 0.55, 0.42, 0.12]} rotation={[0.22, 0, -0.32]}>
              <cylinderGeometry args={[0.016, 0.016, 0.56, 12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.25} />
            </mesh>

            {/* Inverted A-Frame Drag Strut 2 */}
            <mesh position={[0.58 + legSpread * 0.55, 0.42, -0.12]} rotation={[-0.22, 0, -0.32]}>
              <cylinderGeometry args={[0.016, 0.016, 0.56, 12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.25} />
            </mesh>

            {/* 12-inch Circular Dished Footpad */}
            <group position={[1.22 + legSpread, 0.025, 0]}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.22, 0.26, 0.04, 24]} />
                <meshStandardMaterial
                  color="#64748b"
                  metalness={0.6}
                  roughness={0.3}
                  wireframe={wireframe}
                />
              </mesh>
              {/* Footpad Inner Dish Cavity */}
              <mesh position={[0, 0.022, 0]}>
                <cylinderGeometry args={[0.18, 0.18, 0.01, 24]} />
                <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.35} />
              </mesh>
              {/* Ground Contact Sensor Switch Probe */}
              <mesh position={[0, -0.03, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.05, 8]} />
                <meshStandardMaterial
                  color="#eab308"
                  metalness={0.85}
                  roughness={0.2}
                  emissive="#b45309"
                  emissiveIntensity={0.2}
                />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* ── Two SNAP-19 Radioisotope Thermoelectric Generators (RTGs) ── */}
      {[-0.88 - rtgSpread, 0.88 + rtgSpread].map((x, idx) => (
        <group key={idx} position={[x, 0.68, 0]}>
          {/* Aerodynamic Beryllium Wind Cover & Shield */}
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.36, 24]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.72}
              roughness={0.24}
              wireframe={wireframe}
            />
          </mesh>

          {/* Internal Plutonium-238 Fuel Core (Subtle Thermal Radiance) */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.28, 16]} />
            <meshStandardMaterial
              color="#ea580c"
              emissive="#c2410c"
              emissiveIntensity={0.4}
              roughness={0.4}
            />
          </mesh>

          {/* 8 Radial Heat-Dissipating Beryllium Radiator Fins */}
          {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <mesh key={deg} rotation={[0, rad, 0]}>
                <boxGeometry args={[0.46, 0.3, 0.012]} />
                <meshStandardMaterial
                  color="#334155"
                  metalness={0.85}
                  roughness={0.2}
                  wireframe={wireframe}
                />
              </mesh>
            );
          })}

          {/* Bicentennial US Flag Marking on Left RTG Cover */}
          {idx === 0 && (
            <mesh position={[0, 0.08, 0.185]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.14, 0.08]} />
              <meshStandardMaterial
                map={deckDecalTex}
                roughness={0.3}
                metalness={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* ── S-Band High-Gain Steerable Parabolic Dish Antenna ── */}
      <group position={[0, 0.88 + antennaY, -0.25]} rotation={[0.42, 0.25, 0]}>
        {/* Parabolic Reflector Dish */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.44, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.36]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.55}
            roughness={0.24}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
        {/* Dish Backside Concentric Stiffening Rings */}
        <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.22, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Central Feed Horn Mast */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.008, 0.016, 0.28, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Gold Splash Plate Sub-Reflector */}
        <mesh position={[0, 0.36, 0]}>
          <coneGeometry args={[0.04, 0.06, 16]} />
          <meshStandardMaterial
            color="#f59e0b"
            metalness={0.9}
            roughness={0.15}
            emissive="#b45309"
            emissiveIntensity={0.25}
          />
        </mesh>
        {/* 4-Legged Feed Horn Support Spider */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={deg}
              position={[Math.sin(rad) * 0.12, 0.16, Math.cos(rad) * 0.12]}
              rotation={[0.35 * Math.cos(rad), rad, -0.35 * Math.sin(rad)]}
            >
              <cylinderGeometry args={[0.004, 0.004, 0.28, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
            </mesh>
          );
        })}
      </group>

      {/* ── Low-Gain Omni-Directional Antenna Mast ── */}
      <group position={[0.38, 0.98, 0.26]} castShadow>
        <mesh>
          <cylinderGeometry args={[0.008, 0.014, 0.62, 12]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Top RF Spiral Helical Coil */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.14, 12]} />
          <meshStandardMaterial
            color="#f59e0b"
            metalness={0.9}
            roughness={0.2}
            emissive="#b45309"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* ── Dual Martin Marietta Facsimile Cameras on White Pylons ── */}
      {[-0.28, 0.28].map((x, i) => (
        <group key={i} position={[x, 0.92, 0.32]}>
          {/* Main Cylindrical White Thermal Housing */}
          <mesh castShadow>
            <cylinderGeometry args={[0.065, 0.075, 0.38, 20]} />
            <meshStandardMaterial
              map={thermalShieldTex}
              color="#f8fafc"
              metalness={0.45}
              roughness={0.28}
              wireframe={wireframe}
            />
          </mesh>
          {/* 360-degree Azimuth Rotating Base Ring */}
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.082, 0.082, 0.04, 20]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Open Protective Dust Cover Hood */}
          <mesh position={[0, 0.19, -0.02]} rotation={[-0.35, 0, 0]} castShadow>
            <cylinderGeometry args={[0.072, 0.072, 0.08, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.7}
              roughness={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Vertical Optical Scanning Window (Antireflective Quartz Glass) */}
          <mesh position={[0, 0.08, 0.062]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.028, 0.14, 0.012]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.06}
              metalness={0.9}
              emissive="#0369a1"
              emissiveIntensity={0.25}
            />
          </mesh>
        </group>
      ))}

      {/* ── Biology / GCMS Sample Acquisition Funnels on Top Deck ── */}
      <group position={[0.05, 0.81, 0.08]}>
        {/* Biology Funnel Processing Block */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.22, 0.08, 0.18]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.25} />
        </mesh>
        {/* Three Biology Experiment Intake Ports (Pyrolytic, Labeled Release, Gas Exchange) */}
        {[-0.06, 0, 0.06].map((xOffset, idx) => (
          <group key={idx} position={[xOffset, 0.045, 0]}>
            <mesh>
              <cylinderGeometry args={[0.024, 0.016, 0.03, 12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Protective Hinged Hopper Screen */}
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.026, 0.026, 0.005, 12]} />
              <meshStandardMaterial
                color="#f59e0b"
                metalness={0.8}
                roughness={0.3}
                wireframe={true}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── Official Color & Metric Calibration Target on Deck ── */}
      <group position={[-0.24, 0.8, -0.08]} rotation={[-Math.PI / 2, 0, 0.35]}>
        <mesh receiveShadow>
          <planeGeometry args={[0.14, 0.14]} />
          <meshStandardMaterial
            map={calibTargetTex}
            roughness={0.35}
            metalness={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Vertical Shadow Gnomon Post */}
        <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.003, 0.003, 0.07, 8]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ── Three Terminal Descent Aerojet Rocket Clusters (18 Diffuser Nozzles) ── */}
      {[60, 180, 300].map((deg, idx) => {
        const rad = (deg * Math.PI) / 180;
        const x = Math.cos(rad) * 0.65;
        const z = Math.sin(rad) * 0.65;
        return (
          <group key={idx} position={[x, 0.28 + engineY, z]}>
            {/* Engine Mounting Bracket */}
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.08, 0.16]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Catalytic Thruster Chamber */}
            <mesh position={[0, -0.08, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.095, 0.14, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.92} roughness={0.18} />
            </mesh>
            {/* 18-Nozzle Showerhead Diffuser Plate */}
            <mesh position={[0, -0.16, 0]}>
              <cylinderGeometry args={[0.098, 0.098, 0.02, 18]} />
              <meshStandardMaterial
                color="#0f172a"
                metalness={0.95}
                roughness={0.25}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * 2. VIKING 1 SURFACE SAMPLER ARM (v1-sampler-arm)
 * The 3-meter robotic arm that dug the first trenches in Martian soil to search for life.
 * Features motorized shoulder gimbal, extendable triangular truss boom, wrist pitch actuator,
 * backhoe collector scoop with serrated tungsten teeth, 2000-micron sieve screen,
 * integral thermocouple probe, and an authentic excavated Martian regolith trench.
 */
export function VikingSamplerArm3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const boomLen = 1.35 + explode * 0.55;
  const scoopTilt = 0.42 + explode * 0.25;
  const shoulderLift = explode * 0.2;

  const regolithTex = useMemo(() => getMartianRegolithTexture(), []);
  const thermalShieldTex = useMemo(() => getVikingThermalShieldTexture(), []);

  return (
    <group scale={scale}>
      {/* ── Martian Soil Ground Plate with Excavated Trench ── */}
      <group position={[0, -0.02, 0.5]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[1.4, 1.45, 0.05, 32]} />
          <meshStandardMaterial
            map={regolithTex}
            color="#b45309"
            roughness={0.94}
            metalness={0.04}
            wireframe={wireframe}
          />
        </mesh>
        {/* Freshly Dug Soil Trench (Directly beneath the scoop teeth) */}
        <mesh position={[0, 0.028, 0.38]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.22, 0.52]} />
          <meshStandardMaterial color="#431407" roughness={0.98} metalness={0.02} />
        </mesh>
        {/* Raised Dirt Trench Spoil Mounds */}
        {[-0.13, 0.13].map((x, idx) => (
          <mesh key={idx} position={[x, 0.045, 0.38]} rotation={[0, 0, x > 0 ? 0.3 : -0.3]}>
            <cylinderGeometry args={[0.03, 0.04, 0.5, 12]} />
            <meshStandardMaterial color="#78350f" roughness={0.95} metalness={0.03} />
          </mesh>
        ))}
      </group>

      {/* ── Shoulder Gimbal Drive Housing on Lander Deck ── */}
      <group position={[0, 0.45 + shoulderLift, -0.35]}>
        {/* Mounting Base Flange with Perimeter Boltheads */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.04, 16]} />
          <meshStandardMaterial
            map={thermalShieldTex}
            color="#e2e8f0"
            metalness={0.65}
            roughness={0.28}
          />
        </mesh>
        {/* Azimuth / Elevation Motor Gearbox Housing */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <boxGeometry args={[0.2, 0.18, 0.22]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.82}
            roughness={0.22}
            wireframe={wireframe}
          />
        </mesh>
        {/* Coiled Umbilical Wiring Cable Harness */}
        <mesh position={[-0.12, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.05, 0.012, 8, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>

      {/* ── Extendable Telescoping Triangular Truss Boom ── */}
      <group position={[0, 0.58 + shoulderLift, -0.25]} rotation={[0.22, 0, 0]}>
        {/* Outer Extension Guide Sleeve */}
        <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.042, 0.048, 0.38, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Telescoping Tubular Boom Structure */}
        <mesh
          position={[0, 0, boomLen * 0.5]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.024, 0.032, boomLen, 12]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.88}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>

        {/* Parallel Secondary Extension Actuator Tube */}
        <mesh
          position={[0, 0.04, boomLen * 0.5]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.01, 0.01, boomLen * 0.95, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.18} />
        </mesh>

        {/* Mid-Boom Cable Pulley Support Rings */}
        {[0.35, 0.7, 1.05].map((z, idx) => (
          <mesh key={idx} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.034, 0.005, 8, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* ── Wrist Pitch Joint & Backhoe Collector Head ── */}
        <group position={[0, 0, boomLen]}>
          {/* Motorized Wrist Pitch Actuator Yoke */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.038, 0.038, 0.1, 16]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.85}
              roughness={0.22}
              wireframe={wireframe}
            />
          </mesh>

          {/* Articulated Collector Scoop Bucket */}
          <group position={[0, -0.06, 0.08]} rotation={[scoopTilt, 0, 0]}>
            {/* Main Alloy Backhoe Bucket Housing */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.18, 0.14, 0.22]} />
              <meshStandardMaterial
                color="#1e293b"
                metalness={0.85}
                roughness={0.22}
                wireframe={wireframe}
              />
            </mesh>

            {/* Serrated Tungsten Carbide Excavation Cutting Teeth */}
            <group position={[0, -0.08, 0.12]}>
              {[-0.06, -0.03, 0, 0.03, 0.06].map((tx, idx) => (
                <mesh key={idx} position={[tx, 0, 0.02]} rotation={[0.45, 0, 0]} castShadow>
                  <boxGeometry args={[0.018, 0.025, 0.05]} />
                  <meshStandardMaterial
                    color="#e2e8f0"
                    metalness={0.95}
                    roughness={0.12}
                  />
                </mesh>
              ))}
            </group>

            {/* Fine 2000-Micron Sieve Screen on Top Lid */}
            <mesh position={[0, 0.072, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.15, 0.18]} />
              <meshStandardMaterial
                color="#94a3b8"
                metalness={0.75}
                roughness={0.3}
                wireframe={true}
              />
            </mesh>

            {/* Rear-Mounted Thermocouple Temperature Sensor Probe */}
            <mesh position={[0.1, 0, -0.08]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.005, 0.005, 0.06, 8]} />
              <meshStandardMaterial
                color="#f59e0b"
                metalness={0.9}
                roughness={0.15}
                emissive="#b45309"
                emissiveIntensity={0.25}
              />
            </mesh>

            {/* Solenoid Vibrator Motor Housing (Shakes cohesive clay dust) */}
            <mesh position={[-0.1, 0.02, 0]} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 0.07, 12]} />
              <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/**
 * 3. VIKING 1 METEOROLOGY STATION (v1-meteorology)
 * The elevated 1.25m sensor mast that tracked daily Martian weather reports for over 6 years.
 * Features deployable tubular aluminum pylon with guy wires, meteorology sensor head array,
 * hot-film anemometer with platinum probes inside open wire cages, ambient thermocouple rings
 * in concentric silver radiation sunshields, and wind direction reference vanes.
 */
export function VikingMeteorology3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const mastY = explode * 0.4;
  const sensorSpread = explode * 0.25;

  const silverMylarTex = useMemo(() => getSilverMLITexture(), []);
  const thermalShieldTex = useMemo(() => getVikingThermalShieldTexture(), []);

  return (
    <group scale={scale}>
      {/* ── Lander Top Deck Segment with Titanium Rivets ── */}
      <group position={[0, 0.04, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[0.55, 0.58, 0.08, 24]} />
          <meshStandardMaterial
            map={thermalShieldTex}
            color="#f1f5f9"
            metalness={0.5}
            roughness={0.28}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* ── Base Deployment Hinge and Pylon Mount ── */}
      <group position={[0, 0.16, 0]}>
        {/* Heavy Mounting Bracket Flange */}
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.14, 0.18]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.22} />
        </mesh>
        {/* Spring-Actuated Deployment Hinge Pin & Collar */}
        <mesh position={[0, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.18, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.18} />
        </mesh>
        {/* Electrical Conduit Run to Lander Bus */}
        <mesh position={[0.07, -0.04, 0.07]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.12, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* ── Vertical Deployable Tubular Sensor Mast ── */}
      <group position={[0, 0.28, 0]}>
        <mesh position={[0, (1.25 + mastY) * 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.024, 1.25 + mastY, 16]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.88}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>

        {/* Mast Diagonal Guy Wire Cross-Braces */}
        {[0, 120, 240].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={deg}
              position={[Math.cos(rad) * 0.14, 0.35, Math.sin(rad) * 0.14]}
              rotation={[0.38 * Math.sin(rad), rad, -0.38 * Math.cos(rad)]}
            >
              <cylinderGeometry args={[0.003, 0.003, 0.72, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.15} />
            </mesh>
          );
        })}

        {/* Detent Collar Rings */}
        {[0.4, 0.8].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]}>
            <cylinderGeometry args={[0.028, 0.028, 0.03, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* ── Meteorology Sensor Head Array (Wind, Temp & Pressure) ── */}
        <group position={[0, 1.25 + mastY, 0]}>
          {/* Main Sensor Head Electronics Canister */}
          <mesh castShadow>
            <cylinderGeometry args={[0.052, 0.052, 0.14, 20]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.85}
              roughness={0.22}
              wireframe={wireframe}
            />
          </mesh>

          {/* Hot-Film Anemometer Probes (3 Orthogonal Platinum Quartz Probes) */}
          <group position={[0.09 + sensorSpread, 0.02, 0]}>
            <mesh>
              <sphereGeometry args={[0.026, 16, 16]} />
              <meshStandardMaterial
                color="#f59e0b"
                metalness={0.95}
                roughness={0.12}
                emissive="#b45309"
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* Open Wire Cage Protection */}
            <mesh>
              <sphereGeometry args={[0.038, 8, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} wireframe={true} />
            </mesh>
          </group>

          {/* Ambient Temperature Thermocouple Sensor in Silver Radiation Shield */}
          <group position={[-0.09 - sensorSpread, 0.02, 0]}>
            {/* Concentric Cylindrical Radiation Sunshield */}
            <mesh>
              <cylinderGeometry args={[0.032, 0.032, 0.09, 16, 1, true]} />
              <meshStandardMaterial
                map={silverMylarTex}
                color="#ffffff"
                metalness={0.7}
                roughness={0.15}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Internal Chromel-Constantan Thermocouple Ring */}
            <mesh>
              <torusGeometry args={[0.016, 0.003, 8, 16]} />
              <meshStandardMaterial color="#dc2626" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>

          {/* Aerodynamic Wind Direction Quadrant Reference Vanes */}
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <mesh
                key={deg}
                position={[Math.cos(rad) * 0.07, 0.08, Math.sin(rad) * 0.07]}
                rotation={[0, rad, 0]}
              >
                <boxGeometry args={[0.045, 0.05, 0.004]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
            );
          })}

          {/* Atmospheric Pressure Transducer Reference Port Tube */}
          <mesh position={[0, -0.09, 0.04]}>
            <cylinderGeometry args={[0.006, 0.006, 0.08, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.18} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * 4. VIKING 1 FACSIMILE SCANNING CAMERAS (v1-cameras)
 * The twin camera towers that scanned Mars line by line, returning humanity's first color photos
 * from the Martian surface.
 * Features stereoscopic dual camera towers with white thermal silicone shrouds, Martin Marietta
 * decals, open protective dust hoods, antireflective optical quartz scanning slits, internal
 * nodding mirror galvanometer, and forward deck color calibration test chart.
 */
export function VikingFacsimileCameras3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const spread = explode * 0.35;
  const hoodLift = explode * 0.2;

  const thermalShieldTex = useMemo(() => getVikingThermalShieldTexture(), []);
  const calibTargetTex = useMemo(() => getVikingCalibrationTargetTexture(), []);
  const deckDecalTex = useMemo(() => getVikingDeckDecalTexture(), []);

  return (
    <group scale={scale}>
      {/* ── Forward Lander Deck Section ── */}
      <group position={[0, 0.04, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.2, 0.08, 0.7]} />
          <meshStandardMaterial
            map={thermalShieldTex}
            color="#f8fafc"
            metalness={0.48}
            roughness={0.26}
            wireframe={wireframe}
          />
        </mesh>
        {/* Optical Test Calibration Chart Mounted Between the Twin Cameras */}
        <mesh position={[0, 0.045, 0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.22, 0.22]} />
          <meshStandardMaterial
            map={calibTargetTex}
            roughness={0.3}
            metalness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Center Sundial Shadow Pin */}
        <mesh position={[0, 0.09, 0.1]} castShadow>
          <cylinderGeometry args={[0.003, 0.003, 0.08, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Twin Cameras (Camera 1 & Camera 2 with Stereoscopic Baseline) ── */}
      {[-0.32 - spread, 0.32 + spread].map((xPos, camIdx) => (
        <group key={camIdx} position={[xPos, 0.42, -0.05]}>
          {/* Deck Mounting Pedestal Ring */}
          <mesh position={[0, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.11, 0.16, 20]} />
            <meshStandardMaterial color="#334155" metalness={0.82} roughness={0.24} />
          </mesh>

          {/* 360-degree Azimuth Rotary Drive Track */}
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.088, 0.088, 0.035, 24]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.18} />
          </mesh>

          {/* Main Cylindrical White Thermal Enamel Housing */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.076, 0.084, 0.44, 24]} />
            <meshStandardMaterial
              map={thermalShieldTex}
              color="#f8fafc"
              metalness={0.45}
              roughness={0.28}
              wireframe={wireframe}
            />
          </mesh>

          {/* Martin Marietta Stencil Decal on Lower Shroud */}
          <mesh position={[0, -0.04, 0.082]} rotation={[0, 0, 0]}>
            <planeGeometry args={[0.09, 0.045]} />
            <meshStandardMaterial
              map={deckDecalTex}
              roughness={0.3}
              metalness={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Spring-Loaded Protective Dust Cover Hood in Open Position */}
          <group position={[0, 0.28 + hoodLift, -0.02]} rotation={[-0.42, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.082, 0.082, 0.1, 16, 1, false, 0, Math.PI]} />
              <meshStandardMaterial
                color="#e2e8f0"
                metalness={0.7}
                roughness={0.22}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Latch Spring and Hinge Pin */}
            <mesh position={[0, -0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, 0.16, 12]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>

          {/* Vertical Optical Scanning Slit Window (Antireflective Quartz Glass) */}
          <mesh position={[0, 0.1, 0.078]} rotation={[0.12, 0, 0]}>
            <boxGeometry args={[0.028, 0.16, 0.012]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.06}
              metalness={0.9}
              emissive="#0369a1"
              emissiveIntensity={0.25}
              wireframe={wireframe}
            />
          </mesh>

          {/* Internal Oscillating Nodding Mirror Galvanometer (Visible through glass) */}
          <mesh position={[0, 0.1, 0.04]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.022, 0.06, 0.008]} />
            <meshStandardMaterial
              color="#f8fafc"
              metalness={0.98}
              roughness={0.05}
            />
          </mesh>

          {/* Top Nitrogen Purge Relief Valve */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.012, 0.016, 0.04, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.18} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 5. VIKING 1 HIGH-GAIN ANTENNA (v1-antenna)
 * The 30-inch steerable S-band parabolic dish that beamed photos, weather reports, and biology
 * discoveries directly across 300 million kilometers of space to Earth.
 * Features 2-axis articulated gimbal pedestal, parabolic dish reflector with backside concentric
 * stiffeners and radial truss struts, central feed horn, 4-legged support spider, gold-plated
 * sub-reflector splash plate, and coiled coaxial RF cables.
 */
export function VikingAntenna3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const dishY = explode * 0.45;
  const feedSpread = explode * 0.25;

  const thermalShieldTex = useMemo(() => getVikingThermalShieldTexture(), []);

  return (
    <group scale={scale}>
      {/* ── Base Lander Deck Mounting Section ── */}
      <group position={[0, 0.04, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[0.42, 0.45, 0.08, 24]} />
          <meshStandardMaterial
            map={thermalShieldTex}
            color="#f1f5f9"
            metalness={0.48}
            roughness={0.28}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* ── 2-Axis Articulated Gimbal Pedestal ── */}
      <group position={[0, 0.22, 0]}>
        {/* Cast Aluminum Base Pedestal with 4 Flanges */}
        <mesh castShadow>
          <cylinderGeometry args={[0.065, 0.09, 0.28, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.82} roughness={0.25} />
        </mesh>
        {/* Azimuth Rotary Gear Motor Housing */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.08, 20]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Elevation Tilt Yoke with Dual Arm Brackets */}
        <group position={[0, 0.26, 0]}>
          <mesh position={[-0.08, 0.06, 0]} castShadow>
            <boxGeometry args={[0.03, 0.14, 0.06]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.22} />
          </mesh>
          <mesh position={[0.08, 0.06, 0]} castShadow>
            <boxGeometry args={[0.03, 0.14, 0.06]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.22} />
          </mesh>
          {/* Elevation Pivot Shaft */}
          <mesh position={[0, 0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.18, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.16} />
          </mesh>
          {/* Coiled Flexible Coaxial RF Cable Loop */}
          <mesh position={[0.11, 0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.038, 0.008, 8, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* ── Parabolic Reflector Dish Assembly ── */}
      <group position={[0, 0.62 + dishY, 0]} rotation={[0.48, 0.28, 0]}>
        {/* Main 30-inch Parabolic Dish */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.62, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.36]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.65}
            roughness={0.22}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>

        {/* Backside Structural Concentric Stiffening Rings */}
        {[0.24, 0.42].map((r, idx) => (
          <mesh key={idx} position={[0, -0.04 - idx * 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r - 0.015, r + 0.015, 32]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
          </mesh>
        ))}

        {/* 6 Radial Reinforcement Truss Struts on Dish Backside */}
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={deg}
              position={[Math.cos(rad) * 0.26, -0.06, Math.sin(rad) * 0.26]}
              rotation={[0.35 * Math.sin(rad), rad, -0.35 * Math.cos(rad)]}
            >
              <boxGeometry args={[0.26, 0.012, 0.008]} />
              <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.22} />
            </mesh>
          );
        })}

        {/* Central S-Band Feed Horn Mast */}
        <mesh position={[0, 0.28 + feedSpread * 0.4, 0]}>
          <cylinderGeometry args={[0.01, 0.018, 0.38, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.2} />
        </mesh>

        {/* Gold-Plated Sub-Reflector Splash Plate */}
        <mesh position={[0, 0.48 + feedSpread, 0]}>
          <coneGeometry args={[0.05, 0.075, 20]} />
          <meshStandardMaterial
            color="#f59e0b"
            metalness={0.92}
            roughness={0.14}
            emissive="#b45309"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* 4-Legged Feed Horn Support Spider */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={deg}
              position={[Math.sin(rad) * 0.16, 0.22 + feedSpread * 0.2, Math.cos(rad) * 0.16]}
              rotation={[0.38 * Math.cos(rad), rad, -0.38 * Math.sin(rad)]}
            >
              <cylinderGeometry args={[0.005, 0.005, 0.42, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/**
 * 6. VIKING 1 SEISMOMETER (v1-seismometer)
 * The deck-mounted triaxial seismometer. It taught space scientists the crucial lesson that
 * mounting a seismometer directly on a lander bus picks up wind vibrations rather than pure marsquakes,
 * directly inspiring the ground-deployed dome design of InSight's SEIS decades later.
 * Features shock-isolation base platform, sealed titanium vacuum canister with getter pump,
 * gold Kapton MLI thermal blanket, spun aluminum protective dome, spirit bubble level, and
 * hermetic multi-pin cabling.
 */
export function VikingSeismometer3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const capY = explode * 0.35;
  const canY = explode * 0.15;

  const goldKaptonTex = useMemo(() => getGoldKaptonTexture(), []);
  const thermalShieldTex = useMemo(() => getVikingThermalShieldTexture(), []);

  return (
    <group scale={scale}>
      {/* ── Lander Top Deck Titanium Frame Mounting Plate ── */}
      <group position={[0, 0.03, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[0.42, 0.44, 0.06, 24]} />
          <meshStandardMaterial
            map={thermalShieldTex}
            color="#e2e8f0"
            metalness={0.55}
            roughness={0.28}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* ── Shock-Isolation Mount Platform (3 Spring Dampers) ── */}
      <group position={[0, 0.1, 0]}>
        {/* Triangular Cast Base Flange */}
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.32, 0.05, 3]} />
          <meshStandardMaterial color="#334155" metalness={0.82} roughness={0.25} />
        </mesh>

        {/* 3 Elastomeric Shock Damper Bushings */}
        {[30, 150, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={deg}
              position={[Math.cos(rad) * 0.22, 0.04, Math.sin(rad) * 0.22]}
            >
              <cylinderGeometry args={[0.024, 0.024, 0.06, 12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
            </mesh>
          );
        })}

        {/* Circular Spirit Bubble Level on Mounting Flange */}
        <group position={[0.18, 0.05, 0]}>
          <mesh>
            <cylinderGeometry args={[0.024, 0.024, 0.012, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.007, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.004, 16]} />
            <meshStandardMaterial
              color="#22c55e"
              metalness={0.2}
              roughness={0.1}
              emissive="#15803d"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      </group>

      {/* ── Sealed Triaxial Sensor Vacuum Canister ── */}
      <group position={[0, 0.26 + canY, 0]}>
        {/* Lower Canister Body with Gold Kapton MLI Insulation */}
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.24, 0.26, 24]} />
          <meshStandardMaterial
            map={goldKaptonTex}
            color="#d97706"
            metalness={0.48}
            roughness={0.28}
            emissive="#b45309"
            emissiveIntensity={0.2}
            wireframe={wireframe}
          />
        </mesh>

        {/* Getter Pump Vacuum Evacuation Tube on Side */}
        <mesh position={[0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.06, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Multi-Pin Hermetic Electrical Connector with Braided Shield */}
        <group position={[-0.22, -0.06, 0.08]} rotation={[0, -0.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.018, 0.018, 0.05, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.35} />
          </mesh>
        </group>
      </group>

      {/* ── Spun Aluminum Protective Thermal Dome Cap ── */}
      <group position={[0, 0.42 + capY, 0]}>
        {/* Hemispherical Spun Aluminum Cap */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.23, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color="#f1f5f9"
            metalness={0.7}
            roughness={0.22}
            wireframe={wireframe}
          />
        </mesh>

        {/* Lower Thermal Fringe Lip */}
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.21, 0.26, 28]} />
          <meshStandardMaterial
            map={goldKaptonTex}
            color="#f59e0b"
            metalness={0.5}
            roughness={0.28}
            emissive="#b45309"
            emissiveIntensity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Top Lifting Stud / Grounding Lug */}
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.03, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}
