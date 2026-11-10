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
import { gameAudio } from "@/lib/gameAudio";
import { getMission, type HeritageObject } from "@/lib/missionData";
import { LMDescent } from "./LunarModule";
import { Terrain, GroundPlane } from "./Terrain";
import { getSunPosition, getEarthPosition } from "./sunPosition";
import * as THREE from "three";

const SCAN_RANGE = 5;

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

function HeritageMarker({
  obj,
  isFound,
  isNear,
}: {
  obj: HeritageObjectDef;
  isFound: boolean;
  isNear: boolean;
}) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const t = Date.now() * 0.001;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.5;
      (outerRingRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.6 + Math.sin(t * 3) * 0.2;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.8;
      (innerRingRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.5 + Math.sin(t * 2 + 1) * 0.2;
    }
    if (beamRef.current) {
      const beamOpacity = isNear ? 0.35 + Math.sin(t * 4) * 0.15 : 0.12;
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity = beamOpacity;
    }
    if (pulseRef.current) {
      const pulseScale = 1 + Math.sin(t * 2) * 0.3;
      pulseRef.current.scale.set(pulseScale, 1, pulseScale);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.15 + Math.sin(t * 2) * 0.1;
    }
    if (scanRef.current) {
      if (isNear) {
        const scanY = (t * 1.5) % 3;
        scanRef.current.position.y = scanY;
        (scanRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3;
      } else {
        (scanRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    }
  });

  if (obj.id === "descent-stage") return null;

  const baseColor = isFound ? "#66ff99" : isNear ? "#00d4ff" : "#ffd36e";
  const beamColor = isFound ? "#66ff99" : "#ffd36e";

  return (
    <group position={obj.position}>
      <mesh
        ref={outerRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.1, 0]}
      >
        <torusGeometry args={[1.5, 0.04, 8, 48]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={innerRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.15, 0]}
      >
        <torusGeometry args={[0.9, 0.03, 8, 32]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={pulseRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
      >
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {!isFound && (
        <mesh ref={beamRef} position={[0, 5, 0]}>
          <cylinderGeometry args={[0.08, 0.15, 10, 8]} />
          <meshBasicMaterial
            color={beamColor}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {isNear && !isFound && (
        <mesh ref={scanRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[0.6, 0.02, 6, 24]} />
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {!isFound && (
        <HoloParticles color={baseColor} speed={isNear ? 2 : 0.8} />
      )}

      <Text
        position={[0, 2.8, 0]}
        fontSize={0.32}
        color={isFound ? "#66ff99" : "#ffffff"}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {obj.name}
        {isFound ? " ✓" : ""}
      </Text>

      {isNear && !isFound && (
        <Text
          position={[0, 2.4, 0]}
          fontSize={0.2}
          color="#00d4ff"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {"[E] SCAN"}
        </Text>
      )}
    </group>
  );
}

function ProximityDetector({
  setNearObjectId,
  objects,
}: {
  setNearObjectId: (id: string | null) => void;
  objects: HeritageObject[];
}) {
  const { camera } = useThree();
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const prevNearest = useRef<string | null>(null);

  useFrame(() => {
    let nearest: string | null = null;
    let minDist = SCAN_RANGE;

    for (const obj of objects) {
      if (found.includes(obj.id)) continue;
      const dx = camera.position.x - obj.position[0];
      const dz = camera.position.z - obj.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDist) {
        minDist = dist;
        nearest = obj.id;
      }
    }

    if (nearest !== prevNearest.current) {
      prevNearest.current = nearest;
      setNearObjectId(nearest);
    }
  });

  return null;
}

const LUNAR_G = 1.0;
const EYE_HEIGHT = 1.7;
const GROUND_Y = 0;
const JUMP_V0 = 2.6;
const WALK_SPEED = 2;
const RUN_SPEED = 4.5;
const BOB_FREQ = 6;
const BOB_AMP = 0.03;
const _moveDir = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _currentLook = new THREE.Vector3();

const playerState = {
  x: 5, z: 10, heading: 0, isMoving: false, speed: 0,
};

function DustParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 40;
  const lifetimes = useRef(new Float32Array(count));
  const velocities = useRef(new Float32Array(count * 3));

  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame((_s, delta) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    const lt = lifetimes.current;
    const vel = velocities.current;

    for (let i = 0; i < count; i++) {
      lt[i] -= delta;
      if (lt[i] <= 0) {
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
        const x = posAttr.getX(i) + vel[i * 3] * delta;
        const y = posAttr.getY(i) + vel[i * 3 + 1] * delta;
        const z = posAttr.getZ(i) + vel[i * 3 + 2] * delta;
        vel[i * 3 + 1] -= 0.08 * delta;
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
        color="#b8b0a0"
        size={0.06}
        transparent
        opacity={0.35}
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

function PlayerController() {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const verticalVel = useRef(0);
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const keys = useRef<Record<string, boolean>>({});
  const isPointerLocked = useRef(false);
  const phaseRef = useRef(useGameStore.getState().phase);
  const bobPhase = useRef(0);
  const wasOnGround = useRef(true);

  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      phaseRef.current = s.phase;
      if (s.phase === "inspect") {
        document.exitPointerLock();
      }
    });
    return unsub;
  }, []);

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
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerlockchange", onPointerLockChange);

    camera.position.set(5, EYE_HEIGHT, 10);
    euler.current.y = -0.4;
    camera.quaternion.setFromEuler(euler.current);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
    };
  }, [camera]);

  useFrame((_state, delta) => {
    if (phaseRef.current === "inspect") {
      velocity.current.set(0, 0, 0);
      playerState.isMoving = false;
      return;
    }

    const k = keys.current;
    const running = k["ShiftLeft"] || k["ShiftRight"];
    const speed = running ? RUN_SPEED : WALK_SPEED;
    _moveDir.set(0, 0, 0);

    if (k["KeyW"] || k["ArrowUp"]) _moveDir.z -= 1;
    if (k["KeyS"] || k["ArrowDown"]) _moveDir.z += 1;
    if (k["KeyA"] || k["ArrowLeft"]) _moveDir.x -= 1;
    if (k["KeyD"] || k["ArrowRight"]) _moveDir.x += 1;

    const isMoving = _moveDir.length() > 0;

    if (isMoving) {
      _moveDir.normalize();
      _moveDir.applyQuaternion(camera.quaternion);
      _moveDir.y = 0;
      _moveDir.normalize();
    }

    velocity.current.lerp(_moveDir.multiplyScalar(speed), delta * 2.5);
    camera.position.x += velocity.current.x * delta;
    camera.position.z += velocity.current.z * delta;

    const onGround = camera.position.y <= GROUND_Y + EYE_HEIGHT + 0.01;

    if (k["Space"] && onGround) {
      verticalVel.current = JUMP_V0;
    }

    verticalVel.current -= LUNAR_G * delta;
    camera.position.y += verticalVel.current * delta;

    if (camera.position.y < GROUND_Y + EYE_HEIGHT) {
      camera.position.y = GROUND_Y + EYE_HEIGHT;
      if (!wasOnGround.current && verticalVel.current < -0.5) {
        gameAudio.playThud();
      }
      verticalVel.current = 0;
    }
    wasOnGround.current = onGround;

    if (isMoving && onGround) {
      bobPhase.current += delta * BOB_FREQ * (running ? 1.3 : 1);
      camera.position.y += Math.sin(bobPhase.current) * BOB_AMP;
    } else {
      bobPhase.current = 0;
    }

    playerState.x = camera.position.x;
    playerState.z = camera.position.z;
    playerState.heading = euler.current.y;
    playerState.isMoving = isMoving && onGround;
    playerState.speed = velocity.current.length();
  });

  return null;
}

function InspectCamera({ objects }: { objects: HeritageObject[] }) {
  const { camera } = useThree();
  const inspecting = useGameStore((s) => s.inspecting);
  const phase = useGameStore((s) => s.phase);
  const lerpProgress = useRef(0);

  useFrame((_state, delta) => {
    if (phase !== "inspect" || !inspecting.objectId) return;
    const obj = objects.find((o) => o.id === inspecting.objectId);
    if (!obj) return;

    lerpProgress.current = Math.min(lerpProgress.current + delta * 2, 1);

    _lookTarget.set(obj.position[0], obj.position[1] + 1, obj.position[2]);
    camera.getWorldDirection(_currentLook);
    _currentLook.add(camera.position);
    _currentLook.lerp(_lookTarget, lerpProgress.current * 0.08);
    camera.lookAt(_currentLook);
  });

  useEffect(() => {
    lerpProgress.current = 0;
  }, [inspecting.objectId]);

  return null;
}

function EarthInSky({ lat, lon }: { lat: number; lon: number }) {
  const texture = useLoader(THREE.TextureLoader, "/textures/earth.jpg");
  const earthPos = useMemo(() => getEarthPosition(lat, lon), [lat, lon]);
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01;
  });

  return (
    <mesh ref={ref} position={earthPos}>
      <sphereGeometry args={[8, 64, 64]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

function SunLight({ lat, lon, evaDate }: { lat: number; lon: number; evaDate: string }) {
  const sunData = useMemo(() => getSunPosition(lat, lon, evaDate), [lat, lon, evaDate]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(
        `[Sun] elevation: ${sunData.elevation.toFixed(1)}°, azimuth: ${sunData.azimuth.toFixed(1)}°`,
      );
    }
  }, [sunData]);

  return (
    <directionalLight
      position={sunData.direction}
      intensity={3.0}
      color="#fff5e0"
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
  );
}

