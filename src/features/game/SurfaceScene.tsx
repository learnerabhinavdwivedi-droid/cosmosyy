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
import { Stars, Text } from "@react-three/drei";
import { Effects } from "./Effects";
import { useGameStore } from "@/store/useGameStore";
import { useAppStore } from "@/store/useAppStore";
import { useTouchStore } from "@/store/useTouchStore";
import { isTouchDevice } from "@/lib/useMobile";
import { Howl } from "howler";
import { gameAudio } from "@/lib/gameAudio";
import { stopNarration } from "@/lib/narration";
import { getMission, type HeritageObject } from "@/lib/missionData";
import { LMDescent } from "./LunarModule";
import { Terrain, GroundPlane } from "./Terrain";
import { EarthAtmosphere } from "./EarthAtmosphere";
import { getSunPosition, getEarthPosition } from "./sunPosition";
import { TouchControls } from "./TouchControls";
import * as THREE from "three";

const SCAN_RANGE = 8;

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

function FloatingArrow({ isFound }: { isFound: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const t = Date.now() * 0.001;
    groupRef.current.position.y = 5 + Math.sin(t * 2) * 0.4;
  });

  return (
    <group ref={groupRef} position={[0, 5, 0]}>
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.35, 0.8, 6]} />
        <meshBasicMaterial
          color={isFound ? "#66ff99" : "#00ff66"}
          transparent
          opacity={isFound ? 0.4 : 0.85}
        />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 6]} />
        <meshBasicMaterial
          color={isFound ? "#66ff99" : "#00ff66"}
          transparent
          opacity={isFound ? 0.3 : 0.7}
        />
      </mesh>
    </group>
  );
}

