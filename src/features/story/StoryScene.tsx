import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { StoryPacket } from "./storySchema";
import { HeritageObject3D } from "../game/heritage3D/Heritage3DDispatcher";
import { getLunarRegolithTexture } from "../game/heritage3D/textures";

export interface StorySceneProps {
  packet?: StoryPacket;
  sceneIndex: number;
  action: string;
  cameraKeyframe: {
    pos: [number, number, number];
    look: [number, number, number];
  };
  reduceMotion?: boolean;
  isPlaying?: boolean;
}

/* ─── Smooth Cinematic Camera Rig ─── */
const _scratchDrift = new THREE.Vector3();
const _scratchDesiredPos = new THREE.Vector3();

function StoryCameraRig({
  cameraKeyframe,
  reduceMotion,
  isPlaying,
}: {
  cameraKeyframe: {
    pos: [number, number, number];
    look: [number, number, number];
  };
  reduceMotion?: boolean;
  isPlaying?: boolean;
}) {
  const { camera } = useThree();
  const currentLook = useRef(new THREE.Vector3(...cameraKeyframe.look));
  const targetPos = useMemo(() => new THREE.Vector3(...cameraKeyframe.pos), [cameraKeyframe.pos]);
  const targetLook = useMemo(
    () => new THREE.Vector3(...cameraKeyframe.look),
    [cameraKeyframe.look],
  );

  useFrame((state, delta) => {
    if (reduceMotion) {
      camera.position.copy(targetPos);
      currentLook.current.copy(targetLook);
      camera.lookAt(currentLook.current);
      return;
    }

    const t = isPlaying ? state.clock.getElapsedTime() : 0;
    // Gentle floating drift when playing
    const driftX = Math.sin(t * 0.4) * 0.04;
    const driftY = Math.cos(t * 0.5) * 0.03;

    _scratchDesiredPos.copy(targetPos).add(_scratchDrift.set(driftX, driftY, 0));
    const factor = Math.min(delta * 2.8, 1);

    camera.position.lerp(_scratchDesiredPos, factor);
    currentLook.current.lerp(targetLook, factor);
    camera.lookAt(currentLook.current);
  });

  return null;
}

/* ─── Lunar, Martian & Deep Space Environment (100% Deterministic) ─── */
function StoryEnvironment({ isMars = false, isDeepSpace = false }: { isMars?: boolean; isDeepSpace?: boolean }) {
  const regolithTex = useMemo(() => getLunarRegolithTexture(), []);
  const starsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = isDeepSpace ? 900 : 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 40 + ((i * 7) % 20);
      const theta = (i * 137.5 * Math.PI) / 180;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = isDeepSpace ? r * Math.cos(phi) : Math.abs(r * Math.cos(phi)) + 2;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [isDeepSpace]);

  const groundGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(28, 28, 48, 48);
    const pos = geo.attributes.position;
    if (!pos) return geo;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const crater = -Math.exp(-((x * x + y * y) / 16)) * 0.25;
      const noise =
        Math.sin(x * 0.8) * 0.06 + Math.cos(y * 0.7) * 0.05 + Math.sin((x + y) * 1.5) * 0.02;
      pos.setZ(i, crater + noise);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      starsGeo.dispose();
      groundGeo.dispose();
    };
  }, [starsGeo, groundGeo]);

  return (
    <>
      {/* Starfield */}
      <points geometry={starsGeo}>
        <pointsMaterial
          size={isDeepSpace ? 0.16 : 0.12}
          color={isMars ? "#ffedd5" : isDeepSpace ? "#7dd3fc" : "#ffffff"}
          transparent
          opacity={isMars ? 0.45 : isDeepSpace ? 0.9 : 0.75}
        />
      </points>

      {/* Ground Surface: Red Regolith for Mars, Slate Grey for Moon, Void for Deep Space */}
      {!isDeepSpace && (
        <mesh
          geometry={groundGeo}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.05, 0]}
          receiveShadow
        >
          <meshStandardMaterial
            map={isMars ? undefined : regolithTex}
            color={isMars ? "#883311" : "#475569"}
            roughness={0.96}
            metalness={0.02}
          />
        </mesh>
      )}
    </>
  );
}

