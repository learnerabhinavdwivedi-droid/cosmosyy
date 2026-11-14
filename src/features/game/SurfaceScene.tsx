import {
  useRef,
  useEffect,
  useState,
  useCallback,
  Suspense,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Stars, Text, useGLTF, Preload } from "@react-three/drei";
import { Effects } from "./Effects";
import { useGameStore } from "@/store/useGameStore";
import { useAppStore } from "@/store/useAppStore";
import { useTouchStore } from "@/store/useTouchStore";
import { isTouchDevice } from "@/lib/useMobile";
import { useFullscreen } from "@/lib/fullscreen";
import { gameAudio } from "@/lib/gameAudio";
import { getMission, type HeritageObject } from "@/lib/missionData";
import { LMDescent } from "./LunarModule";
import { Terrain, GroundPlane } from "./Terrain";
import { EarthAtmosphere } from "./EarthAtmosphere";
import { getSunPosition, getEarthPosition } from "./sunPosition";
import { TouchControls } from "./TouchControls";
import { HologramInspect } from "./HologramInspect";
import MarsLander from "./MarsLander";
import {
  Exosuit,
  WalkerHUD,
  dampAngle,
  DEFAULT_MOON_CFG,
  DEFAULT_MARS_CFG,
} from "./AstronautWalker";
import { getThemeColor3 } from "./objectThemes";
import { getTerrainElevation } from "./terrainHeight";
import { getHologramModel } from "./hologramMapping";
import { hasDedicated3DModel, HeritageObject3D } from "./heritage3D/Heritage3DDispatcher";
import { AmericanFlag3D } from "./heritage3D/MoonArtifacts";
import * as THREE from "three";

const SCAN_RANGE = 12;

function HoloParticles({ color, speed }: { color: string; speed: number }) {
  const ref = useRef<THREE.Points>(null);
  const count = 14;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      arr[i * 3] = Math.cos(angle) * 1.5;
      arr[i * 3 + 1] = 0.5 + (i % 4) * 0.6;
      arr[i * 3 + 2] = Math.sin(angle) * 1.5;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    if (!posAttr) return;
    const t = Date.now() * 0.001 * speed;
    for (let i = 0; i < count; i++) {
      const baseAngle = (i / count) * Math.PI * 2;
      const angle = baseAngle + t;
      const r = 1.2 + Math.sin(t * 2 + i) * 0.3;
      const y = 0.5 + (i % 4) * 0.6 + Math.sin(t * 1.5 + i * 0.7) * 0.3;
      posAttr.setXYZ(i, Math.cos(angle) * r, y, Math.sin(angle) * r);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.08}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

const NAME_VISIBLE_RANGE = 40;
const PROXIMITY_RANGE = 15;

function FloatingArrow({ isFound, themeColor, distance }: { isFound: boolean; themeColor: string; distance: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const t = Date.now() * 0.001;
    groupRef.current.position.y = 5 + Math.sin(t * 2) * 0.4;
    if (glowRef.current) {
      const glowStrength = Math.min(distance / 40, 1);
      glowRef.current.intensity = isFound ? 0.3 : 1.5 + glowStrength * 3 + Math.sin(t * 3) * 0.5;
    }
  });

  const color = isFound ? "#66ff99" : themeColor;

  return (
    <group ref={groupRef} position={[0, 5, 0]}>
      <pointLight ref={glowRef} color={color} intensity={1.5} distance={12} decay={2} />
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.35, 0.8, 6]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isFound ? 0.4 : 0.85}
        />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 6]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isFound ? 0.3 : 0.7}
        />
      </mesh>
    </group>
  );
}

/* ─── Ground Physical 3D Object with Authentic Blender Finish ─── */
function GroundObject({ url, baseScale = 1.0 }: { url: string; baseScale?: number }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [cloned]);

  const box = useMemo(() => {
    const b = new THREE.Box3().setFromObject(cloned);
    const size = b.getSize(new THREE.Vector3());
    const center = b.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = baseScale / (maxDim || 1);
    const bottomY = b.min.y;
    return { center, scale, bottomY };
  }, [cloned, baseScale]);

  return (
    <group
      scale={[box.scale, box.scale, box.scale]}
      position={[
        -box.center.x * box.scale,
        -box.bottomY * box.scale,
        -box.center.z * box.scale,
      ]}
    >
      <primitive object={cloned} />
    </group>
  );
}

function HeritageMarker({
  obj,
  isFound,
  isNear,
  distance,
  isMars,
  lat = 0,
  lon = 0,
  missionId,
}: {
  obj: HeritageObject;
  isFound: boolean;
  isNear: boolean;
  distance: number;
  isMars?: boolean;
  lat?: number;
  lon?: number;
  missionId?: string;
}) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const isDedicated = missionId ? hasDedicated3DModel(missionId, obj.id) : false;
  const modelEntry = useMemo(
    () => (missionId && !isDedicated ? getHologramModel(missionId, obj.id) : null),
    [missionId, obj.id, isDedicated],
  );

  useFrame(() => {
    const t = Date.now() * 0.001;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.5;
      const baseOpacity = isNear ? 0.5 : 0.2;
      (outerRingRef.current.material as THREE.MeshBasicMaterial).opacity =
        baseOpacity + Math.sin(t * 3) * 0.1;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.8;
      const baseOpacity = isNear ? 0.4 : 0.15;
      (innerRingRef.current.material as THREE.MeshBasicMaterial).opacity =
        baseOpacity + Math.sin(t * 2 + 1) * 0.1;
    }
    if (pulseRef.current) {
      const pulseScale = 1 + Math.sin(t * 2) * 0.3;
      pulseRef.current.scale.set(pulseScale, 1, pulseScale);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity =
        isNear ? 0.12 : 0.05;
    }
  });

  if (obj.id === "descent-stage" || obj.hidden) return null;

  const themeColor = getThemeColor3(obj.id);
  const baseColor = isFound ? "#66ff99" : isNear ? themeColor : (isMars ? "#e8a050" : "#ffd36e");
  const showName = distance < NAME_VISIBLE_RANGE;

  const terrainY = getTerrainElevation(
    obj.position[0],
    obj.position[2],
    isMars ? "mars" : "moon",
    lat,
    lon,
  );

  return (
    <group position={[obj.position[0], obj.position[1] + terrainY - 0.035, obj.position[2]]}>
      {/* Real 3D physical heritage object with Blender finish */}
      {missionId && isDedicated ? (
        <HeritageObject3D
          missionId={missionId}
          objectId={obj.id}
          scale={1.0}
        />
      ) : modelEntry ? (
        <Suspense fallback={null}>
          <GroundObject url={modelEntry.modelPath} baseScale={1.2} />
        </Suspense>
      ) : null}

      <FloatingArrow isFound={isFound} themeColor={themeColor} distance={distance} />

      <mesh
        ref={outerRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.1, 0]}
      >
        <torusGeometry args={[1.2, 0.03, 8, 48]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={innerRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.15, 0]}
      >
        <torusGeometry args={[0.7, 0.02, 8, 32]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={pulseRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
      >
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {isNear && !isFound && (
        <HoloParticles color={baseColor} speed={2} />
      )}

      {showName && (
        <Text
          position={[0, 2.2, 0]}
          fontSize={0.28}
          color={isFound ? "#66ff99" : "#ffffff"}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {obj.name}
          {isFound ? " ✓" : ""}
        </Text>
      )}
    </group>
  );
}

