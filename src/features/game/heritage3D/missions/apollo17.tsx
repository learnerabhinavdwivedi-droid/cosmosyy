import type { ArtifactProps } from "./shared";

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
