export interface ArtifactProps {
  explode?: number;
  wireframe?: boolean;
  scale?: number;
}

export interface ExplodeComponent {
  name: string;
  explode_vector: [number, number, number];
  part_name: string;
}

export function MarsLandscapeFeature3D({
  wireframe = false,
  scale = 1,
}: ArtifactProps & { _name?: string; name?: string }) {
  return (
    <group scale={scale}>
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[1.4, 1.8, 0.4, 24]} />
        <meshStandardMaterial
          color="#a35c39"
          roughness={0.95}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <dodecahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#8b4a26" roughness={0.92} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.45, 0.2, 0.3]} castShadow>
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color="#b86940" roughness={0.88} wireframe={wireframe} />
      </mesh>
      {/* Site Name Label Plaque Base */}
      <mesh position={[0, 0.05, 1.6]} rotation={[-Math.PI / 4, 0, 0]}>
        <boxGeometry args={[1.2, 0.18, 0.03]} />
        <meshStandardMaterial color="#2d1c14" roughness={0.7} metalness={0.3} />
      </mesh>
    </group>
  );
}