function ProximityDetector({
  setNearObjectId,
  setObjectDistances,
  objects,
}: {
  setNearObjectId: (id: string | null) => void;
  setObjectDistances: (d: Record<string, number>) => void;
  objects: HeritageObject[];
}) {
  const { camera } = useThree();
  const foundRef = useRef(useGameStore.getState().objectsFoundThisRun);
  const prevNearest = useRef<string | null>(null);
  const prevProximity = useRef<Set<string>>(new Set());
  const lastPingTime = useRef(0);
  const distancesRef = useRef<Record<string, number>>({});
  const distanceUpdateTimer = useRef(0);

  useEffect(
    () => useGameStore.subscribe((s) => { foundRef.current = s.objectsFoundThisRun; }),
    [],
  );

  useFrame((_state, rawDelta) => {
    let nearest: string | null = null;
    let minDist = SCAN_RANGE;
    const found = foundRef.current;
    const nowInProximity = new Set<string>();

    for (const obj of objects) {
      const dx = camera.position.x - obj.position[0];
      const dz = camera.position.z - obj.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      distancesRef.current[obj.id] = dist;

      if (found.includes(obj.id) || obj.id === "descent-stage" || obj.hidden) continue;

      if (dist < PROXIMITY_RANGE) {
        nowInProximity.add(obj.id);
      }

      if (dist < minDist) {
        minDist = dist;
        nearest = obj.id;
      }
    }

    distanceUpdateTimer.current += rawDelta;
    if (distanceUpdateTimer.current > 0.25) {
      distanceUpdateTimer.current = 0;
      setObjectDistances({ ...distancesRef.current });
    }

    for (const id of nowInProximity) {
      if (!prevProximity.current.has(id)) {
        const now = Date.now();
        if (now - lastPingTime.current > 2000) {
          gameAudio.playProximityPing();
          lastPingTime.current = now;
        }
      }
    }
    prevProximity.current = nowInProximity;

    if (nearest !== prevNearest.current) {
      prevNearest.current = nearest;
      setNearObjectId(nearest);
    }
  });

  return null;
}

const MOON_G = 1.0;
const MARS_G = 2.3;
const EYE_HEIGHT = 1.7;
const GROUND_Y = 0;
const MOON_JUMP_V0 = 2.6;
const MARS_JUMP_V0 = 3.4;
const WALK_SPEED = 2;
const RUN_SPEED = 4.5;

function getSurfaceGravity(planet: string): number {
  return planet === "mars" ? MARS_G : MOON_G;
}
function getJumpV0(planet: string): number {
  return planet === "mars" ? MARS_JUMP_V0 : MOON_JUMP_V0;
}
const BOB_FREQ = 6;
const BOB_AMP = 0.03;
const _moveDir = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _lookAtPos = new THREE.Vector3();

const playerState = {
  x: 5,
  y: 0,
  z: 10,
  heading: 0,
  isMoving: false,
  speed: 0,
  groundY: 0,
  onGround: true,
  sprint: false,
  thrusting: false,
  isJumping: false,
  footCount: 0,
};

