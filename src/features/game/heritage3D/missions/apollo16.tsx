import { useMemo } from "react";
import type { ArtifactProps } from "./shared";
import { getDukeFamilyPhotoTexture } from "../textures";

export function UVCamera3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const barrelY = explode * 0.3;

  return (
    <group scale={scale}>
      {/* 3-Legged Tripod Mount */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={deg} position={[0, 0.28, 0]} rotation={[0, rad, 0]}>
            <mesh position={[0.2, -0.15, 0]} rotation={[0, 0, -0.6]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.65, 8]} />
              <meshStandardMaterial
                color="#e2e8f0"
                metalness={0.9}
                roughness={0.2}
                wireframe={wireframe}
              />
            </mesh>
            <mesh position={[0.38, -0.42, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.015, 12]} />
              <meshStandardMaterial
                color="#94a3b8"
                metalness={0.8}
                roughness={0.3}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        );
      })}

      {/* Camera Housing & Schmidt Telescope Barrel */}
      <group position={[0, 0.45 + barrelY, 0]}>
        {/* Main Gold-anodized Spectrograph Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.24, 0.35, 20]} />
          <meshStandardMaterial
            color="#dfa230"
            metalness={0.92}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Optical Aperture Schmidt Barrel */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.12, 0.16, 0.16, 20]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.85}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
        {/* Optical Quartz Collector Window */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.01, 16]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.1}
            metalness={0.9}
            wireframe={wireframe}
          />
        </mesh>
        {/* Film Canister Drum on side */}
        <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
          <meshStandardMaterial
            color="#f1f5f9"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

export function FamilyPhoto3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const photoTex = useMemo(() => getDukeFamilyPhotoTexture(), []);
  const wrapY = explode * 0.25;

  return (
    <group scale={scale}>
      {/* Photograph Board */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0.18]} castShadow receiveShadow>
        <planeGeometry args={[0.32, 0.24]} />
        <meshStandardMaterial
          map={wireframe ? undefined : photoTex}
          color={wireframe ? "#00ffff" : "#ffffff"}
          roughness={0.25}
          metalness={0.1}
          wireframe={wireframe}
        />
      </mesh>

      {/* Clear Plastic Shrink-Wrap Envelope */}
      <group position={[0, wrapY, 0]}>
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0.18]}>
          <planeGeometry args={[0.36, 0.28]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={wireframe ? 0.3 : 0.22}
            roughness={0.1}
            metalness={0.15}
            wireframe={wireframe}
          />
        </mesh>
        {/* Shrink-wrap seal crimp border */}
        <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0.18]}>
          <ringGeometry args={[0.15, 0.18, 4]} />
          <meshStandardMaterial color="#94a3b8" transparent opacity={0.35} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}
