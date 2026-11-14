import * as THREE from "three";
import type { ArtifactProps } from "./shared";

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
