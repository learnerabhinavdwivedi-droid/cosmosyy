import { useRef, useEffect, useLayoutEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { hasDedicated3DModel, HeritageObject3D } from "../heritage3D/Heritage3DDispatcher";
import type { HologramManifest, ObjectTheme } from "./types";

/* ─── Studio 3D Model with Blender PBR Finish ─── */
function HoloModel({
  url,
  explode,
  wireframe,
  manifest,
}: {
  url: string;
  explode: number;
  wireframe?: boolean;
  themeColor?: string;
  manifest?: HologramManifest | null;
}) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Preserve authentic Blender PBR textures, metallics, and foils
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!mesh.userData.origMaterial) {
          mesh.userData.origMaterial = mesh.material;
        }

        if (wireframe) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#44eeff"),
            emissive: new THREE.Color("#0088cc"),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.45,
            wireframe: true,
            side: THREE.DoubleSide,
          });
        } else {
          mesh.material = mesh.userData.origMaterial;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      }
    });
  }, [clonedScene, wireframe]);

  // Exploded view offset animation
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        if (!child.userData.origPos) {
          child.userData.origPos = child.position.clone();
        }
        if (manifest && manifest.components) {
          const lowerName = child.name.toLowerCase();
          const comp = manifest.components.find((c) => {
            const cName = c.name.toLowerCase();
            return lowerName === cName || lowerName.includes(cName) || cName.includes(lowerName);
          });
          if (comp && comp.explode_vector) {
            const factor = explode * 1.5;
            child.position.set(
              child.userData.origPos.x + comp.explode_vector[0] * factor,
              child.userData.origPos.y + comp.explode_vector[1] * factor,
              child.userData.origPos.z + comp.explode_vector[2] * factor,
            );
            return;
          }
        }
        child.position.copy(child.userData.origPos);
      }
    });
  }, [clonedScene, manifest, explode]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.22;
    }
  });

  const box = useMemo(() => {
    const b = new THREE.Box3().setFromObject(clonedScene);
    const size = b.getSize(new THREE.Vector3());
    const center = b.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 0.85;
    const scale = targetSize / (maxDim || 1);
    return { center, scale };
  }, [clonedScene]);

  return (
    <group ref={groupRef}>
      <group
        scale={[box.scale, box.scale, box.scale]}
        position={[
          -box.center.x * box.scale,
          -box.center.y * box.scale,
          -box.center.z * box.scale,
        ]}
      >
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

/* ─── Blender Studio 3-Point Lighting Setup with Aerospace Bounce ─── */
function StudioLighting({ themeColor = "#38bdf8" }: { themeColor?: string }) {
  return (
    <>
      <ambientLight intensity={1.6} color="#ffffff" />
      <directionalLight
        position={[3, 5, 5]}
        intensity={2.8}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 3, 4]} intensity={2.2} color="#e0f2fe" />
      <directionalLight position={[0, 6, -6]} intensity={2.6} color="#ffe4cc" />
      <pointLight position={[0, 4.5, 0]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, -1.8, 1.2]} intensity={1.4} color={themeColor} />
    </>
  );
}

/* ─── Studio Pedestal Contact Shadow & Glowing Reticle ─── */
function ContactShadow({ themeColor = "#38bdf8" }: { themeColor?: string }) {
  return (
    <group position={[0, -0.48, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.7} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.6, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.008, 0]}>
        <ringGeometry args={[1.28, 1.31, 64]} />
        <meshBasicMaterial color={themeColor} transparent opacity={0.25} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[1.45, 1.48, 64]} />
        <meshBasicMaterial color={themeColor} transparent opacity={0.5} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ─── Camera auto-fit ─── */
function AutoCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(2.8, 1.35, 2.8);
    camera.lookAt(0, -0.02, 0);
  }, [camera]);
  return null;
}

/* ─── Clean object bounding box fit without compounding transform bug ─── */
function fitObject(pivot: THREE.Group, content: THREE.Group, targetSize = 0.85): boolean {
  pivot.position.set(0, 0, 0);
  pivot.scale.set(1, 1, 1);
  pivot.rotation.set(0, 0, 0);
  pivot.updateMatrixWorld(true);
  content.updateWorldMatrix(true, true);

  const box = new THREE.Box3().setFromObject(content);
  if (box.isEmpty()) return false;

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim <= 0.001) return false;

  const s = targetSize / maxDim;
  pivot.scale.set(s, s, s);
  pivot.position.set(-center.x * s, -center.y * s, -center.z * s);
  return true;
}

/* ─── Dedicated Procedural 3D Model with Blender Finish ─── */
function DedicatedHoloModel({
  missionId,
  objectId,
  explode,
  wireframe,
}: {
  missionId: string;
  objectId: string;
  explode: number;
  wireframe?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pivotRef = useRef<THREE.Group>(null);
  const contentRef = useRef<THREE.Group>(null);
  const centeredRef = useRef(false);

  useEffect(() => {
    centeredRef.current = false;
  }, [missionId, objectId, explode]);

  useLayoutEffect(() => {
    if (!contentRef.current || !pivotRef.current) return;
    if (fitObject(pivotRef.current, contentRef.current, 0.85)) {
      centeredRef.current = true;
    }
  }, [missionId, objectId, explode]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.22;
    }
    if (!centeredRef.current && contentRef.current && pivotRef.current) {
      if (fitObject(pivotRef.current, contentRef.current, 0.85)) {
        centeredRef.current = true;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={pivotRef}>
        <group ref={contentRef}>
          <HeritageObject3D
            missionId={missionId}
            objectId={objectId}
            wireframe={wireframe}
            explode={explode}
            scale={1.0}
          />
        </group>
      </group>
    </group>
  );
}

/* ─── 3D Viewer canvas with Blender Finish ─── */
export function HoloCanvas({
  missionId,
  objectId,
  modelUrl,
  explode,
  wireframe,
  theme,
  manifest,
}: {
  missionId: string;
  objectId: string;
  modelUrl: string;
  explode: number;
  wireframe?: boolean;
  theme: ObjectTheme;
  manifest?: HologramManifest | null;
}) {
  const isDedicated = hasDedicated3DModel(missionId, objectId);

  return (
    <Canvas
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ fov: 36, near: 0.1, far: 100, position: [2.8, 1.35, 2.8] }}
      style={{ background: "transparent" }}
    >
      <StudioLighting themeColor={theme.primary} />
      <Suspense fallback={null}>
        {isDedicated ? (
          <DedicatedHoloModel
            missionId={missionId}
            objectId={objectId}
            explode={explode}
            wireframe={wireframe}
          />
        ) : (
          <HoloModel
            url={modelUrl}
            explode={explode}
            wireframe={wireframe}
            themeColor={theme.primary}
            manifest={manifest}
          />
        )}
      </Suspense>
      <ContactShadow themeColor={theme.primary} />
      <AutoCamera />
      <OrbitControls
        enableZoom={true}
        minDistance={1.4}
        maxDistance={5.5}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
        autoRotate={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.95}
      />
    </Canvas>
  );
}