function HeritageMarker({
  obj,
  isFound,
  isNear,
  distance,
  isMars,
}: {
  obj: HeritageObject;
  isFound: boolean;
  isNear: boolean;
  distance: number;
  isMars?: boolean;
}) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

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

  const baseColor = isFound ? "#66ff99" : isNear
    ? (isMars ? "#ff9944" : "#00d4ff")
    : (isMars ? "#e8a050" : "#ffd36e");
  const showName = distance < NAME_VISIBLE_RANGE;

  return (
    <group position={obj.position}>
      <FloatingArrow isFound={isFound} />

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
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const prevNearest = useRef<string | null>(null);
  const prevProximity = useRef<Set<string>>(new Set());
  const lastPingTime = useRef(0);

  useFrame(() => {
    let nearest: string | null = null;
    let minDist = SCAN_RANGE;
    const distances: Record<string, number> = {};
    const nowInProximity = new Set<string>();

    for (const obj of objects) {
      const dx = camera.position.x - obj.position[0];
      const dz = camera.position.z - obj.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      distances[obj.id] = dist;

      if (found.includes(obj.id) || obj.id === "descent-stage" || obj.hidden) continue;

      if (dist < PROXIMITY_RANGE) {
        nowInProximity.add(obj.id);
      }

      if (dist < minDist) {
        minDist = dist;
        nearest = obj.id;
      }
    }

    setObjectDistances(distances);

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

const playerState = {
  x: 5, z: 10, heading: 0, isMoving: false, speed: 0,
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
            0.05,
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

function Footprints() {
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

      dummy.position.set(px + perpX, 0.01, pz + perpZ);
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

function MarsBase({ missionId }: { missionId: string }) {
  const isRover = missionId.startsWith("mars-spirit") || missionId.startsWith("mars-opportunity")
    || missionId.startsWith("mars-curiosity") || missionId.startsWith("mars-perseverance");
  const isLargeRover = missionId === "mars-curiosity" || missionId === "mars-perseverance";

  if (isRover) {
    const s = isLargeRover ? 1.0 : 0.65;
    return (
      <group position={[0, 0, 0]} scale={s}>
        {/* Rover body */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.2, 0.4, 0.8]} />
          <meshStandardMaterial color="#c8c0b0" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Mast */}
        <mesh position={[0.3, 0.85, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 6]} />
          <meshStandardMaterial color="#aaa8a0" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Camera head */}
        <mesh position={[0.3, 1.25, 0]}>
          <boxGeometry args={[0.15, 0.1, 0.12]} />
          <meshStandardMaterial color="#404040" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Wheels (6) */}
        {([-0.5, 0, 0.5] as const).map((xOff) => (
          [0.45, -0.45].map((zOff) => (
            <mesh key={`${xOff}-${zOff}`} position={[xOff, 0.12, zOff]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} />
              <meshStandardMaterial color="#555555" metalness={0.3} roughness={0.7} />
            </mesh>
          ))
        ))}
        {/* Solar panel (Spirit/Opportunity only) */}
        {!isLargeRover && (
          <mesh position={[0, 0.58, 0]}>
            <boxGeometry args={[1.4, 0.02, 1.0]} />
            <meshStandardMaterial color="#1a3366" metalness={0.4} roughness={0.5} />
          </mesh>
        )}
        {/* RTG arm (Curiosity/Perseverance only) */}
        {isLargeRover && (
          <mesh position={[-0.8, 0.35, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.06, 0.06, 0.6, 8]} />
            <meshStandardMaterial color="#884422" metalness={0.3} roughness={0.6} />
          </mesh>
        )}
      </group>
    );
  }

  // Lander (Viking, Pathfinder)
  const isPf = missionId === "mars-pathfinder";
  return (
    <group position={[0, 0, 0]}>
      {/* Lander body */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.5, isPf ? 6 : 8]} />
        <meshStandardMaterial color="#c8c0b0" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Legs (3) */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh key={deg} position={[Math.cos(rad) * 0.7, 0.12, Math.sin(rad) * 0.7]} rotation={[0, 0, Math.cos(rad) * 0.3]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 4]} />
            <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.4} />
          </mesh>
        );
      })}
      {/* Antenna dish */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.25, 0.08, 0.06, 12]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Antenna mast */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 4]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function PlayerController({ planet }: { planet?: string }) {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const verticalVel = useRef(0);
  const physY = useRef(GROUND_Y + EYE_HEIGHT);
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const keys = useRef<Record<string, boolean>>({});
  const isPointerLocked = useRef(false);
  const phaseRef = useRef(useGameStore.getState().phase);
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
        euler.current.setFromQuaternion(camera.quaternion, "YXZ");
      }
    });
    return unsub;
  }, [camera]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current) return;
      euler.current.y -= e.movementX * 0.002;
      euler.current.x -= e.movementY * 0.002;
      euler.current.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, euler.current.x),
      );
      camera.quaternion.setFromEuler(euler.current);
    };
    const onPointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement !== null;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    if (!isTouchDevice()) {
      window.addEventListener("mousemove", onMouseMove);
      document.addEventListener("pointerlockchange", onPointerLockChange);
    }

    physY.current = GROUND_Y + EYE_HEIGHT;
    camera.position.set(5, physY.current, 10);
    euler.current.y = -0.4;
    camera.quaternion.setFromEuler(euler.current);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (!isTouchDevice()) {
        window.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("pointerlockchange", onPointerLockChange);
      }
    };
  }, [camera]);

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
      euler.current.y -= tLookX;
      euler.current.x -= tLookY;
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    }

    const k = keys.current;
    const running = k["ShiftLeft"] || k["ShiftRight"] || touch.sprint;
    const speed = running ? RUN_SPEED : WALK_SPEED;
    _moveDir.set(0, 0, 0);

    // Keyboard input
    if (k["KeyW"] || k["ArrowUp"]) _moveDir.z -= 1;
    if (k["KeyS"] || k["ArrowDown"]) _moveDir.z += 1;
    if (k["KeyA"] || k["ArrowLeft"]) _moveDir.x -= 1;
    if (k["KeyD"] || k["ArrowRight"]) _moveDir.x += 1;

    // Touch joystick input
    if (touch.moveX !== 0 || touch.moveZ !== 0) {
      _moveDir.x += touch.moveX;
      _moveDir.z += touch.moveZ;
    }

    const isMoving = _moveDir.length() > 0;

    if (isMoving) {
      _moveDir.normalize();
      _moveDir.applyQuaternion(camera.quaternion);
      _moveDir.y = 0;
      _moveDir.normalize();
    }

    const accelFactor = 1 - Math.exp(-6 * delta);
    velocity.current.lerp(_moveDir.multiplyScalar(speed), accelFactor);
    camera.position.x += velocity.current.x * delta;
    camera.position.z += velocity.current.z * delta;

    const onGround = physY.current <= GROUND_Y + EYE_HEIGHT + 0.01;

    if ((k["Space"] || touch.jump) && onGround) {
      verticalVel.current = jumpV0;
    }

    verticalVel.current -= gravity * delta;
    physY.current += verticalVel.current * delta;

    if (physY.current < GROUND_Y + EYE_HEIGHT) {
      physY.current = GROUND_Y + EYE_HEIGHT;
      if (!wasOnGround.current && verticalVel.current < -0.5) {
        gameAudio.playThud();
      }
      verticalVel.current = 0;
    }
    wasOnGround.current = physY.current <= GROUND_Y + EYE_HEIGHT + 0.01;

    if (isMoving && wasOnGround.current) {
      bobPhase.current += delta * BOB_FREQ * (running ? 1.3 : 1);
      bobOffset.current = Math.sin(bobPhase.current) * BOB_AMP;
    } else {
      bobPhase.current = 0;
      bobOffset.current *= Math.exp(-10 * delta);
    }
    camera.position.y = physY.current + bobOffset.current;

    playerState.x = camera.position.x;
    playerState.z = camera.position.z;
    playerState.heading = euler.current.y;
    playerState.isMoving = isMoving && wasOnGround.current;
    playerState.speed = velocity.current.length();
  });

  return null;
}

