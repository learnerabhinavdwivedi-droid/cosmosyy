import * as THREE from "three";
import type { ArtifactProps } from "./shared";

export function LunarRovingVehicle3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const dishY = explode * 0.35;
  const wheelSpread = explode * 0.2;

  const wheels: [number, number, number, boolean][] = [
    [-0.72 - wheelSpread, 0.22, 0.58 + wheelSpread, false],
    [0.72 + wheelSpread, 0.22, 0.58 + wheelSpread, false],
    [-0.72 - wheelSpread, 0.22, -0.58 - wheelSpread, true], // Apollo 17 taped map fender
    [0.72 + wheelSpread, 0.22, -0.58 - wheelSpread, false],
  ];

  return (
    <group scale={scale}>
      {/* Welded Tubular Aluminum Center Chassis Frame */}
      <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.65, 0.08, 0.95]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Gold Kapton Thermal Foil Belly Pan */}
      <mesh position={[0, 0.21, 0]}>
        <boxGeometry args={[1.55, 0.02, 0.88]} />
        <meshStandardMaterial color="#d49b28" metalness={0.94} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Longitudinal Tubular Suspension & Chassis Rails */}
      {[-0.44, 0.44].map((z, idx) => (
        <mesh key={idx} position={[0, 0.32, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 1.6, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.25} wireframe={wireframe} />
        </mesh>
      ))}

      {/* 4 Spun-Aluminum Wire Mesh Wheels with Titanium Chevron Cleats & Orange Dust Fenders */}
      {wheels.map(([wx, wy, wz, isTaped], idx) => (
        <group key={idx}>
          {/* Wheel Assembly */}
          <group position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
            {/* Open Wire Mesh Tire */}
            <mesh castShadow>
              <cylinderGeometry args={[0.24, 0.24, 0.14, 20]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.25} wireframe={wireframe} />
            </mesh>
            {/* Hub Drive Motor & Hubcap */}
            <mesh>
              <cylinderGeometry args={[0.085, 0.085, 0.16, 12]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} wireframe={wireframe} />
            </mesh>
            {/* Titanium Chevron Traction Cleats (Outer Ring) */}
            <mesh>
              <torusGeometry args={[0.235, 0.01, 8, 24]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} wireframe={wireframe} />
            </mesh>
          </group>

          {/* Curved Orange Lightweight Fiberglass Dust Fender */}
          <group position={[wx, wy + 0.15, wz]}>
            <mesh position={[0, 0.08, 0]} rotation={[0, wz > 0 ? 0 : Math.PI, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.18, 16, 1, true, 0, Math.PI * 0.7]} />
              <meshStandardMaterial
                color="#ea580c"
                roughness={0.4}
                metalness={0.2}
                side={THREE.DoubleSide}
                wireframe={wireframe}
              />
            </mesh>
            {/* Duct-Tape Cardboard Map Extension (Apollo 17 Famous Repair) */}
            {isTaped && (
              <mesh position={[0.22, 0.12, 0]} rotation={[0, 0, -0.4]}>
                <boxGeometry args={[0.16, 0.01, 0.18]} />
                <meshStandardMaterial color="#78716c" roughness={0.8} wireframe={wireframe} />
              </mesh>
            )}
          </group>
        </group>
      ))}

      {/* Two Tubular Aluminum Folding Crew Seats with Nylon Webbing */}
      {[-0.22, 0.22].map((zPos, sIdx) => (
        <group key={sIdx} position={[-0.1, 0.44, zPos]}>
          {/* Seat Backrest Frame */}
          <mesh position={[-0.14, 0.2, 0]} rotation={[0, 0, -0.2]} castShadow>
            <boxGeometry args={[0.03, 0.42, 0.36]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
          </mesh>
          {/* Mesh Webbing Insert */}
          <mesh position={[-0.14, 0.2, 0]} rotation={[0, 0, -0.2]}>
            <planeGeometry args={[0.01, 0.38]} />
            <meshStandardMaterial color="#475569" roughness={0.7} wireframe={wireframe} />
          </mesh>
          {/* Seat Cushion Pan */}
          <mesh position={[0.04, 0.02, 0]} castShadow>
            <boxGeometry args={[0.38, 0.03, 0.36]} />
            <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.5} wireframe={wireframe} />
          </mesh>
          {/* Velcro Seatbelt Buckle */}
          <mesh position={[0.04, 0.05, 0]}>
            <boxGeometry args={[0.04, 0.01, 0.24]} />
            <meshStandardMaterial color={sIdx === 0 ? "#ef4444" : "#3b82f6"} roughness={0.5} wireframe={wireframe} />
          </mesh>
        </group>
      ))}

      {/* Central Control & Display Console with T-Handle Joystick */}
      <group position={[0.22, 0.46, 0]}>
        {/* Slanted Display Panel */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, -0.35]} castShadow>
          <boxGeometry args={[0.22, 0.28, 0.18]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} wireframe={wireframe} />
        </mesh>
        {/* T-Handle Steering Controller Stick */}
        <mesh position={[0.05, 0.14, 0]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.2} wireframe={wireframe} />
        </mesh>
        <mesh position={[0.05, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.12, 8]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} wireframe={wireframe} />
        </mesh>
      </group>

      {/* High-Gain Parabolic Umbrella Dish Antenna */}
      <group position={[0.62, 0.82 + dishY, 0.32]} rotation={[0.35, 0.45, 0]}>
        {/* Articulated Mast */}
        <mesh>
          <cylinderGeometry args={[0.014, 0.014, 0.85, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Gold Mesh Parabolic Reflector Dish */}
        <mesh position={[0, 0.46, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.06, 0.09, 20]} />
          <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Feed Horn */}
        <mesh position={[0, 0.54, 0]}>
          <cylinderGeometry args={[0.01, 0.02, 0.08, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>

      {/* RCA Color Television Camera on Forward Mast */}
      <group position={[0.72, 0.62, -0.34]}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.14, 0.14]} />
          <meshStandardMaterial color="#d49b28" metalness={0.92} roughness={0.22} wireframe={wireframe} />
        </mesh>
        {/* Lens Barrel with Sunshade */}
        <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 0.12, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Aft Scientific Geological Equipment Tool Pallet */}
      <group position={[-0.72, 0.38, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.06, 0.82]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* Rock Core Sample Drill Stems */}
        {[-0.24, -0.08, 0.08, 0.24].map((z, idx) => (
          <mesh key={idx} position={[0, 0.12, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, 0.26, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} wireframe={wireframe} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

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
