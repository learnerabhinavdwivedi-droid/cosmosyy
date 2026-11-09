import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function enableShadows(scene: THREE.Object3D) {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

export function LMDescent({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF("/models/lm-descent.glb");
  const ref = useRef<THREE.Group>(null);

  useEffect(() => enableShadows(scene), [scene]);

  return (
    <group ref={ref} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

export function LMAscent({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF("/models/lm-ascent.glb");
  const ref = useRef<THREE.Group>(null);

  useEffect(() => enableShadows(scene), [scene]);

  return (
    <group ref={ref} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/lm-descent.glb");
useGLTF.preload("/models/lm-ascent.glb");
