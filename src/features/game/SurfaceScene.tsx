import { useRef, useEffect, useState, useCallback, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Stars, Text } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { useGameStore } from "@/store/useGameStore";
import { useAppStore } from "@/store/useAppStore";
import { LunarModule } from "./LunarModule";
import { Terrain, GroundPlane } from "./Terrain";
import { getApollo11SunPosition, getApollo11EarthPosition } from "./sunPosition";
import missionData from "../../../content/missions/apollo-11.json";
import * as THREE from "three";

interface HeritageObjectDef {
  id: string;
  name: string;
  position: [number, number, number];
  description: string;
  xp: number;
}

const OBJECTS: HeritageObjectDef[] = missionData.objects.map((o) => ({
  id: o.id,
  name: o.name,
  position: o.position as [number, number, number],
  description: o.description,
  xp: o.xp,
}));

const TOTAL_OBJECTS = OBJECTS.length;

function HeritageMarker({
  obj,
  isFound,
  isNear,
  onApproach,
  onLeave,
}: {
  obj: HeritageObjectDef;
  isFound: boolean;
  isNear: boolean;
  onApproach: () => void;
  onLeave: () => void;
}) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (glowRef.current && !isFound) {
      glowRef.current.rotation.y += delta * 2;
      const s = 1 + Math.sin(Date.now() * 0.003) * 0.15;
      glowRef.current.scale.setScalar(s);
    }
  });

  // TEMPORARY: placeholder markers until real object models exist
  // The descent-stage uses the LM model itself (rendered separately)
  if (obj.id === "descent-stage") return null;

  return (
    <group position={obj.position}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[2, 2, 2]}
          sensor
          onIntersectionEnter={onApproach}
          onIntersectionExit={onLeave}
        />
      </RigidBody>

      {/* TEMPORARY placeholder geometry — replace with real models */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 8]} />
        <meshStandardMaterial
          color={isFound ? "#4a4a4a" : "#cccccc"}
          roughness={0.7}
          metalness={0.3}
          emissive={isNear && !isFound ? "#f59e0b" : "#000000"}
          emissiveIntensity={isNear && !isFound ? 0.3 : 0}
        />
      </mesh>

      {/* Floating indicator */}
      {!isFound && (
        <mesh ref={glowRef} position={[0, 1.5, 0]}>
          <octahedronGeometry args={[0.2]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={1}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      <Text
        position={[0, 2, 0]}
        fontSize={0.25}
        color={isFound ? "#666666" : "#ffffff"}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {obj.name}
        {isFound ? " ✓" : ""}
      </Text>
    </group>
  );
}

function PlayerController() {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const keys = useRef<Record<string, boolean>>({});
  const isPointerLocked = useRef(false);

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

    // Start near the LM, looking at it
    camera.position.set(5, 1.7, 10);
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
    const k = keys.current;
    // Lunar gravity means slower, bouncier movement
    const speed = k["ShiftLeft"] || k["ShiftRight"] ? 4 : 2;
    const moveDir = new THREE.Vector3();

    if (k["KeyW"] || k["ArrowUp"]) moveDir.z -= 1;
    if (k["KeyS"] || k["ArrowDown"]) moveDir.z += 1;
    if (k["KeyA"] || k["ArrowLeft"]) moveDir.x -= 1;
    if (k["KeyD"] || k["ArrowRight"]) moveDir.x += 1;

    if (moveDir.length() > 0) {
      moveDir.normalize();
      moveDir.applyQuaternion(camera.quaternion);
      moveDir.y = 0;
      moveDir.normalize();
    }

    // Slower acceleration for lunar gravity feel
    velocity.current.lerp(moveDir.multiplyScalar(speed), delta * 3);
    camera.position.addScaledVector(velocity.current, delta);
    camera.position.y = 1.7;
  });

  return null;
}

function EarthInSky() {
  const texture = useLoader(THREE.TextureLoader, "/textures/earth.jpg");
  const earthPos = useMemo(() => getApollo11EarthPosition(), []);
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

function SunLight() {
  const sunData = useMemo(() => getApollo11SunPosition(), []);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(
        `[Sun] elevation: ${sunData.elevation.toFixed(1)}°, azimuth: ${sunData.azimuth.toFixed(1)}°`,
      );
    }
  }, [sunData]);

  return (
    <directionalLight
      ref={lightRef}
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
  nearObjectId,
  setNearObjectId,
}: {
  nearObjectId: string | null;
  setNearObjectId: (id: string | null) => void;
}) {
  const found = useGameStore((s) => s.objectsFoundThisRun);

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

      {/* Real sun position from astronomy-engine, no ambient fill */}
      <ambientLight intensity={0.02} color="#333344" />
      <SunLight />

      {/* Earth in the lunar sky */}
      <Suspense fallback={null}>
        <EarthInSky />
      </Suspense>

      {/* NASA STL terrain + fallback ground */}
      <Suspense fallback={<GroundPlane />}>
        <Terrain />
      </Suspense>
      <GroundPlane />

      {/* NASA LM model at centre of Tranquility Base */}
      <Suspense fallback={null}>
        <LunarModule position={[0, 0, 0]} scale={1} />
      </Suspense>

      {/* Heritage objects (TEMPORARY placeholders except LM) */}
      {OBJECTS.map((obj) => (
        <HeritageMarker
          key={obj.id}
          obj={obj}
          isFound={found.includes(obj.id)}
          isNear={nearObjectId === obj.id}
          onApproach={() => setNearObjectId(obj.id)}
          onLeave={() => setNearObjectId(null)}
        />
      ))}

      <PlayerController />
    </>
  );
}