/* ─── Streaming Solar Wind Particles ─── */
function SolarWindStream({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 240;

  const { geo, velocities } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const s1 = (Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1;
      const s2 = (Math.sin((i + 50) * 12.9898 + 78.233) * 43758.5453) % 1;
      const s3 = (Math.sin((i + 100) * 12.9898 + 78.233) * 43758.5453) % 1;
      const r1 = Math.abs(s1);
      const r2 = Math.abs(s2);
      const r3 = Math.abs(s3);

      positions[i * 3] = -4 + r1 * 8;
      positions[i * 3 + 1] = 0.5 + r2 * 2.0;
      positions[i * 3 + 2] = 3.5 + r3 * 4.0;

      vels[i * 3] = (r1 - 0.5) * 0.2;
      vels[i * 3 + 1] = -0.2 - r2 * 0.2;
      vels[i * 3 + 2] = -2.5 - r3 * 1.5;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geo: geometry, velocities: vels };
  }, []);

  useEffect(() => {
    return () => {
      geo.dispose();
    };
  }, [geo]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;
    const pos = pointsRef.current.geometry.attributes.position;
    if (!pos) return;

    for (let i = 0; i < count; i++) {
      let z = pos.getZ(i) + (velocities[i * 3 + 2] ?? 0) * delta;
      let y = pos.getY(i) + (velocities[i * 3 + 1] ?? 0) * delta;
      let x = pos.getX(i) + (velocities[i * 3] ?? 0) * delta;

      if (z < -0.5) {
        const resetS1 = Math.abs((Math.sin((i + z) * 12.9898 + 78.233) * 43758.5453) % 1);
        const resetS2 = Math.abs((Math.sin((i + x) * 12.9898 + 78.233) * 43758.5453) % 1);
        const resetS3 = Math.abs((Math.sin((i + y) * 12.9898 + 78.233) * 43758.5453) % 1);
        z = 5.0 + resetS1 * 2.0;
        x = -2.5 + resetS2 * 5.0;
        y = 0.8 + resetS3 * 1.5;
      }

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geo} visible={active}>
      <pointsMaterial
        size={0.035}
        color="#38bdf8"
        transparent
        opacity={active ? 0.75 : 0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Trapped Solar Wind Ions on Foil ─── */
function EmbeddedIons({ visible }: { visible: boolean }) {
  const count = 160;
  const geo = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const p1 = Math.abs((Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1);
      const p2 = Math.abs((Math.sin((i + 70) * 12.9898 + 78.233) * 43758.5453) % 1);
      const p3 = Math.abs((Math.sin((i + 140) * 12.9898 + 78.233) * 43758.5453) % 1);
      pos[i * 3] = (p1 - 0.5) * 0.32;
      pos[i * 3 + 1] = 0.55 + p2 * 1.25;
      pos[i * 3 + 2] = 0.015 + (p3 - 0.5) * 0.01;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geometry;
  }, []);

  return (
    <points geometry={geo} visible={visible}>
      <pointsMaterial
        size={0.025}
        color="#facc15"
        transparent
        opacity={visible ? 0.9 : 0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Solar Wind Composition Experiment Model with Dynamic Foil Arc ─── */
function SWCExperimentModel({
  action,
  isPlaying,
  reduceMotion,
}: {
  action: string;
  isPlaying?: boolean;
  reduceMotion?: boolean;
}) {
  const foilRef = useRef<THREE.Mesh>(null);
  const rolledGroupRef = useRef<THREE.Group>(null);

  const foilGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.35, 1.3, 16, 32);
    return geo;
  }, []);

  const isRolling = action === "roll";
  const isSpinning = action === "spin";
  const showStream = action === "particles" || action === "embed";
  const showIons = action === "embed" || action === "roll" || action === "spin";

  useFrame((state, delta) => {
    // Foil subtle vacuum ripple
    if (foilRef.current && !reduceMotion && !isRolling && !isSpinning) {
      const t = isPlaying ? state.clock.getElapsedTime() : 0;
      const pos = foilRef.current.geometry.attributes.position;
      if (pos) {
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const ripple = Math.sin(x * 12 + t * 2.5) * 0.012 + Math.cos(y * 8 + t * 1.8) * 0.008;
          pos.setZ(i, ripple);
        }
        pos.needsUpdate = true;
      }
    }

    // Spin animation in legacy beat
    if (rolledGroupRef.current && isSpinning) {
      rolledGroupRef.current.rotation.y += delta * 0.8;
      rolledGroupRef.current.position.y = 1.6 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Aluminum Staff Pole (1.9m) */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.02, 1.9, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Top Reel Mount & Crossbar */}
      <mesh position={[0, 1.88, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.44, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* Red Swiss Deployment Pull-Tab with White Cross */}
      <group position={[0.22, 1.88, 0]}>
        <mesh>
          <boxGeometry args={[0.015, 0.042, 0.032]} />
          <meshStandardMaterial color="#dc2626" roughness={0.25} />
        </mesh>
        <mesh position={[0.009, 0, 0]}>
          <boxGeometry args={[0.002, 0.026, 0.008]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0.009, 0, 0]}>
          <boxGeometry args={[0.002, 0.008, 0.026]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
      </group>

      {/* Bottom Tension Roller Weight Bar */}
      <mesh position={[0, 0.54, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.38, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Base Regolith Soil Mound */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <coneGeometry args={[0.24, 0.07, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.98} metalness={0} />
      </mesh>

      {/* Foil Sheet when deployed */}
      {!isSpinning && (
        <group position={[0, 1.2, 0.01]}>
          <mesh
            ref={foilRef}
            geometry={foilGeo}
            castShadow
            scale={isRolling ? [0.15, 1.0, 0.15] : [1, 1, 1]}
          >
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.45}
              roughness={0.24}
              emissive="#475569"
              emissiveIntensity={0.28}
              side={THREE.DoubleSide}
            />
          </mesh>
          <EmbeddedIons visible={showIons} />
        </group>
      )}

      {/* Rolled Foil Canister for end of mission / legacy */}
      {(isRolling || isSpinning) && (
        <group ref={rolledGroupRef} position={[0, isSpinning ? 1.6 : 1.88, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.42, 24]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.05]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.048, 0.048, 0.03, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>
      )}

      {/* Incoming Solar Wind Ion Flow */}
      <SolarWindStream active={showStream} />
    </group>
  );
}

/* ─── Universal Authentic Heritage Object with Cinematic Story Actions ─── */
function DedicatedStoryObject({
  missionId,
  objectId,
  action,
  isPlaying,
  reduceMotion,
}: {
  missionId: string;
  objectId: string;
  action: string;
  isPlaying?: boolean;
  reduceMotion?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current || reduceMotion) return;
    if (action === "spin" || action === "legacy") {
      groupRef.current.rotation.y += delta * 0.35;
    } else if (isPlaying) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  const explodeFactor = action === "mechanism" ? 0.35 : action === "closeup" ? 0.12 : 0;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <HeritageObject3D
        missionId={missionId}
        objectId={objectId}
        explode={explodeFactor}
        scale={1.0}
      />
    </group>
  );
}

/* ─── Main 3D Canvas Scene ─── */
export function StoryScene({
  packet,
  action,
  cameraKeyframe,
  reduceMotion = false,
  isPlaying = true,
}: StorySceneProps) {
  const isMars =
    packet?.environment === "mars-surface" || packet?.missionId.startsWith("mars") || false;
  const isDeepSpace =
    packet?.environment === "deep-space" ||
    packet?.missionId.startsWith("deep-") ||
    packet?.missionId.startsWith("deepspace-") ||
    false;
  const isSWC = packet?.id === "swc";

  return (
    <Canvas
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ fov: 40, near: 0.1, far: 100, position: cameraKeyframe.pos }}
      style={{
        background: isMars
          ? "#160604"
          : isDeepSpace
            ? "#010206"
            : "#020408",
      }}
    >
      {/* Dynamic Aerospace Studio & Lunar Surface Lighting */}
      <ambientLight
        intensity={isMars ? 0.6 : isDeepSpace ? 0.5 : 0.42}
        color={isMars ? "#fed7aa" : isDeepSpace ? "#bae6fd" : "#f1f5f9"}
      />
      {/* Front-Right Direct Solar Key Light */}
      <directionalLight
        position={[6, 9, 8]}
        intensity={3.4}
        color={isMars ? "#ffedd5" : isDeepSpace ? "#e0f2fe" : "#ffffff"}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Front-Left Earthshine Fill Light */}
      <directionalLight
        position={[-7, 5, 7]}
        intensity={1.0}
        color={isMars ? "#ea580c" : isDeepSpace ? "#38bdf8" : "#7dd3fc"}
      />
      {/* Ground Horizon Rim Bounce */}
      <directionalLight
        position={[0, -2, -5]}
        intensity={0.4}
        color={isMars ? "#9a3412" : isDeepSpace ? "#0284c7" : "#94a3b8"}
      />
      <hemisphereLight
        args={[
          isMars ? "#f97316" : isDeepSpace ? "#38bdf8" : "#e2e8f0",
          isMars ? "#431407" : isDeepSpace ? "#030712" : "#0f172a",
          0.35,
        ]}
      />

      <StoryEnvironment isMars={isMars} isDeepSpace={isDeepSpace} />

      <Suspense fallback={null}>
        {isSWC ? (
          <SWCExperimentModel action={action} isPlaying={isPlaying} reduceMotion={reduceMotion} />
        ) : packet ? (
          <DedicatedStoryObject
            missionId={packet.missionId}
            objectId={packet.id}
            action={action}
            isPlaying={isPlaying}
            reduceMotion={reduceMotion}
          />
        ) : null}
      </Suspense>

      <StoryCameraRig
        cameraKeyframe={cameraKeyframe}
        reduceMotion={reduceMotion}
        isPlaying={isPlaying}
      />
    </Canvas>
  );
}