function DustParticles({ planet }: { planet?: string }) {
  const dustColor = planet === "mars" ? "#c4856a" : "#b8b0a0";
  const ref = useRef<THREE.Points>(null);
  const count = 40;
  const lifetimes = useRef(new Float32Array(count));
  const velocities = useRef(new Float32Array(count * 3));

  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame((_s, delta) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    if (!posAttr) return;
    const lt = lifetimes.current;
    const vel = velocities.current;
    if (!lt || !vel) return;

    for (let i = 0; i < count; i++) {
      const currentLt = lt[i];
      if (currentLt === undefined) continue;
      const newLt = currentLt - delta;
      lt[i] = newLt;
      if (newLt <= 0) {
        if (playerState.isMoving) {
          const spread = 0.4;
          posAttr.setXYZ(
            i,
            playerState.x + (Math.sin(i * 7.31) * 2 - 1) * spread,
            playerState.groundY + 0.05,
            playerState.z + (Math.sin(i * 13.7) * 2 - 1) * spread,
          );
          vel[i * 3] = (Math.sin(i * 3.7) * 2 - 1) * 0.3;
          vel[i * 3 + 1] = 0.15 + Math.sin(i * 5.1) * 0.1;
          vel[i * 3 + 2] = (Math.sin(i * 9.2) * 2 - 1) * 0.3;
          lt[i] = 1.5 + Math.sin(i * 2.3) * 0.5;
        } else {
          posAttr.setXYZ(i, 0, -10, 0);
          lt[i] = 0.1;
        }
      } else {
        const vx = vel[i * 3] ?? 0;
        const vy = vel[i * 3 + 1] ?? 0;
        const vz = vel[i * 3 + 2] ?? 0;
        const x = posAttr.getX(i) + vx * delta;
        const y = posAttr.getY(i) + vy * delta;
        const z = posAttr.getZ(i) + vz * delta;
        vel[i * 3 + 1] = vy - 0.08 * delta;
        posAttr.setXYZ(i, x, Math.max(0, y), z);
      }
    }
    posAttr.needsUpdate = true;
    (ref.current.material as THREE.PointsMaterial).opacity =
      playerState.isMoving ? 0.35 : 0;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        color={dustColor}
        size={0.06}
        transparent
        opacity={0.35}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function AmbientDust({ planet }: { planet?: string }) {
  const dustColor = planet === "mars" ? "#9a7060" : "#a09888";
  const ref = useRef<THREE.Points>(null);
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 * 3.7;
      const r = 2 + (i % 17) * 1.8;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = 0.1 + (i % 7) * 0.15;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    if (!posAttr) return;
    const t = Date.now() * 0.0001;
    for (let i = 0; i < count; i++) {
      const baseY = 0.1 + (i % 7) * 0.15;
      const y = baseY + Math.sin(t * 2 + i * 0.5) * 0.08;
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;
    ref.current.rotation.y = t * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        color={dustColor}
        size={0.02}
        transparent
        opacity={0.2}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Footprints({ lat = 0, lon = 0 }: { lat?: number; lon?: number }) {
  const texture = useLoader(THREE.TextureLoader, "/textures/bootprint.jpg");
  const maxPrints = 60;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const printCount = useRef(0);
  const lastPrintPos = useRef(new THREE.Vector3(999, 0, 999));
  const stepSide = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const px = playerState.x;
    const pz = playerState.z;
    const dx = px - lastPrintPos.current.x;
    const dz = pz - lastPrintPos.current.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist > 1.2 && playerState.isMoving) {
      const idx = printCount.current % maxPrints;
      const side = stepSide.current === 0 ? -1 : 1;
      const perpX = -Math.sin(playerState.heading) * 0.15 * side;
      const perpZ = Math.cos(playerState.heading) * 0.15 * side;

      const printY = getTerrainElevation(px + perpX, pz + perpZ, "moon", lat, lon);
      dummy.position.set(px + perpX, printY + 0.02, pz + perpZ);
      dummy.rotation.set(-Math.PI / 2, 0, playerState.heading + Math.PI);
      dummy.scale.set(0.15, 0.25, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(idx, dummy.matrix);
      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.count = Math.min(printCount.current + 1, maxPrints);

      lastPrintPos.current.set(px, 0, pz);
      printCount.current++;
      stepSide.current = 1 - stepSide.current;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, maxPrints]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.4}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

function getMarsBaseModel(missionId: string): { url: string; scale: number } {
  if (missionId === "mars-viking-1") return { url: "/models/heritage/viking1.glb", scale: 2.2 };
  if (missionId === "mars-viking-2") return { url: "/models/heritage/viking2.glb", scale: 2.2 };
  if (missionId === "mars-pathfinder") return { url: "/models/heritage/sojourner.glb", scale: 1.8 };
  if (missionId.startsWith("mars-spirit")) return { url: "/models/heritage/spirit.glb", scale: 2.0 };
  if (missionId.startsWith("mars-opportunity")) return { url: "/models/heritage/opportunity.glb", scale: 2.0 };
  if (missionId === "mars-curiosity" || missionId === "mars-perseverance") {
    return { url: "/models/heritage/opportunity.glb", scale: 2.8 };
  }
  if (missionId === "mars-insight") return { url: "/models/heritage/insight.glb", scale: 2.2 };
  if (missionId === "mars-phoenix") return { url: "/models/heritage/phoenix.glb", scale: 2.2 };
  return { url: "/models/heritage/viking1.glb", scale: 2.2 };
}

function MarsBase({
  missionId,
  position = [0, 0, 0],
}: {
  missionId: string;
  position?: [number, number, number];
}) {
  const { url, scale } = useMemo(() => getMarsBaseModel(missionId), [missionId]);
  return (
    <group position={position}>
      <Suspense fallback={null}>
        <GroundObject url={url} baseScale={scale} />
      </Suspense>
    </group>
  );
}

function PlayerController({
  planet,
  lat = 0,
  lon = 0,
  viewMode = "pov",
}: {
  planet?: string;
  lat?: number;
  lon?: number;
  viewMode?: "pov" | "walker" | "lander";
}) {
  const { camera } = useThree();
  const playerPos = useRef(new THREE.Vector3(5, GROUND_Y + EYE_HEIGHT, 10));
  const velocity = useRef(new THREE.Vector3());
  const verticalVel = useRef(0);
  const physY = useRef(GROUND_Y + EYE_HEIGHT);
  const euler = useRef(new THREE.Euler(0, 0.46, 0, "YXZ"));
  const orbitYaw = useRef(0.46);
  const orbitPitch = useRef(0.22);
  const camDist = useRef(5.2);
  const bodyHeading = useRef(0.46);
  const keys = useRef<Record<string, boolean>>({});
  const isPointerLocked = useRef(false);
  const isMouseDown = useRef(false);
  const phaseRef = useRef(useGameStore.getState().phase);
  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;
  const bobPhase = useRef(0);
  const bobOffset = useRef(0);
  const wasOnGround = useRef(true);
  const gravity = getSurfaceGravity(planet ?? "moon");
  const jumpV0 = getJumpV0(planet ?? "moon");

  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      const prev = phaseRef.current;
      phaseRef.current = s.phase;
      if (s.phase === "inspect") {
        document.exitPointerLock();
      } else if (prev === "inspect") {
        if (viewModeRef.current === "pov") {
          euler.current.setFromQuaternion(camera.quaternion, "YXZ");
        }
      }
    });
    return unsub;
  }, [camera]);

  // Sync orientation when viewMode toggles
  useEffect(() => {
    if (viewMode === "walker") {
      orbitYaw.current = euler.current.y;
      bodyHeading.current = euler.current.y + Math.PI;
    } else if (viewMode === "pov") {
      euler.current.y = orbitYaw.current;
      euler.current.x = 0;
    }
  }, [viewMode]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) isMouseDown.current = true;
    };
    const onMouseUp = () => {
      isMouseDown.current = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (viewModeRef.current === "pov") {
        if (!isPointerLocked.current) return;
        euler.current.y -= e.movementX * 0.002;
        euler.current.x -= e.movementY * 0.002;
        euler.current.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, euler.current.x),
        );
        camera.quaternion.setFromEuler(euler.current);
      } else {
        if (isPointerLocked.current || isMouseDown.current) {
          orbitYaw.current -= e.movementX * 0.003;
          orbitPitch.current = Math.max(-0.25, Math.min(1.1, orbitPitch.current - e.movementY * 0.003));
        }
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (viewModeRef.current === "walker") {
        camDist.current = Math.max(2.5, Math.min(10.0, camDist.current + e.deltaY * 0.004));
      }
    };
    const onPointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement !== null;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("wheel", onWheel, { passive: true });
    if (!isTouchDevice()) {
      window.addEventListener("mousemove", onMouseMove);
      document.addEventListener("pointerlockchange", onPointerLockChange);
    }

    const startGroundY = getTerrainElevation(5, 10, planet ?? "moon", lat, lon);
    physY.current = startGroundY + EYE_HEIGHT;
    playerPos.current.set(5, physY.current, 10);
    camera.position.set(5, physY.current, 10);
    euler.current.y = 0.46;
    euler.current.x = -0.05;
    camera.quaternion.setFromEuler(euler.current);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("wheel", onWheel);
      if (!isTouchDevice()) {
        window.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("pointerlockchange", onPointerLockChange);
      }
    };
  }, [camera, planet, lat, lon]);

  useFrame((_state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (phaseRef.current === "inspect") {
      velocity.current.set(0, 0, 0);
      playerState.isMoving = false;
      return;
    }

    // Touch look (mobile)
    const touch = useTouchStore.getState();
    const { dx: tLookX, dy: tLookY } = touch.consumeLookDelta();
    if (tLookX !== 0 || tLookY !== 0) {
      if (viewModeRef.current === "pov") {
        euler.current.y -= tLookX;
        euler.current.x -= tLookY;
        euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
        camera.quaternion.setFromEuler(euler.current);
      } else {
        orbitYaw.current -= tLookX * 1.5;
        orbitPitch.current = Math.max(-0.25, Math.min(1.1, orbitPitch.current - tLookY * 1.5));
      }
    }

    const k = keys.current;
    const running = k["ShiftLeft"] || k["ShiftRight"] || touch.sprint;
    const speed = running ? RUN_SPEED : WALK_SPEED;

    let moveForward = 0;
    let moveRight = 0;

    if (k["KeyW"] || k["ArrowUp"]) moveForward += 1;
    if (k["KeyS"] || k["ArrowDown"]) moveForward -= 1;
    if (k["KeyD"] || k["ArrowRight"]) moveRight += 1;
    if (k["KeyA"] || k["ArrowLeft"]) moveRight -= 1;

    if (touch.moveZ !== 0) moveForward -= touch.moveZ;
    if (touch.moveX !== 0) moveRight += touch.moveX;

    const isMoving = moveForward !== 0 || moveRight !== 0;
    _moveDir.set(0, 0, 0);

    if (isMoving) {
      if (viewModeRef.current === "pov") {
        _moveDir.set(moveRight, 0, -moveForward).normalize();
        _moveDir.applyQuaternion(camera.quaternion);
        _moveDir.y = 0;
        _moveDir.normalize();
      } else {
        const s = Math.sin(orbitYaw.current);
        const c = Math.cos(orbitYaw.current);
        _moveDir.x = -s * moveForward + c * moveRight;
        _moveDir.z = -c * moveForward - s * moveRight;
        _moveDir.normalize();

        const targetHeading = Math.atan2(_moveDir.x, _moveDir.z);
        bodyHeading.current = dampAngle(bodyHeading.current, targetHeading, 12, delta);
      }
    }

    const accelFactor = 1 - Math.exp(-6 * delta);
    velocity.current.lerp(_moveDir.multiplyScalar(speed), accelFactor);
    playerPos.current.x += velocity.current.x * delta;
    playerPos.current.z += velocity.current.z * delta;

    const currentGroundY = getTerrainElevation(
      playerPos.current.x,
      playerPos.current.z,
      planet ?? "moon",
      lat,
      lon,
    );
    const onGround = physY.current <= currentGroundY + EYE_HEIGHT + 0.05;

    const isThrusting = (k["Space"] || touch.jump) ?? false;

    if (isThrusting && onGround) {
      verticalVel.current = Math.max(verticalVel.current, jumpV0);
    }

    verticalVel.current -= gravity * delta;

    if (isThrusting) {
      const thrustAccel = planet === "mars" ? 9.5 : 5.8;
      const maxClimb = planet === "mars" ? 6.5 : 7.5;
      verticalVel.current = Math.min(verticalVel.current + thrustAccel * delta, maxClimb);
    }

    physY.current += verticalVel.current * delta;

    if (physY.current < currentGroundY + EYE_HEIGHT) {
      physY.current = currentGroundY + EYE_HEIGHT;
      if (!wasOnGround.current && verticalVel.current < -0.5) {
        gameAudio.playThud();
      }
      verticalVel.current = 0;
    }
    wasOnGround.current = physY.current <= currentGroundY + EYE_HEIGHT + 0.05;

    if (isMoving && wasOnGround.current) {
      bobPhase.current += delta * BOB_FREQ * (running ? 1.3 : 1);
      bobOffset.current = Math.sin(bobPhase.current) * BOB_AMP;
    } else {
      bobPhase.current = 0;
      bobOffset.current *= Math.exp(-10 * delta);
    }
    playerPos.current.y = physY.current;

    playerState.x = playerPos.current.x;
    playerState.y = playerPos.current.y;
    playerState.z = playerPos.current.z;
    playerState.groundY = currentGroundY;
    playerState.heading = viewModeRef.current === "walker" ? bodyHeading.current : euler.current.y;
    playerState.isMoving = isMoving && wasOnGround.current;
    playerState.speed = velocity.current.length();
    playerState.onGround = wasOnGround.current;
    playerState.sprint = running;
    playerState.thrusting = isThrusting;
    playerState.isJumping = !wasOnGround.current;

    if (viewModeRef.current === "pov") {
      camera.position.set(playerPos.current.x, physY.current + bobOffset.current, playerPos.current.z);
      camera.quaternion.setFromEuler(euler.current);
    } else {
      const pitch = Math.max(-0.25, Math.min(1.05, orbitPitch.current));
      const dist = camDist.current;
      const targetEyeY = physY.current;
      const cx = playerPos.current.x + Math.sin(orbitYaw.current) * dist * Math.cos(pitch);
      const cy = targetEyeY + Math.sin(pitch) * dist + 0.1;
      const cz = playerPos.current.z + Math.cos(orbitYaw.current) * dist * Math.cos(pitch);
      _targetCamPos.set(cx, Math.max(cy, currentGroundY + 0.5), cz);
      camera.position.lerp(_targetCamPos, Math.min(1, 14 * delta));
      _lookAtPos.set(playerPos.current.x, targetEyeY - 0.4, playerPos.current.z);
      camera.lookAt(_lookAtPos);
    }
  });

  return null;
}

