import { useRef, useEffect, useLayoutEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { hasDedicated3DModel, HeritageObject3D } from "../heritage3D/Heritage3DDispatcher";
import type { HologramManifest, ObjectTheme } from "./types";

export type LightingMode = "studio" | "solar" | "deep-space";

/* ─── Studio 3D Model with Blender PBR Finish ─── */
function HoloModel({
  url,
  explode,
  wireframe,
  autoRotate = true,
  manifest,
}: {
  url: string;
  explode: number;
  wireframe?: boolean;
  themeColor?: string;
  autoRotate?: boolean;
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
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.22;
    }
  });

  const box = useMemo(() => {
    const b = new THREE.Box3().setFromObject(clonedScene);
    const size = b.getSize(new THREE.Vector3());
    const center = b.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 1.35;
    const scale = targetSize / (maxDim || 1);
    return { center, scale, minY: b.min.y };
  }, [clonedScene]);

  return (
    <group ref={groupRef}>
      <group
        scale={[box.scale, box.scale, box.scale]}
        position={[
          -box.center.x * box.scale,
          -box.minY * box.scale - 0.32,
          -box.center.z * box.scale,
        ]}
      >
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

/* ─── Blender Studio 3-Point Lighting Setup with Aerospace Bounce ─── */
function StudioLighting({
  themeColor = "#38bdf8",
  mode = "studio",
}: {
  themeColor?: string;
  mode?: LightingMode;
}) {
  if (mode === "solar") {
    // Harsh, raw, unfiltered directional solar radiation in vacuum
    return (
      <>
        <ambientLight intensity={0.4} color="#8899aa" />
        <directionalLight
          position={[6, 3, 4]}
          intensity={4.2}
          color="#fffaf0"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-4, -2, -3]} intensity={0.2} color="#112233" />
        <pointLight position={[0, -1.5, 0]} intensity={0.6} color={themeColor} />
      </>
    );
  }

  if (mode === "deep-space") {
    // Dramatic low-key rim lighting in dark cosmic void
    return (
      <>
        <ambientLight intensity={0.3} color="#1e1b4b" />
        <directionalLight position={[0, 6, -5]} intensity={3.5} color="#38bdf8" />
        <directionalLight position={[-5, 2, 3]} intensity={2.0} color="#f43f5e" />
        <directionalLight position={[5, 1, 3]} intensity={1.5} color="#e0f2fe" />
        <pointLight position={[0, -1.8, 1.2]} intensity={2.2} color={themeColor} />
      </>
    );
  }

  // Balanced Museum Studio 3-Point Lighting
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
    <group position={[0, -0.32, 0]}>
      {/* Dark core contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.1, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.7} depthWrite={false} />
      </mesh>
      {/* Outer ambient occlusion falloff */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      {/* Inner glowing telemetry ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.008, 0]}>
        <ringGeometry args={[1.15, 1.18, 64]} />
        <meshBasicMaterial color={themeColor} transparent opacity={0.3} depthWrite={false} />
      </mesh>
      {/* Outer primary range ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[1.32, 1.35, 64]} />
        <meshBasicMaterial color={themeColor} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      {/* Hologram alignment ticks at 90° intervals */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <mesh
          key={idx}
          rotation={[-Math.PI / 2, 0, angle]}
          position={[Math.cos(angle) * 1.335, -0.009, Math.sin(angle) * 1.335]}
        >
          <planeGeometry args={[0.08, 0.015]} />
          <meshBasicMaterial color={themeColor} transparent opacity={0.8} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Ambient Cosmic Dust Particles (100% Deterministic, No Math.random) ─── */
function CosmicDust({ count = 36, color = "#93c5fd" }: { count?: number; color?: string }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const s1 = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      const s2 = Math.sin(i * 269.5 + 183.3) * 43758.5453;
      const s3 = Math.sin(i * 419.2 + 371.9) * 43758.5453;
      const r1 = s1 - Math.floor(s1) - 0.5;
      const r2 = s2 - Math.floor(s2);
      const r3 = s3 - Math.floor(s3) - 0.5;

      coords[i * 3] = r1 * 4.2;
      coords[i * 3 + 1] = r2 * 2.2 - 0.2;
      coords[i * 3 + 2] = r3 * 4.2;
    }
    return coords;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color={color} transparent opacity={0.35} depthWrite={false} />
    </points>
  );
}

