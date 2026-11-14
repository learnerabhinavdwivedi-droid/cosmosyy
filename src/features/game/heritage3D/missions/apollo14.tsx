import { useMemo } from "react";
import * as THREE from "three";
import type { ArtifactProps } from "./shared";

/**
 * Apollo 14 Modular Equipment Transporter (MET) — "The Lunar Rickshaw"
 * Deployed by Alan Shepard & Edgar Mitchell at Fra Mauro base (1971).
 * First wheeled vehicle on the Moon.
 */
export function METCart3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const wheelSpread = explode * 0.35;
  const trayLift = explode * 0.3;
  const toolSpread = explode * 0.4;

  // Diamond tread texture for the Goodyear pneumatic tires
  const tireTreadTex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, 256, 64);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      for (let x = 0; x < 256; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 16, 64);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 16, 0);
        ctx.lineTo(x, 64);
        ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
    return tex;
  }, []);

  return (
    <group scale={scale}>
      {/* Tubular Aluminum Spaceframe Chassis */}
      <group position={[0, 0.35, 0]}>
        {/* Main Lower Perimeter Tubular Frame */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.72, 0.04, 0.94]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Longitudinal & Transverse Structural Ribs */}
        <mesh position={[0, -0.01, 0]}>
          <boxGeometry args={[0.68, 0.02, 0.88]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} wireframe={wireframe} />
        </mesh>

        {/* Central Tubular Wheel Axle Bar */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.12, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.98, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.92} roughness={0.18} wireframe={wireframe} />
        </mesh>

        {/* Front Folding Parking Kickstand Legs */}
        {[-0.28, 0.28].map((x, i) => (
          <group key={i} position={[x, -0.16, -0.42]}>
            <mesh rotation={[0.2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.32, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.88} roughness={0.2} wireframe={wireframe} />
            </mesh>
            {/* Swivel footpad disc resting on regolith */}
            <mesh position={[0, -0.16, 0.03]}>
              <cylinderGeometry args={[0.035, 0.035, 0.015, 12]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} wireframe={wireframe} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Towing Drawbar & Triangular Astronaut Pull-Grip */}
      <group position={[0, 0.32, -0.48]} rotation={[-0.42, 0, 0]}>
        {/* Two-piece Telescoping Drawbar */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.88, 12]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.18} wireframe={wireframe} />
        </mesh>
        {/* Drawbar Locking Collar */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.04, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.95} roughness={0.15} wireframe={wireframe} />
        </mesh>
        {/* Triangular Ergonomic Tow Handle Grip */}
        <group position={[0, 0.86, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, 0.22, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.5} wireframe={wireframe} />
          </mesh>
          <mesh position={[-0.09, -0.05, 0]} rotation={[0, 0, -0.4]}>
            <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} wireframe={wireframe} />
          </mesh>
          <mesh position={[0.09, -0.05, 0]} rotation={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} wireframe={wireframe} />
          </mesh>
        </group>
      </group>

      {/* Two Goodyear Pneumatic Rubber Tires with Silver Wheel Hubs */}
      {[-0.45 - wheelSpread, 0.45 + wheelSpread].map((x, i) => (
        <group key={i} position={[x, 0.23, 0]} rotation={[0, 0, Math.PI / 2]}>
          {/* Black Goodyear Lunar Nitrogen-Filled Tire */}
          <mesh castShadow receiveShadow>
            <torusGeometry args={[0.22, 0.08, 20, 32]} />
            <meshStandardMaterial
              map={wireframe ? undefined : tireTreadTex}
              color={wireframe ? "#00ffff" : "#1e293b"}
              roughness={0.85}
              metalness={0.08}
              wireframe={wireframe}
            />
          </mesh>
          {/* Spoked Lightweight Aluminum Wheel Hub */}
          <mesh position={[0, x > 0 ? 0.01 : -0.01, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.05, 20]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.16} wireframe={wireframe} />
          </mesh>
          {/* Center Hubcap Spindle Nut */}
          <mesh position={[0, x > 0 ? 0.045 : -0.045, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.03, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.1} wireframe={wireframe} />
          </mesh>
        </group>
      ))}

      {/* Equipment Stowage Shelves & White Beta-Cloth Sample Bags */}
      <group position={[0, 0.4 + trayLift, 0]}>
        {/* Upper Tool Pallet Tray */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.62, 0.02, 0.8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>

        {/* Left White Beta-Cloth Sample Collection Bag with Blue NASA Stripe */}
        <group position={[-0.18, 0.16, 0.12]}>
          <mesh castShadow>
            <boxGeometry args={[0.24, 0.28, 0.42]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.9} metalness={0.05} wireframe={wireframe} />
          </mesh>
          <mesh position={[0, 0.08, 0.212]}>
            <planeGeometry args={[0.22, 0.04]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} />
          </mesh>
        </group>

        {/* Right White Beta-Cloth Sample Collection Bag */}
        <group position={[0.18, 0.16, 0.12]}>
          <mesh castShadow>
            <boxGeometry args={[0.24, 0.28, 0.42]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.9} metalness={0.05} wireframe={wireframe} />
          </mesh>
          <mesh position={[0, 0.08, 0.212]}>
            <planeGeometry args={[0.22, 0.04]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} />
          </mesh>
        </group>

        {/* Front 70mm Hasselblad Camera Mount & Lunar Surface Close-up Camera (ALSCC) */}
        <group position={[0, 0.14 + toolSpread, -0.25]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.18, 0.2]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} wireframe={wireframe} />
          </mesh>
          {/* Twin Optical Stereo Lenses */}
          {[-0.05, 0.05].map((lx, idx) => (
            <mesh key={idx} position={[lx, 0, -0.105]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
              <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.95} />
            </mesh>
          ))}
        </group>

        {/* Core Tube Soil Sampling Extension Rods Bracket */}
        <group position={[0.29, 0.12, -0.05]} rotation={[0, 0, 0.1]}>
          {[-0.12, 0, 0.12].map((z, idx) => (
            <mesh key={idx} position={[0, 0.15, z]} rotation={[0.15, 0, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.55, 8]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.15} wireframe={wireframe} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

/**
 * Alan Shepard's 6-Iron Golf Club & Lunar Golf Balls — Apollo 14 (1971)
 * "Miles and miles and miles" — first golf shot on another world.
 */
export function GolfBallsClub3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const clubY = explode * 0.45;
  const ballSpread = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Lunar Soil Divot Crater Bed */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <cylinderGeometry args={[0.55, 0.65, 0.03, 24]} />
        <meshStandardMaterial color="#475569" roughness={0.95} metalness={0.05} wireframe={wireframe} />
      </mesh>
      {/* Shepard's club strike divot */}
      <mesh position={[-0.04, 0.028, 0.02]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.14, 0.015, 0.08]} />
        <meshStandardMaterial color="#1e293b" roughness={0.98} wireframe={wireframe} />
      </mesh>

      {/* First Golf Ball (Wilson Staff with dimples) */}
      <group position={[-0.14 - ballSpread, 0.036, 0.02]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.022, 24, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.22}
            metalness={0.05}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Second Golf Ball (struck into the distance towards Cone Crater) */}
      <group position={[0.38 + ballSpread, 0.036, 0.22]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.022, 24, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.22}
            metalness={0.05}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Alan Shepard's Modified Wilson Staff 6-Iron Club */}
      <group position={[0.02, 0.14 + clubY, -0.06]} rotation={[0.42, 0.2, -0.88]}>
        {/* Telescopic Contingency Sampler Extension Shaft */}
        <mesh position={[0, 0.48, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.012, 1.05, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.16} wireframe={wireframe} />
        </mesh>
        {/* Knurled Grip Collar at Top */}
        <mesh position={[0, 0.98, 0]}>
          <cylinderGeometry args={[0.013, 0.013, 0.06, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} wireframe={wireframe} />
        </mesh>

        {/* Chrome Hosel Adapter Joint */}
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.012, 0.014, 0.07, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} wireframe={wireframe} />
        </mesh>

        {/* Authentic Forged 6-Iron Blade Head with Grooves and 32° Loft */}
        <group position={[0.048, -0.065, 0]} rotation={[0, 0, 0.22]}>
          <mesh castShadow>
            <boxGeometry args={[0.095, 0.048, 0.018]} />
            <meshStandardMaterial
              color="#f1f5f9"
              metalness={0.96}
              roughness={0.12}
              wireframe={wireframe}
            />
          </mesh>
          {/* Face Grooves (stamped scorelines) */}
          {[-0.012, -0.004, 0.004, 0.012].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0.01]}>
              <boxGeometry args={[0.07, 0.002, 0.001]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
