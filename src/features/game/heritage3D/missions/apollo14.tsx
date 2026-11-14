import type { ArtifactProps } from "./shared";

export function METCart3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const wheelExplode = explode * 0.3;

  return (
    <group scale={scale}>
      {/* Main Aluminum Chassis Box */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.65, 0.25, 0.85]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Tow Handle */}
      <group position={[0, 0.4, -0.55]} rotation={[-0.45, 0, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.75, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {/* Triangular grip handle */}
        <mesh position={[0, 0.75, 0]}>
          <torusGeometry args={[0.08, 0.012, 8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.5} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Two Pneumatic Rubber Wheels */}
      {[-0.4 - wheelExplode, 0.4 + wheelExplode].map((x, i) => (
        <group key={i} position={[x, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          {/* Black Rubber Tire */}
          <mesh castShadow receiveShadow>
            <torusGeometry args={[0.2, 0.07, 16, 24]} />
            <meshStandardMaterial color="#1e293b" roughness={0.85} metalness={0.1} wireframe={wireframe} />
          </mesh>
          {/* Silver Spoked Wheel Hub */}
          <mesh>
            <cylinderGeometry args={[0.14, 0.14, 0.04, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} wireframe={wireframe} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function GolfBallsClub3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const clubY = explode * 0.4;

  return (
    <group scale={scale}>
      {/* First Golf Ball */}
      <mesh position={[-0.15, 0.025, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.025, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* Second Golf Ball (further out) */}
      <mesh position={[0.32, 0.025, 0.18]} castShadow receiveShadow>
        <sphereGeometry args={[0.025, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* Alan Shepard's 6-Iron Club */}
      <group position={[0.05, 0.12 + clubY, -0.08]} rotation={[0.4, 0.2, -0.85]}>
        {/* Shaft / Extension Handle */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.009, 0.012, 0.95, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} wireframe={wireframe} />
        </mesh>
        {/* Chrome Hosel joint */}
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.012, 0.014, 0.06, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.12} wireframe={wireframe} />
        </mesh>
        {/* 6-Iron Forged Blade Head with Loft Angle */}
        <mesh position={[0.045, -0.04, 0]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[0.09, 0.045, 0.018]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.95}
            roughness={0.12}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}