function AstronautExosuit({
  visible,
  planet,
}: {
  visible: boolean;
  planet?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const exosuitRef = useRef<Exosuit | null>(null);
  const cfg = planet === "mars" ? DEFAULT_MARS_CFG : DEFAULT_MOON_CFG;

  useEffect(() => {
    if (!groupRef.current) return;
    const suit = new Exosuit(groupRef.current, null);
    exosuitRef.current = suit;
    return () => {
      suit.dispose();
      exosuitRef.current = null;
    };
  }, []);

  useFrame((_state, rawDelta) => {
    const suit = exosuitRef.current;
    if (!suit || !groupRef.current) return;

    groupRef.current.visible = visible;
    if (!visible) return;

    const delta = Math.min(rawDelta, 0.05);
    const astronautFeetY = playerState.y - EYE_HEIGHT;
    suit.root.position.set(playerState.x, astronautFeetY, playerState.z);
    suit.root.rotation.y = playerState.heading;

    suit.animate(
      delta,
      {
        speed: playerState.speed,
        grounded: playerState.onGround,
        thrusting: playerState.thrusting,
      },
      cfg,
    );
  });

  return <group ref={groupRef} />;
}

function InspectCamera({
  objects,
  planet,
  lat = 0,
  lon = 0,
}: {
  objects: HeritageObject[];
  planet?: string;
  lat?: number;
  lon?: number;
}) {
  const { camera } = useThree();
  const phaseRef = useRef(useGameStore.getState().phase);
  const inspectingRef = useRef(useGameStore.getState().inspecting);
  const smoothedLook = useRef(new THREE.Vector3());

  useEffect(
    () => useGameStore.subscribe((s) => {
      const prev = phaseRef.current;
      phaseRef.current = s.phase;
      inspectingRef.current = s.inspecting;
      if (s.phase === "inspect" && prev !== "inspect") {
        camera.getWorldDirection(smoothedLook.current);
        smoothedLook.current.multiplyScalar(4).add(camera.position);
      }
    }),
    [camera],
  );

  useFrame((_state, rawDelta) => {
    if (phaseRef.current !== "inspect" || !inspectingRef.current.objectId) return;
    const obj = objects.find((o) => o.id === inspectingRef.current.objectId);
    if (!obj) return;

    const dt = Math.min(rawDelta, 0.05);
    const t = 1 - Math.exp(-5 * dt);
    const objY = getTerrainElevation(obj.position[0], obj.position[2], planet ?? "moon", lat, lon);
    _lookTarget.set(obj.position[0], obj.position[1] + objY + 0.85, obj.position[2]);
    smoothedLook.current.lerp(_lookTarget, t);
    camera.lookAt(smoothedLook.current);
  });

  return null;
}

function EarthInSky({ lat, lon }: { lat: number; lon: number }) {
  const earthPos = useMemo(() => getEarthPosition(lat, lon), [lat, lon]);
  return <EarthAtmosphere radius={8} position={earthPos} rotationSpeed={0.01} />;
}

function SunLight({ lat, lon, evaDate, planet }: { lat: number; lon: number; evaDate: string; planet?: string }) {
  const sunData = useMemo(() => getSunPosition(lat, lon, evaDate), [lat, lon, evaDate]);
  const isMars = planet === "mars";

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(
        `[Sun] elevation: ${sunData.elevation.toFixed(1)}°, azimuth: ${sunData.azimuth.toFixed(1)}°`,
      );
    }
  }, [sunData]);

  return (
    <>
      <directionalLight
        position={sunData.direction}
        intensity={isMars ? 1.7 : 3.0}
        color={isMars ? "#ffe0b0" : "#fff5e0"}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={1}
        shadow-camera-far={300}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0002}
      />
      <group position={[sunData.direction[0] * 3, sunData.direction[1] * 3, sunData.direction[2] * 3]}>
        <mesh>
          <sphereGeometry args={[isMars ? 9 : 14, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh scale={[2.2, 2.2, 2.2]}>
          <sphereGeometry args={[isMars ? 9 : 14, 32, 32]} />
          <meshBasicMaterial color="#fff4d0" transparent opacity={isMars ? 0.25 : 0.35} />
        </mesh>
      </group>
    </>
  );
}