function InspectCamera({ objects }: { objects: HeritageObject[] }) {
  const { camera } = useThree();
  const inspecting = useGameStore((s) => s.inspecting);
  const phase = useGameStore((s) => s.phase);
  const smoothedLook = useRef(new THREE.Vector3());

  useEffect(() => {
    if (phase === "inspect") {
      camera.getWorldDirection(smoothedLook.current);
      smoothedLook.current.multiplyScalar(4).add(camera.position);
    }
  }, [phase, inspecting.objectId, camera]);

  useFrame((_state, rawDelta) => {
    if (phase !== "inspect" || !inspecting.objectId) return;
    const obj = objects.find((o) => o.id === inspecting.objectId);
    if (!obj) return;

    const dt = Math.min(rawDelta, 0.05);
    const t = 1 - Math.exp(-5 * dt);
    _lookTarget.set(obj.position[0], obj.position[1] + 0.85, obj.position[2]);
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
}: {
  setNearObjectId: (id: string | null) => void;
  setObjectDistances: (d: Record<string, number>) => void;
  nearObjectId: string | null;
  objectDistances: Record<string, number>;
  missionId: string;
}) {
  const found = useGameStore((s) => s.objectsFoundThisRun);
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
        <MarsBase missionId={missionId} />
      ) : (
        <Suspense fallback={null}>
          <LMDescent position={[0, 0, 0]} scale={1} />
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
        />
      ))}

      <DustParticles planet={mission.planet} />
      <AmbientDust planet={mission.planet} />
      {!isMars && (
        <Suspense fallback={null}>
          <Footprints />
        </Suspense>
      )}

      <ProximityDetector setNearObjectId={setNearObjectId} setObjectDistances={setObjectDistances} objects={objects} />
      <PlayerController planet={mission.planet} />
      <InspectCamera objects={objects} />
    </>
  );
}