function SurfaceSceneContent({
  setNearObjectId,
  nearObjectId,
  missionId,
}: {
  setNearObjectId: (id: string | null) => void;
  nearObjectId: string | null;
  missionId: string;
}) {
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const mission = useMemo(() => getMission(missionId), [missionId]);
  const objects = mission.objects;

  return (
    <>
      <Stars
        radius={300}
        depth={60}
        count={5000}
        factor={4}
        fade
        speed={0}
      />

      <ambientLight intensity={0.02} color="#333344" />
      <SunLight lat={mission.landing.lat} lon={mission.landing.lon} evaDate={mission.evaSunTime} />

      <Suspense fallback={null}>
        <EarthInSky lat={mission.landing.lat} lon={mission.landing.lon} />
      </Suspense>

      <Suspense fallback={<GroundPlane />}>
        <Terrain stlPath={mission.terrain.model} orthoPath={mission.terrain.ortho} />
      </Suspense>
      <GroundPlane />

      <Suspense fallback={null}>
        <LMDescent position={[0, 0, 0]} scale={1} />
      </Suspense>

      {objects.map((obj) => (
        <HeritageMarker
          key={obj.id}
          obj={obj}
          isFound={found.includes(obj.id)}
          isNear={nearObjectId === obj.id}
        />
      ))}

      <DustParticles />
      <Suspense fallback={null}>
        <Footprints />
      </Suspense>

      <ProximityDetector setNearObjectId={setNearObjectId} objects={objects} />
      <PlayerController />
      <InspectCamera objects={objects} />
    </>
  );
}

