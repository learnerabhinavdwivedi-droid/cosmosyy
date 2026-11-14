import type { ArtifactProps } from "./shared";

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