/* ─── Camera auto-fit ─── */
function AutoCamera({ resetTrigger = 0 }: { resetTrigger?: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(2.4, 1.15, 2.4);
    camera.lookAt(0, 0.08, 0);
  }, [camera, resetTrigger]);
  return null;
}

/* ─── Clean object bounding box fit without compounding transform bug ─── */
const _fitBox = new THREE.Box3();
const _fitSize = new THREE.Vector3();
const _fitCenter = new THREE.Vector3();

function fitObject(pivot: THREE.Group, content: THREE.Group, targetSize = 1.3): boolean {
  pivot.position.set(0, 0, 0);
  pivot.scale.set(1, 1, 1);
  pivot.rotation.set(0, 0, 0);
  pivot.updateMatrixWorld(true);
  content.updateWorldMatrix(true, true);

  _fitBox.setFromObject(content);
  if (_fitBox.isEmpty()) return false;

  _fitBox.getSize(_fitSize);
  _fitBox.getCenter(_fitCenter);
  const maxDim = Math.max(_fitSize.x, _fitSize.y, _fitSize.z);
  if (maxDim <= 0.001) return false;

  const s = targetSize / maxDim;
  pivot.scale.set(s, s, s);
  pivot.position.set(-_fitCenter.x * s, -_fitBox.min.y * s - 0.32, -_fitCenter.z * s);
  return true;
}

/* ─── Dedicated Procedural 3D Model with Blender Finish ─── */
function DedicatedHoloModel({
  missionId,
  objectId,
  explode,
  wireframe,
  autoRotate = true,
}: {
  missionId: string;
  objectId: string;
  explode: number;
  wireframe?: boolean;
  autoRotate?: boolean;
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
    // 1.30 target size provides a majestic hero scale across the full viewport
    if (fitObject(pivotRef.current, contentRef.current, 1.3)) {
      centeredRef.current = true;
    }
  }, [missionId, objectId, explode]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.22;
    }
    if (!centeredRef.current && contentRef.current && pivotRef.current) {
      if (fitObject(pivotRef.current, contentRef.current, 1.3)) {
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
  autoRotate = true,
  lightingMode = "studio",
  resetTrigger = 0,
  manifest,
}: {
  missionId: string;
  objectId: string;
  modelUrl: string;
  explode: number;
  wireframe?: boolean;
  theme: ObjectTheme;
  autoRotate?: boolean;
  lightingMode?: LightingMode;
  resetTrigger?: number;
  manifest?: HologramManifest | null;
}) {
  const isDedicated = hasDedicated3DModel(missionId, objectId);

  return (
    <Canvas
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ fov: 36, near: 0.1, far: 100, position: [2.6, 1.25, 2.6] }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <StudioLighting themeColor={theme.primary} mode={lightingMode} />
      <Suspense fallback={null}>
        {isDedicated ? (
          <DedicatedHoloModel
            missionId={missionId}
            objectId={objectId}
            explode={explode}
            wireframe={wireframe}
            autoRotate={autoRotate}
          />
        ) : (
          <HoloModel
            url={modelUrl}
            explode={explode}
            wireframe={wireframe}
            themeColor={theme.primary}
            autoRotate={autoRotate}
            manifest={manifest}
          />
        )}
      </Suspense>
      <ContactShadow themeColor={theme.primary} />
      <CosmicDust count={36} color={theme.primary} />
      <AutoCamera resetTrigger={resetTrigger} />
      <OrbitControls
        enableZoom={true}
        minDistance={1.4}
        maxDistance={5.5}
        target={[0, 0, 0]}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.06}
        autoRotate={false}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 1.95}
      />
    </Canvas>
  );
}