function SurfaceSceneContent({
  setNearObjectId,
  setObjectDistances,
  nearObjectId,
  objectDistances,
  missionId,
  viewMode = "pov",
}: {
  setNearObjectId: (id: string | null) => void;
  setObjectDistances: (d: Record<string, number>) => void;
  nearObjectId: string | null;
  objectDistances: Record<string, number>;
  missionId: string;
  viewMode?: "pov" | "walker" | "lander";
}) {
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const phase = useGameStore((s) => s.phase);
  const hasFlag = useAppStore((s) => s.progress.missions[missionId]?.flagPlanted ?? false);
  const mission = useMemo(() => getMission(missionId), [missionId]);
  const objects = mission.objects;
  const isMars = mission.planet === "mars";

  return (
    <>
      {isMars ? (
        <>
          <color attach="background" args={["#c49470"]} />
          <fog attach="fog" args={["#c4956a", 40, 200]} />
          {/* Mars sky dome — butterscotch atmosphere */}
          <mesh>
            <sphereGeometry args={[500, 32, 32]} />
            <meshBasicMaterial color="#b08060" side={THREE.BackSide} />
          </mesh>
          <ambientLight intensity={0.18} color="#e8c4a0" />
          <hemisphereLight args={["#c49060", "#3a2010", 0.25]} />
        </>
      ) : (
        <>
          <color attach="background" args={["#000000"]} />
          <fogExp2 attach="fog" args={["#0a0a0a", 0.004]} />
          <Stars radius={300} depth={80} count={8000} factor={5} saturation={0.6} fade speed={0.1} />
          <ambientLight intensity={0.04} color="#333344" />
          <hemisphereLight args={["#667788", "#222228", 0.08]} />
        </>
      )}

      <SunLight lat={mission.landing.lat} lon={mission.landing.lon} evaDate={mission.evaSunTime} planet={mission.planet} />

      {!isMars && (
        <Suspense fallback={null}>
          <EarthInSky lat={mission.landing.lat} lon={mission.landing.lon} />
        </Suspense>
      )}

      <Suspense fallback={<GroundPlane planet={mission.planet} />}>
        <Terrain stlPath={mission.terrain.model} orthoPath={mission.terrain.ortho} lat={mission.landing.lat} lon={mission.landing.lon} planet={mission.planet} />
      </Suspense>
      <GroundPlane planet={mission.planet} />

      {isMars ? (
        <MarsBase
          missionId={missionId}
          position={[0, getTerrainElevation(0, 0, "mars", mission.landing.lat, mission.landing.lon), 0]}
        />
      ) : (
        <Suspense fallback={null}>
          <LMDescent
            position={[0, getTerrainElevation(0, 0, "moon", mission.landing.lat, mission.landing.lon) - 0.1, 0]}
            scale={1}
          />
        </Suspense>
      )}

      {objects.map((obj) => (
        <HeritageMarker
          key={obj.id}
          obj={obj}
          isFound={found.includes(obj.id)}
          isNear={nearObjectId === obj.id}
          distance={objectDistances[obj.id] ?? 999}
          isMars={isMars}
          lat={mission.landing.lat}
          lon={mission.landing.lon}
          missionId={missionId}
        />
      ))}

      <DustParticles planet={mission.planet} />
      <AmbientDust planet={mission.planet} />
      {!isMars && (
        <Suspense fallback={null}>
          <Footprints lat={mission.landing.lat} lon={mission.landing.lon} />
        </Suspense>
      )}

      {(phase === "flagPlanted" || hasFlag) && !isMars && (
        <group
          position={[2, getTerrainElevation(2, 2, "moon", mission.landing.lat, mission.landing.lon), 2]}
          scale={[0.9, 0.9, 0.9]}
        >
          <AmericanFlag3D scale={1.0} />
        </group>
      )}

      <ProximityDetector setNearObjectId={setNearObjectId} setObjectDistances={setObjectDistances} objects={objects} />
      <PlayerController planet={mission.planet} lat={mission.landing.lat} lon={mission.landing.lon} viewMode={viewMode} />
      <AstronautExosuit visible={viewMode === "walker"} planet={mission.planet} />
      <InspectCamera objects={objects} planet={mission.planet} lat={mission.landing.lat} lon={mission.landing.lon} />
    </>
  );
}

