import { useMemo } from "react";
import type { ArtifactProps } from "./shared";
import { MarsLandscapeFeature3D } from "./shared";
import {
  getCalibrationTargetTexture,
} from "../textures";

export function MarsDrillHoles3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const liftY = explode * 0.15;

  return (
    <group scale={scale} position={[0, liftY, 0]}>
      {/* Grey Lakebed Mudstone Bedrock Outcrop */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.12, 0.8]} />
        <meshStandardMaterial color="#78716c" roughness={0.92} metalness={0.1} wireframe={wireframe} />
      </mesh>

      {/* Drill Hole 1 (Deep borehole + pulverized grey cuttings ring) */}
      <group position={[-0.15 - explode * 0.1, 0.125, 0]}>
        {/* Grey tailings powder halo */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.14, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.95} metalness={0.05} wireframe={wireframe} />
        </mesh>
        {/* Cylindrical Borehole recess */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.1, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.95} metalness={0.1} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Drill Hole 2 */}
      <group position={[0.15 + explode * 0.1, 0.125, -0.05]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.14, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.95} metalness={0.05} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.1, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.95} metalness={0.1} wireframe={wireframe} />
        </mesh>
      </group>

      {/* 5-point ChemCam Laser Plasma Scorch Marks */}
      {[-0.08, -0.04, 0, 0.04, 0.08].map((lx, idx) => (
        <mesh key={idx} position={[lx, 0.122, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.008, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} wireframe={wireframe} />
        </mesh>
      ))}
    </group>
  );
}

export function MarsCalibrationTarget3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const calibTex = useMemo(() => getCalibrationTargetTexture(), []);
  const gnomonY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Anodized Aluminum Mounting Bracket */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.55, 0.55, 0.05]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* Color and Metric Target Face */}
      <mesh position={[0, 0.25, 0.03]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial map={calibTex} roughness={0.5} metalness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Center Sundial Gnomon Pin */}
      <mesh position={[0, 0.25, 0.12 + gnomonY]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.015, 0.16, 12]} />
        <meshStandardMaterial color="#e5b842" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>

      {/* 1909 VDB Lincoln Wheat Penny Replica */}
      <group position={[0.16, 0.09, 0.035]} rotation={[0, 0, 0.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.006, 16]} />
          <meshStandardMaterial color="#b45309" metalness={0.88} roughness={0.35} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

export function SkyCraneDescentStage3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const spread = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Impact Debris Crater Berm */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.5, 1.4, 24]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.96} metalness={0.05} wireframe={wireframe} />
      </mesh>

      {/* Charred Spherical Titanium Propellant Tanks */}
      <mesh position={[-0.25 - spread, 0.18, -0.1]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.3} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.3 + spread, 0.16, 0.15]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* Canted Mars Lander Descent Rocket Engines (MLE Nozzles) */}
      <mesh position={[0, 0.14 + explode * 0.2, 0.28]} rotation={[0.4, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.16, 0.28, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.25} wireframe={wireframe} />
      </mesh>

      {/* Twisted Carbon Composite Tubular Truss Structure */}
      <mesh position={[-0.05, 0.12, 0]} rotation={[0.3, 0.6, -0.2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.85, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

export function YellowknifeBayFeature3D(props: ArtifactProps) {
  return <MarsLandscapeFeature3D name="Yellowknife Bay" {...props} />;
}

export function MountSharpFeature3D(props: ArtifactProps) {
  return <MarsLandscapeFeature3D name="Mount Sharp" {...props} />;
}
