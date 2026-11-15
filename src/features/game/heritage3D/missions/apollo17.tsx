import type { ArtifactProps } from "./shared";

export function OrangeSoil3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const gnomonY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Shorty Crater Dark Titanium-Basalt Regolith Mound */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[0.85, 1.05, 0.12, 24]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.96}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* Excavated Geological Trench Hollow */}
      <mesh position={[0.02, 0.08, 0]} rotation={[0, 0.25, 0]}>
        <boxGeometry args={[0.75, 0.06, 0.32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.98} wireframe={wireframe} />
      </mesh>

      {/* Vivid Orange & Reddish Pyroclastic Volcanic Glass Beads Bed */}
      <group position={[0.02, 0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0.25]} receiveShadow>
          <planeGeometry args={[0.68, 0.26, 16, 8]} />
          <meshStandardMaterial
            color="#ea580c"
            roughness={0.4}
            metalness={0.3}
            emissive="#c2410c"
            emissiveIntensity={0.35}
            wireframe={wireframe}
          />
        </mesh>

        {/* Scattered 3D Glass Spherule Clusters */}
        {(
          [
            [-0.22, 0.015, -0.05],
            [-0.1, 0.02, 0.04],
            [0.05, 0.018, -0.02],
            [0.18, 0.022, 0.06],
            [0.26, 0.012, -0.04],
          ] as const
        ).map(([px, py, pz], idx) => (
          <mesh key={idx} position={[px, py, pz]} castShadow>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? "#f97316" : "#dc2626"}
              roughness={0.25}
              metalness={0.4}
              emissive="#ea580c"
              emissiveIntensity={0.4}
              wireframe={wireframe}
            />
          </mesh>
        ))}
      </group>

      {/* Harrison Schmitt's Geological Sampling Trenching Scoop */}
      <group position={[-0.42, 0.08, 0.22]} rotation={[0.2, 0.6, 0.1]}>
        {/* Tubular Extension Handle */}
        <mesh castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.65, 8]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.92}
            roughness={0.18}
            wireframe={wireframe}
          />
        </mesh>
        {/* Steel Scoop Head with Trenching Teeth */}
        <mesh position={[0, -0.32, 0]} castShadow>
          <boxGeometry args={[0.1, 0.09, 0.06]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.88}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Apollo Gnomon Calibration Assembly on Gimballed Tripod */}
      <group position={[0.42, 0.25 + gnomonY, -0.25]}>
        {/* 3 Tripod Tubular Legs */}
        {[0, 120, 240].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={deg}
              position={[Math.cos(rad) * 0.15, -0.12, Math.sin(rad) * 0.15]}
              rotation={[Math.sin(rad) * 0.45, 0, -Math.cos(rad) * 0.45]}
              castShadow
            >
              <cylinderGeometry args={[0.005, 0.005, 0.32, 8]} />
              <meshStandardMaterial
                color="#94a3b8"
                metalness={0.9}
                roughness={0.25}
                wireframe={wireframe}
              />
            </mesh>
          );
        })}
        {/* Weighted Gimballed Center Staff */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.48, 8]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.85}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Color & Gray Scale Calibration Target Panel */}
        <mesh position={[0, 0.16, 0.015]} castShadow>
          <boxGeometry args={[0.045, 0.09, 0.006]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.4} wireframe={wireframe} />
        </mesh>
        {/* Shadow-Casting Tip Sphere */}
        <mesh position={[0, 0.32, 0]}>
          <sphereGeometry args={[0.016, 8, 8]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={0.95}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}