function InspectOverlay({ objects, missionId, isMars }: { objects: HeritageObject[]; missionId: string; isMars?: boolean }) {
  const { t } = useTranslation();
  const objectId = useGameStore((s) => s.inspecting.objectId);
  const send = useGameStore((s) => s.send);
  const obj = objects.find((o) => o.id === objectId);
  const mission = useMemo(() => getMission(missionId), [missionId]);
  const [visible, setVisible] = useState(false);
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") send("EXIT_INSPECT");
    };
    window.addEventListener("keydown", handler);
    const timer = requestAnimationFrame(() => setVisible(true));
    return () => {
      window.removeEventListener("keydown", handler);
      cancelAnimationFrame(timer);
      setVisible(false);
    };
  }, [send]);

  useEffect(() => {
    if (!objectId) return;
    stopNarration();
    const src = `/audio/heritage/${missionId}/${objectId}.mp3`;
    const howl = new Howl({ src: [src], volume: 0.85 });
    howlRef.current = howl;
    if (isMars) {
      gameAudio.playDataScan();
    } else {
      gameAudio.playQuindar();
    }
    const playTimer = setTimeout(() => howl.play(), 350);
    return () => {
      clearTimeout(playTimer);
      howl.fade(howl.volume(), 0, 400);
      setTimeout(() => howl.unload(), 500);
      howlRef.current = null;
    };
  }, [objectId, missionId, isMars]);

  if (!obj) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-end pointer-events-none">
      <div className="absolute inset-0 bg-space-950/50" />
      <div
        className={`pointer-events-auto relative m-4 w-96 max-h-[85vh] overflow-y-auto rounded-2xl border border-space-600/60 bg-space-900/95 backdrop-blur-xl transition-all duration-500 ${visible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"}`}
      >
        {/* Header stripe */}
        <div className="border-b border-space-700/50 bg-space-800/40 px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-widest text-signal/80">
            {t("inspect.missionLabel", { mission: mission.name, site: mission.site })}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-regolith-100">
            {obj.name}
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed text-regolith-300">
            {obj.description}
          </p>

          {/* XP Badge */}
          <div className="mt-5 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-signal/15 px-3 py-1.5 text-sm font-bold text-signal">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <polygon points="7,1 8.8,5.2 13.4,5.5 9.9,8.5 11,13 7,10.6 3,13 4.1,8.5 0.6,5.5 5.2,5.2" fill="currentColor" />
              </svg>
              +{obj.xp} XP
            </span>
          </div>

          {/* Source citation */}
          {obj.source && (
            <div className="mt-5 rounded-lg bg-space-800/50 px-4 py-3 border border-space-700/30">
              <p className="text-xs font-medium uppercase tracking-wider text-regolith-400/60 mb-1">
                {t("inspect.source")}
              </p>
              <p className="text-xs leading-relaxed text-regolith-400">
                {obj.source}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-space-700/40 px-6 py-3 flex items-center justify-between">
          <p className="text-xs text-regolith-400/50">
            {isTouchDevice() ? t("inspect.tapClose") : t("inspect.pressEsc")}
          </p>
          {isTouchDevice() && (
            <button
              onClick={() => send("EXIT_INSPECT")}
              className="rounded-lg border border-regolith-400/30 bg-space-800/80 px-4 py-2 text-sm font-bold text-regolith-200 active:bg-space-700"
            >
              CLOSE
            </button>
          )}
        </div>
      </div>
    </div>
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
    if (!nearObjectId || found.includes(nearObjectId) || !missionId) return;
    const obj = objects.find((o) => o.id === nearObjectId);
    addFoundObject(nearObjectId);
    findObject(missionId, nearObjectId);
    send("START_INSPECT", { objectId: nearObjectId });
    gameAudio.playScanComplete();

    setToast(t("xp.object", { amount: obj?.xp ?? 50, name: obj?.name ?? nearObjectId }));
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
        if (nearObjectId && !found.includes(nearObjectId) && missionId && phase !== "inspect") {
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

      {/* Top-right: mini radar */}
      <div className="absolute right-4 top-4 rounded-lg bg-space-950/60 p-1 backdrop-blur">
        <MiniRadar found={found} objects={objects} isMars={isMars} />
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
      {nearObj && !found.includes(nearObj.id) && phase !== "inspect" && !isTouchDevice() && (
        <div className="mx-auto mt-auto mb-32 rounded-xl bg-space-950/90 px-8 py-4 text-center backdrop-blur-md border border-space-700/50">
          <p className="font-display text-lg text-signal">
            {isScanning ? t("surface.scanning") : `[Hold E] ${t("surface.inspectPrompt")} ${nearObj.name}`}
          </p>
          <p className="mt-1 text-xs text-regolith-400">{t("surface.scanHint")}</p>
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
  const mission = useMemo(() => getMission(missionId ?? "apollo-11"), [missionId]);

  const handleCanvasClick = useCallback(() => {
    if (!isTouchDevice()) {
      document.body.requestPointerLock();
    }
  }, []);

  const touchScan = useCallback(() => {
    if (!nearObjectId || found.includes(nearObjectId) || !missionId) return;
    addFoundObject(nearObjectId);
    findObject(missionId, nearObjectId);
    send("START_INSPECT", { objectId: nearObjectId });
    gameAudio.playScanComplete();
  }, [nearObjectId, found, missionId, addFoundObject, findObject, send]);

  const touchFlag = useCallback(() => {
    if (!missionId) return;
    useAppStore.getState().plantFlag(missionId);
    send("PLANT_FLAG");
    gameAudio.playSuccess();
  }, [missionId, send]);

  const touchLaunch = useCallback(() => {
    send("LAUNCH_HOME");
  }, [send]);

  const canScan = !!nearObjectId && !found.includes(nearObjectId);

  return (
    <div className="relative h-screen w-full">
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
          />
          <Effects bloom vignette bloomThreshold={0.55} bloomIntensity={1.0} vignetteDarkness={0.6} />
        </Canvas>
      </div>
      <SurfaceHUD nearObjectId={nearObjectId} objects={mission.objects} planet={mission.planet} missionType={mission.missionType} />
      <TouchControls
        nearObjectId={nearObjectId}
        canScan={canScan}
        onScan={touchScan}
        onFlag={touchFlag}
        onLaunch={touchLaunch}
      />
      {phase === "inspect" && <InspectOverlay objects={mission.objects} missionId={missionId ?? "apollo-11"} isMars={mission.planet === "mars"} />}
    </div>
  );
}
