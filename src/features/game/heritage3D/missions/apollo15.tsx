import type { ArtifactProps } from "./shared";

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
