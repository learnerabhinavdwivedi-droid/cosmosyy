import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const KAPTON_GOLD = new THREE.Color("#C9A23A");
const ASCENT_GREY = new THREE.Color("#B0B0B0");
const THERMAL_BLACK = new THREE.Color("#1a1a1a");

function applyLMMaterials(scene: THREE.Group) {
  const nodeLog: string[] = [];

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const y = child.position.y;
    const name = child.name || "(unnamed)";
    nodeLog.push(`${name} y=${y.toFixed(2)}`);

    const bbox = new THREE.Box3().setFromObject(child);
    const midY = (bbox.min.y + bbox.max.y) / 2;
    const isDescent = midY < 2.5;

    if (isDescent) {
      const isLeg =
        bbox.min.y < 0.5 && (bbox.max.y - bbox.min.y) > 1;

      if (isLeg) {
        child.material = new THREE.MeshStandardMaterial({
          color: THERMAL_BLACK,
          roughness: 0.8,
          metalness: 0.2,
        });
      } else {
        child.material = new THREE.MeshPhysicalMaterial({
          color: KAPTON_GOLD,
          metalness: 1.0,
          roughness: 0.35,
          clearcoat: 0.1,
          clearcoatRoughness: 0.4,
        });
      }
    } else {
      child.material = new THREE.MeshStandardMaterial({
        color: ASCENT_GREY,
        roughness: 0.6,
        metalness: 0.3,
      });
    }

    child.castShadow = true;
    child.receiveShadow = true;
  });

  if (import.meta.env.DEV) {
    console.log("[LM] Node tree:", nodeLog.join(", "));
  }
}

export function LunarModule({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF("/models/lunar-module.glb");
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    applyLMMaterials(scene);
  }, [scene]);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/lunar-module.glb");