function InspectOverlay() {
  const objectId = useGameStore((s) => s.inspecting.objectId);
  const send = useGameStore((s) => s.send);
  const obj = OBJECTS.find((o) => o.id === objectId);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") send("EXIT_INSPECT");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [send]);

  if (!obj) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-space-950/80 backdrop-blur-sm">
      <div className="mx-4 max-w-lg rounded-xl border border-space-700 bg-space-900 p-8">
        <h2 className="font-display text-2xl font-bold text-regolith-200">
          {obj.name}
        </h2>
        <p className="mt-4 leading-relaxed text-regolith-400">
          {obj.description}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <span className="rounded bg-signal/20 px-2 py-1 text-xs text-signal">
            +{obj.xp} XP
          </span>
          <span className="text-xs text-regolith-400">
            Press ESC to return
          </span>
        </div>
      </div>
    </div>
  );
}

function SurfaceHUD({ nearObjectId }: { nearObjectId: string | null }) {
  const phase = useGameStore((s) => s.phase);
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const send = useGameStore((s) => s.send);
  const addFoundObject = useGameStore((s) => s.addFoundObject);
  const addXp = useAppStore((s) => s.addXp);
  const findObject = useAppStore((s) => s.findObject);
  const missionId = useGameStore((s) => s.missionId);

  const handleInteract = useCallback(() => {
    if (!nearObjectId || found.includes(nearObjectId) || !missionId) return;
    const obj = OBJECTS.find((o) => o.id === nearObjectId);
    addFoundObject(nearObjectId);
    findObject(missionId, nearObjectId);
    addXp(missionId, obj?.xp ?? 50);
    send("START_INSPECT", { objectId: nearObjectId });
  }, [nearObjectId, found, missionId, addFoundObject, findObject, addXp, send]);

  const handleFlag = useCallback(() => {
    if (!missionId) return;
    useAppStore.getState().plantFlag(missionId);
    addXp(missionId, 100);
    send("PLANT_FLAG");
  }, [missionId, addXp, send]);

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
    if (found.length >= TOTAL_OBJECTS && phase === "explore") {
      send("ALL_FOUND");
    }
  }, [found.length, phase, send]);

  const nearObj = OBJECTS.find((o) => o.id === nearObjectId);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      {/* Top: objects found */}
      <div className="mx-auto mt-4 rounded-lg bg-space-950/80 px-4 py-2 text-center backdrop-blur">
        <p className="text-sm text-regolith-400">
          Objects: {found.length} / {TOTAL_OBJECTS}
        </p>
      </div>

      {/* Centre: interaction prompt */}
      {nearObj && !found.includes(nearObj.id) && phase !== "inspect" && (
        <div className="mx-auto mt-auto mb-32 rounded-lg bg-space-950/90 px-6 py-3 text-center backdrop-blur">
          <p className="font-display text-lg text-signal">
            [E] Inspect {nearObj.name}
          </p>
        </div>
      )}

      {phase === "flagReady" && (
        <div className="mx-auto mt-auto mb-32 rounded-lg bg-signal/20 px-6 py-3 text-center backdrop-blur">
          <p className="animate-pulse font-display text-lg text-signal">
            [F] Plant the flag — all objects found!
          </p>
        </div>
      )}

      {phase === "flagPlanted" && (
        <div className="mx-auto mt-auto mb-32 rounded-lg bg-signal/20 px-6 py-3 text-center backdrop-blur">
          <p className="animate-pulse font-display text-lg text-signal">
            [L] Launch home
          </p>
        </div>
      )}

      {/* Bottom left: controls hint */}
      <div className="mt-auto mb-4 ml-4">
        <p className="text-xs text-regolith-400/60">
          Click to look · WASD move · Shift run · E inspect · ` debug
        </p>
      </div>
    </div>
  );
}

export function SurfaceScene() {
  const phase = useGameStore((s) => s.phase);
  const [nearObjectId, setNearObjectId] = useState<string | null>(null);

  const handleCanvasClick = useCallback(() => {
    document.body.requestPointerLock();
  }, []);

  return (
    <div className="relative h-screen w-full">
      <div className="h-full w-full" onClick={handleCanvasClick}>
        <Canvas
          shadows
          camera={{ position: [5, 1.7, 10], fov: 70, near: 0.1, far: 2000 }}
          gl={{
            antialias: true,
            toneMapping: THREE.AgXToneMapping,
            toneMappingExposure: 1.2,
          }}
        >
          <color attach="background" args={["#000000"]} />
          <Physics gravity={[0, -1.62, 0]}>
            <SurfaceSceneContent
              nearObjectId={nearObjectId}
              setNearObjectId={setNearObjectId}
            />
          </Physics>
        </Canvas>
      </div>
      <SurfaceHUD nearObjectId={nearObjectId} />
      {phase === "inspect" && <InspectOverlay />}
    </div>
  );
}