function MiniRadar({ found, objects, isMars }: { found: string[]; objects: HeritageObject[]; isMars?: boolean }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 500);
    return () => clearInterval(id);
  }, []);

  const px = playerState.x;
  const pz = playerState.z;
  const heading = playerState.heading;
  const radarRange = 50;
  const sweepAngle = ((tick * 12) % 360) * (Math.PI / 180);

  const ringColor = isMars ? "#e8a050" : "#ffd36e";
  const accentColor = isMars ? "#ff9944" : "#00d4ff";
  const blipColor = isMars ? "#e8a050" : "#ffd36e";

  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 opacity-80">
      <circle cx="50" cy="50" r="48" fill="none" stroke={ringColor} strokeWidth="0.5" strokeOpacity="0.3" />
      <circle cx="50" cy="50" r="32" fill="none" stroke={ringColor} strokeWidth="0.3" strokeOpacity="0.2" />
      <circle cx="50" cy="50" r="16" fill="none" stroke={ringColor} strokeWidth="0.3" strokeOpacity="0.15" />
      {/* Sweep line */}
      <line
        x1="50" y1="50"
        x2={50 + Math.sin(sweepAngle) * 46}
        y2={50 - Math.cos(sweepAngle) * 46}
        stroke={accentColor} strokeWidth="1" strokeOpacity="0.25"
      />
      <line x1="50" y1="2" x2="50" y2="12" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.6" />
      {/* LM at origin */}
      {(() => {
        const dx = (0 - px) / radarRange;
        const dz = (0 - pz) / radarRange;
        const rx = dx * Math.cos(-heading) - dz * Math.sin(-heading);
        const rz = dx * Math.sin(-heading) + dz * Math.cos(-heading);
        const sx = 50 + rx * 45;
        const sy = 50 - rz * 45;
        if (sx > 5 && sx < 95 && sy > 5 && sy < 95) {
          return <rect x={sx - 3} y={sy - 3} width="6" height="6" fill={isMars ? "#88cc66" : "#66ff99"} opacity="0.8" />;
        }
        return null;
      })()}
      {/* Directional pings — show direction arc, not exact position */}
      {objects.filter((o) => o.id !== "descent-stage" && !o.hidden && !found.includes(o.id)).map((obj) => {
        const dx = (obj.position[0] - px) / radarRange;
        const dz = (obj.position[2] - pz) / radarRange;
        const rx = dx * Math.cos(-heading) - dz * Math.sin(-heading);
        const rz = dx * Math.sin(-heading) + dz * Math.cos(-heading);
        const dist = Math.sqrt(rx * rx + rz * rz);
        if (dist < 0.01) return null;
        const nx = rx / dist;
        const nz = rz / dist;
        const pingDist = Math.min(dist, 1) * 40;
        const pingX = 50 + nx * pingDist;
        const pingY = 50 - nz * pingDist;
        const pulsePhase = (tick + obj.id.length) % 4;
        const pulseR = 2.5 + pulsePhase * 0.5;
        const pulseOpacity = 0.7 - pulsePhase * 0.12;
        return (
          <circle
            key={obj.id}
            cx={pingX} cy={pingY}
            r={pulseR}
            fill={blipColor}
            opacity={Math.max(0.2, pulseOpacity)}
          />
        );
      })}
      <circle cx="50" cy="50" r="2.5" fill={accentColor} />
    </svg>
  );
}

const SCAN_HOLD_DURATION = 1.5;

function ScanMeter({ progress }: { progress: number }) {
  const r = 22;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress);

  return (
    <svg
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      width="56"
      height="56"
      viewBox="0 0 56 56"
    >
      <circle
        cx="28" cy="28" r={r}
        fill="none"
        stroke="rgba(0, 212, 255, 0.15)"
        strokeWidth="3"
      />
      <circle
        cx="28" cy="28" r={r}
        fill="none"
        stroke="#00d4ff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 28 28)"
        style={{ transition: "stroke-dashoffset 0.05s linear" }}
      />
    </svg>
  );
}