function InspectOverlay({ objects }: { objects: HeritageObject[] }) {
  const { t } = useTranslation();
  const objectId = useGameStore((s) => s.inspecting.objectId);
  const send = useGameStore((s) => s.send);
  const obj = objects.find((o) => o.id === objectId);
  const [visible, setVisible] = useState(false);

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

  if (!obj) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-end justify-end pointer-events-none">
      <div className="absolute inset-0 bg-space-950/40" />
      <div
        className={`pointer-events-auto relative m-4 w-80 rounded-xl border border-space-700 bg-space-900/95 p-6 backdrop-blur-md transition-all duration-300 ${visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
      >
        <h2 className="font-display text-xl font-bold text-regolith-200">
          {obj.name}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-regolith-400">
          {obj.description}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span className="rounded bg-signal/20 px-2 py-1 text-xs text-signal">
            +{obj.xp} XP
          </span>
        </div>
        <div className="mt-4 border-t border-space-700 pt-3">
          <p className="text-xs text-regolith-400/60">
            {t("inspect.pressEsc")}
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniRadar({ found, objects }: { found: string[]; objects: HeritageObject[] }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 200);
    return () => clearInterval(id);
  }, []);

  const px = playerState.x;
  const pz = playerState.z;
  const heading = playerState.heading;
  const radarRange = 50;

  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 opacity-80">
      <circle cx="50" cy="50" r="48" fill="none" stroke="#ffd36e" strokeWidth="0.5" strokeOpacity="0.3" />
      <circle cx="50" cy="50" r="32" fill="none" stroke="#ffd36e" strokeWidth="0.3" strokeOpacity="0.2" />
      <circle cx="50" cy="50" r="16" fill="none" stroke="#ffd36e" strokeWidth="0.3" strokeOpacity="0.15" />
      <line x1="50" y1="2" x2="50" y2="12" stroke="#00d4ff" strokeWidth="1.5" strokeOpacity="0.6" />
      {/* LM at origin */}
      {(() => {
        const dx = (0 - px) / radarRange;
        const dz = (0 - pz) / radarRange;
        const rx = dx * Math.cos(-heading) - dz * Math.sin(-heading);
        const rz = dx * Math.sin(-heading) + dz * Math.cos(-heading);
        const sx = 50 + rx * 45;
        const sy = 50 - rz * 45;
        if (sx > 5 && sx < 95 && sy > 5 && sy < 95) {
          return <rect x={sx - 3} y={sy - 3} width="6" height="6" fill="#66ff99" opacity="0.8" />;
        }
        return null;
      })()}
      {objects.filter((o) => o.id !== "descent-stage" && !found.includes(o.id)).map((obj) => {
        const dx = (obj.position[0] - px) / radarRange;
        const dz = (obj.position[2] - pz) / radarRange;
        const rx = dx * Math.cos(-heading) - dz * Math.sin(-heading);
        const rz = dx * Math.sin(-heading) + dz * Math.cos(-heading);
        const sx = 50 + rx * 45;
        const sy = 50 - rz * 45;
        if (sx < 2 || sx > 98 || sy < 2 || sy > 98) return null;
        return <circle key={obj.id} cx={sx} cy={sy} r="3" fill="#ffd36e" opacity="0.9" />;
      })}
      <circle cx="50" cy="50" r="2.5" fill="#00d4ff" />
    </svg>
  );
}

function SurfaceHUD({ nearObjectId, objects }: { nearObjectId: string | null; objects: HeritageObject[] }) {
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

  const narration = useMemo(() => {
    if (found.length >= objects.length) {
      return t("surface.narrationAllFound");
    }
    if (found.length > 0) {
      return t("surface.narrationProgress", { found: found.length, total: objects.length });
    }
    return t("surface.narrationStart", { name: playerName || "" });
  }, [found.length, playerName, t]);

  const handleInteract = useCallback(() => {
    if (!nearObjectId || found.includes(nearObjectId) || !missionId) return;
    const obj = objects.find((o) => o.id === nearObjectId);
    addFoundObject(nearObjectId);
    findObject(missionId, nearObjectId);
    send("START_INSPECT", { objectId: nearObjectId });
    gameAudio.playRadioBeep();

    setToast(t("xp.object", { amount: obj?.xp ?? 50, name: obj?.name ?? nearObjectId }));
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, [nearObjectId, found, missionId, addFoundObject, findObject, send, t]);

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
    const handler = (e: KeyboardEvent) => {
      if (e.key === "e" || e.key === "E") handleInteract();
      if ((e.key === "f" || e.key === "F") && phase === "flagReady")
        handleFlag();
      if ((e.key === "l" || e.key === "L") && phase === "flagPlanted")
        handleLaunch();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, handleInteract, handleFlag, handleLaunch]);

  useEffect(() => {
    if (found.length >= objects.length && phase === "explore") {
      send("ALL_FOUND");
    }
  }, [found.length, phase, send]);

  const nearObj = objects.find((o) => o.id === nearObjectId);

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
            {t("surface.distLM")} <span className="text-ok">{distFromLM}m</span>
          </p>
        </div>
      </div>

      {/* Top-center: objects found */}
      <div className="mx-auto mt-4 rounded-lg bg-space-950/70 px-5 py-2 text-center backdrop-blur">
        <p className="font-mono text-sm text-regolith-200">
          {t("surface.objectCount", { found: found.length, total: objects.length })}
        </p>
      </div>

      {/* Top-right: mini radar */}
      <div className="absolute right-4 top-4 rounded-lg bg-space-950/60 p-1 backdrop-blur">
        <MiniRadar found={found} objects={objects} />
      </div>

      {/* XP toast */}
      {toast && (
        <div className="mx-auto mt-4 rounded-lg bg-signal/20 px-5 py-2 text-center backdrop-blur">
          <p className="font-display text-lg font-bold text-signal">{toast}</p>
        </div>
      )}

      {/* Crosshair */}
      {phase !== "inspect" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-0.5 w-4 rounded-full bg-regolith-200/30" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-regolith-200/30" />
        </div>
      )}

      {/* Interaction prompt */}
      {nearObj && !found.includes(nearObj.id) && phase !== "inspect" && (
        <div className="mx-auto mt-auto mb-32 rounded-xl bg-space-950/90 px-8 py-4 text-center backdrop-blur-md border border-space-700/50">
          <p className="font-display text-lg text-signal">
            [E] {t("surface.inspectPrompt")} {nearObj.name}
          </p>
          <p className="mt-1 text-xs text-regolith-400">{t("surface.scanHint")}</p>
        </div>
      )}

      {phase === "flagReady" && (
        <div className="mx-auto mt-auto mb-32 rounded-xl bg-signal/20 px-8 py-4 text-center backdrop-blur-md border border-signal/30">
          <p className="animate-pulse font-display text-lg text-signal">
            [F] {t("surface.flagPrompt")}
          </p>
        </div>
      )}

      {phase === "flagPlanted" && (
        <div className="mx-auto mt-auto mb-32 rounded-xl bg-ok/20 px-8 py-4 text-center backdrop-blur-md border border-ok/30">
          <p className="animate-pulse font-display text-lg text-ok">
            [L] {t("surface.launchPrompt")}
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

      {/* Bottom left: controls hint */}
      <div className="mb-2 ml-4">
        <p className="text-xs text-regolith-400/60">
          {t("surface.controlHints")}
        </p>
      </div>
    </div>
  );
}

export function SurfaceScene() {
  const phase = useGameStore((s) => s.phase);
  const missionId = useGameStore((s) => s.missionId);
  const [nearObjectId, setNearObjectId] = useState<string | null>(null);
  const mission = useMemo(() => getMission(missionId ?? "apollo-11"), [missionId]);

  const handleCanvasClick = useCallback(() => {
    document.body.requestPointerLock();
  }, []);

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
          <color attach="background" args={["#000000"]} />
          <SurfaceSceneContent
            nearObjectId={nearObjectId}
            setNearObjectId={setNearObjectId}
            missionId={missionId ?? "apollo-11"}
          />
          <Effects bloom vignette bloomIntensity={0.4} vignetteDarkness={0.6} />
        </Canvas>
      </div>
      <SurfaceHUD nearObjectId={nearObjectId} objects={mission.objects} />
      {phase === "inspect" && <InspectOverlay objects={mission.objects} />}
    </div>
  );
}