function SurfaceHUD({ nearObjectId, objects, planet, missionType }: { nearObjectId: string | null; objects: HeritageObject[]; planet?: string; missionType?: string }) {
  const isMars = planet === "mars";
  const isRobotic = missionType === "robotic";
  const { t } = useTranslation();
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
  const phase = useGameStore((s) => s.phase);
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const send = useGameStore((s) => s.send);
  const addFoundObject = useGameStore((s) => s.addFoundObject);
  const findObject = useAppStore((s) => s.findObject);
  const missionId = useGameStore((s) => s.missionId);
  const playerName = useAppStore((s) => s.player.name);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const [evaSeconds, setEvaSeconds] = useState(0);
  const [, setHudTick] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const scanStartTime = useRef<number | null>(null);
  const scanAnimFrame = useRef<number>(0);
  const lastTickTime = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      setEvaSeconds((s) => s + 1);
      setHudTick((n) => n + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const evaTime = useMemo(() => {
    const m = Math.floor(evaSeconds / 60);
    const s = evaSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [evaSeconds]);

  const distFromLM = useMemo(() => {
    return Math.sqrt(playerState.x * playerState.x + playerState.z * playerState.z).toFixed(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaSeconds]);

  const scannableCount = useMemo(
    () => objects.filter((o) => !o.hidden && o.id !== "descent-stage").length,
    [objects],
  );

  const narration = useMemo(() => {
    if (found.length >= scannableCount) {
      return t(isRobotic ? "surface.narrationAllFoundRobotic" : "surface.narrationAllFound");
    }
    if (found.length > 0) {
      return t("surface.narrationProgress", { found: found.length, total: scannableCount });
    }
    return t(isMars ? "surface.narrationStartMars" : "surface.narrationStart", { name: playerName || "" });
  }, [found.length, scannableCount, playerName, t, isMars, isRobotic]);

  const completeScan = useCallback(() => {
    if (!nearObjectId || !missionId) return;
    const isNew = !found.includes(nearObjectId);
    if (isNew) {
      addFoundObject(nearObjectId);
      findObject(missionId, nearObjectId);
    }
    send("START_INSPECT", { objectId: nearObjectId });
    gameAudio.playScanComplete();

    const obj = objects.find((o) => o.id === nearObjectId);
    if (isNew) {
      setToast(t("xp.object", { amount: obj?.xp ?? 50, name: obj?.name ?? nearObjectId }));
    } else {
      setToast(`Transmission Linked: ${obj?.name ?? nearObjectId}`);
    }
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, [nearObjectId, found, missionId, addFoundObject, findObject, send, t, objects]);

  const handleFlag = useCallback(() => {
    if (!missionId) return;
    useAppStore.getState().plantFlag(missionId);
    send("PLANT_FLAG");
    gameAudio.playSuccess();
    setToast(t("xp.flag", { amount: 100 }));
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, [missionId, send, t]);

  const handleLaunch = useCallback(() => {
    send("LAUNCH_HOME");
  }, [send]);

  useEffect(() => {
    const animateScan = () => {
      if (scanStartTime.current === null) return;
      const elapsed = (Date.now() - scanStartTime.current) / 1000;
      const progress = Math.min(elapsed / SCAN_HOLD_DURATION, 1);
      setScanProgress(progress);

      const now = Date.now();
      if (now - lastTickTime.current > 200) {
        gameAudio.playScanTick();
        lastTickTime.current = now;
      }

      if (progress >= 1) {
        scanStartTime.current = null;
        setScanProgress(0);
        completeScan();
        return;
      }
      scanAnimFrame.current = requestAnimationFrame(animateScan);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "e" || e.key === "E") && !e.repeat) {
        if (nearObjectId && missionId && phase !== "inspect") {
          scanStartTime.current = Date.now();
          lastTickTime.current = 0;
          scanAnimFrame.current = requestAnimationFrame(animateScan);
        }
      }
      if ((e.key === "f" || e.key === "F") && phase === "flagReady") handleFlag();
      if ((e.key === "l" || e.key === "L") && phase === "flagPlanted") handleLaunch();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "e" || e.key === "E") {
        scanStartTime.current = null;
        cancelAnimationFrame(scanAnimFrame.current);
        setScanProgress(0);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cancelAnimationFrame(scanAnimFrame.current);
    };
  }, [phase, nearObjectId, found, missionId, completeScan, handleFlag, handleLaunch]);

  useEffect(() => {
    if (found.length >= scannableCount && phase === "explore") {
      send("ALL_FOUND");
    }
  }, [found.length, scannableCount, phase, send]);

  const nearObj = objects.find((o) => o.id === nearObjectId);
  const isScanning = scanProgress > 0;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      {/* Helmet visor vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.4) 85%, rgba(0,0,0,0.7) 100%)",
          borderRadius: "8px",
        }}
      />

      {/* Top-left: EVA time + distance from LM */}
      <div className="absolute left-4 top-4 flex flex-col gap-1">
        <div className="rounded bg-space-950/70 px-3 py-1.5 backdrop-blur">
          <p className="font-mono text-xs text-regolith-400">
            {t("surface.eva")} <span className="text-signal">{evaTime}</span>
          </p>
        </div>
        <div className="rounded bg-space-950/70 px-3 py-1.5 backdrop-blur">
          <p className="font-mono text-xs text-regolith-400">
            {t(isMars ? "surface.distBase" : "surface.distLM")} <span className="text-ok">{distFromLM}m</span>
          </p>
        </div>
      </div>

      {/* Top-center: objects found */}
      <div className="mx-auto mt-4 rounded-lg bg-space-950/70 px-5 py-2 text-center backdrop-blur">
        <p className="font-mono text-sm text-regolith-200">
          {t("surface.objectCount", { found: found.length, total: scannableCount })}
        </p>
      </div>

      {/* Top-right: mini radar & focus mode toggle */}
      <div className="absolute right-4 top-4 flex items-start gap-2">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="pointer-events-auto flex items-center justify-center rounded-lg border border-space-700/80 bg-space-950/80 hover:bg-space-850 p-2 text-xs font-semibold text-regolith-300 hover:text-white backdrop-blur transition hover:border-signal/50 active:scale-95 touch-manipulation shadow-lg"
          aria-label={isFullscreen ? t("fullscreen.exitHint") : t("fullscreen.enterHint")}
          title={isFullscreen ? t("fullscreen.exitHint") : t("fullscreen.enterHint")}
        >
          <span className="text-base leading-none">{isFullscreen ? "🗗" : "⛶"}</span>
        </button>
        <div className="rounded-lg bg-space-950/60 p-1 backdrop-blur">
          <MiniRadar found={found} objects={objects} isMars={isMars} />
        </div>
      </div>

      {/* XP toast */}
      {toast && (
        <div className="mx-auto mt-4 rounded-lg bg-signal/20 px-5 py-2 text-center backdrop-blur">
          <p className="font-display text-lg font-bold text-signal">{toast}</p>
        </div>
      )}

      {/* Crosshair + Scan Meter */}
      {phase !== "inspect" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-0.5 w-4 rounded-full bg-regolith-200/30" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-regolith-200/30" />
          {isScanning && <ScanMeter progress={scanProgress} />}
        </div>
      )}

      {/* Interaction prompt */}
      {nearObj && phase !== "inspect" && !isTouchDevice() && (
        <div className="mx-auto mt-auto mb-32 rounded-xl bg-space-950/90 px-8 py-4 text-center backdrop-blur-md border border-space-700/50">
          <p className="font-display text-lg text-signal">
            {isScanning
              ? t("surface.scanning")
              : found.includes(nearObj.id)
                ? `[Hold E] Listen to Transmission / Re-Inspect ${nearObj.name}`
                : `[Hold E] ${t("surface.inspectPrompt")} ${nearObj.name}`}
          </p>
          <p className="mt-1 text-xs text-regolith-400">
            {found.includes(nearObj.id)
              ? "Re-open the monument's voice log & NASA telemetry"
              : t("surface.scanHint")}
          </p>
        </div>
      )}

      {phase === "flagReady" && !isTouchDevice() && (
        <div className="mx-auto mt-auto mb-32 rounded-xl bg-signal/20 px-8 py-4 text-center backdrop-blur-md border border-signal/30">
          <p className="animate-pulse font-display text-lg text-signal">
            [F] {t(isRobotic ? "surface.surveyPrompt" : "surface.flagPrompt")}
          </p>
        </div>
      )}

      {phase === "flagPlanted" && !isTouchDevice() && (
        <div className="mx-auto mt-auto mb-32 rounded-xl bg-ok/20 px-8 py-4 text-center backdrop-blur-md border border-ok/30">
          <p className="animate-pulse font-display text-lg text-ok">
            [L] {t(isRobotic ? "surface.endMissionPrompt" : "surface.launchPrompt")}
          </p>
        </div>
      )}

      {/* Bottom narration bar */}
      <div className="mt-auto px-4 pb-4">
        <div className="mx-auto max-w-2xl rounded-lg bg-space-950/85 px-6 py-3 backdrop-blur-md border border-space-700/30">
          <div className="flex items-baseline gap-3">
            <span className="shrink-0 text-xs font-bold tracking-widest text-signal">
              {t("surface.eva")}
            </span>
            <p className="text-sm leading-relaxed text-regolith-200">
              {narration}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom left: controls hint (desktop only) */}
      {!isTouchDevice() && (
        <div className="mb-2 ml-4">
          <p className="text-xs text-regolith-400/60">
            {t("surface.controlHints")}
          </p>
        </div>
      )}
    </div>
  );
}

export function SurfaceScene() {
  const phase = useGameStore((s) => s.phase);
  const missionId = useGameStore((s) => s.missionId);
  const send = useGameStore((s) => s.send);
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const addFoundObject = useGameStore((s) => s.addFoundObject);
  const findObject = useAppStore((s) => s.findObject);
  const [nearObjectId, setNearObjectId] = useState<string | null>(null);
  const [objectDistances, setObjectDistances] = useState<Record<string, number>>({});
  const [viewMode, setViewMode] = useState<"pov" | "walker" | "lander">("pov");
  const [, setWalkerTick] = useState(0);
  const mission = useMemo(() => getMission(missionId ?? "apollo-11"), [missionId]);

  useEffect(() => {
    if (viewMode !== "walker") return;
    const interval = setInterval(() => setWalkerTick((t) => t + 1), 100);
    return () => clearInterval(interval);
  }, [viewMode]);

  const touchScan = useCallback(
    (targetId?: string) => {
      const objId = targetId || nearObjectId;
      if (!objId || !missionId) return;
      const isNew = !found.includes(objId);
      if (isNew) {
        addFoundObject(objId);
        findObject(missionId, objId);
      }
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      send("START_INSPECT", { objectId: objId });
      gameAudio.playScanComplete();
    },
    [nearObjectId, found, missionId, addFoundObject, findObject, send],
  );

  // Global key listener for 'V' (toggle view) and 'E' (inspect nearby object)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "KeyV") {
        setViewMode((current) => (current === "pov" ? "walker" : "pov"));
      }
      if ((e.code === "KeyE" || e.key === "e" || e.key === "E") && !e.repeat) {
        if (nearObjectId && phase !== "inspect") {
          touchScan(nearObjectId);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nearObjectId, phase, touchScan]);

  const handleCanvasClick = useCallback(() => {
    if (!isTouchDevice()) {
      document.body.requestPointerLock();
    }
  }, []);

  const touchFlag = useCallback(() => {
    if (!missionId) return;
    useAppStore.getState().plantFlag(missionId);
    send("PLANT_FLAG");
    gameAudio.playSuccess();
  }, [missionId, send]);

  const touchLaunch = useCallback(() => {
    send("LAUNCH_HOME");
  }, [send]);

  const canScan = !!nearObjectId && phase !== "inspect";

  return (
    <div className="relative h-screen w-full">
      {/* 1. TOP VIEW MODE SWITCHER PILL */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full border border-white/10 bg-space-950/80 p-1.5 backdrop-blur-xl shadow-2xl pointer-events-auto">
        <button
          type="button"
          onClick={() => setViewMode("pov")}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer font-mono ${
            viewMode === "pov"
              ? "bg-signal text-space-950 shadow-md ring-1 ring-cyan-300"
              : "text-regolith-300 hover:text-white hover:bg-space-800/60"
          }`}
          title="First-Person Helmet View [V to toggle]"
        >
          <span>👁️</span>
          <span>POV View</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode("walker")}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer font-mono ${
            viewMode === "walker"
              ? "bg-signal text-space-950 shadow-md ring-1 ring-cyan-300"
              : "text-regolith-300 hover:text-white hover:bg-space-800/60"
          }`}
          title="3D Astronaut Walker Simulation [V to toggle]"
        >
          <span>🚶</span>
          <span>Astronaut Walker</span>
        </button>

        {mission.planet === "mars" && (
          <button
            type="button"
            onClick={() => setViewMode("lander")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer font-mono ${
              viewMode === "lander"
                ? "bg-orange-500 text-white shadow-md ring-1 ring-orange-300"
                : "text-regolith-300 hover:text-white hover:bg-space-800/60"
            }`}
            title="Interactive Mars Lander (3D)"
          >
            <span>🛸</span>
            <span>Mars Lander</span>
          </button>
        )}
      </div>

      {/* 2. MAIN THREE.JS CANVAS */}
      <div className="h-full w-full" onClick={handleCanvasClick}>
        <Canvas
          shadows
          camera={{
            position: [5, 1.7, 10],
            fov: 70,
            near: 0.1,
            far: 2000,
          }}
          gl={{
            antialias: false,
            toneMapping: THREE.AgXToneMapping,
            toneMappingExposure: 1.2,
          }}
        >
          <SurfaceSceneContent
            nearObjectId={nearObjectId}
            setNearObjectId={setNearObjectId}
            setObjectDistances={setObjectDistances}
            objectDistances={objectDistances}
            missionId={missionId ?? "apollo-11"}
            viewMode={viewMode}
          />
          <Effects bloom vignette bloomThreshold={0.55} bloomIntensity={1.0} vignetteDarkness={0.6} />
          <Preload all />
        </Canvas>
      </div>

      {/* 3. POV HUD & Mobile Controls */}
      {viewMode === "pov" && (
        <>
          <SurfaceHUD
            nearObjectId={nearObjectId}
            objects={mission.objects}
            planet={mission.planet}
            missionType={mission.missionType}
          />
          <TouchControls
            nearObjectId={nearObjectId}
            canScan={canScan}
            onScan={() => touchScan()}
            onFlag={touchFlag}
            onLaunch={touchLaunch}
          />
        </>
      )}

      {/* 4. ASTRONAUT WALKER HUD OVERLAY */}
      {viewMode === "walker" && (
        <>
          <WalkerHUD
            speed={playerState.speed}
            grounded={playerState.onGround}
            thrusting={playerState.thrusting}
            sprint={playerState.sprint}
            footCount={playerState.footCount}
            planet={mission.planet === "mars" ? "mars" : "moon"}
            gravity={getSurfaceGravity(mission.planet ?? "moon")}
            onSwitchView={() => setViewMode("pov")}
            nearestObj={
              nearObjectId
                ? {
                    id: nearObjectId,
                    name: mission.objects.find((o) => o.id === nearObjectId)?.name ?? nearObjectId,
                    dist: objectDistances[nearObjectId] ?? 0,
                  }
                : null
            }
            onInspectObject={touchScan}
          />
          {isTouchDevice() && (
            <TouchControls
              nearObjectId={nearObjectId}
              canScan={canScan}
              onScan={() => touchScan()}
              onFlag={touchFlag}
              onLaunch={touchLaunch}
            />
          )}
        </>
      )}

      {/* 5. MARS LANDER VIEW: Dedicated CSS 3D Lander Component */}
      {viewMode === "lander" && mission.planet === "mars" && (
        <div className="absolute inset-0 z-20 bg-space-950">
          <MarsLander onClose={() => setViewMode("pov")} />
        </div>
      )}

      {/* 6. POST-SCAN HOLOGRAM INSPECTION OVERLAY */}
      {phase === "inspect" && (
        <HologramInspect
          objects={mission.objects}
          missionId={missionId ?? "apollo-11"}
          isMars={mission.planet === "mars"}
        />
      )}
    </div>
  );
}
