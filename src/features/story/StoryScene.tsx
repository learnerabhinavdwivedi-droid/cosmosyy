import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface StorySceneProps {
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
  const targetLook = useMemo(() => new THREE.Vector3(...cameraKeyframe.look), [cameraKeyframe.look]);

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

    const desiredPos = targetPos.clone().add(new THREE.Vector3(driftX, driftY, 0));
    const factor = Math.min(delta * 2.8, 1);

    camera.position.lerp(desiredPos, factor);
    currentLook.current.lerp(targetLook, factor);
    camera.lookAt(currentLook.current);
  });

  return null;
}

/* ─── Lunar Terrain & Stars ─── */
function StoryEnvironment() {
  const starsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 40 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 2;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  const groundGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(28, 28, 48, 48);
    const pos = geo.attributes.position;
    if (!pos) return geo;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const crater = -Math.exp(-((x * x + y * y) / 16)) * 0.25;
      const noise =
        Math.sin(x * 0.8) * 0.06 +
        Math.cos(y * 0.7) * 0.05 +
        Math.sin((x + y) * 1.5) * 0.02;
      pos.setZ(i, crater + noise);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <>
      {/* Starfield */}
      <points geometry={starsGeo}>
        <pointsMaterial size={0.12} color="#ffffff" transparent opacity={0.7} />
      </points>

      {/* Lunar Ground */}
      <mesh
        geometry={groundGeo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#475569" roughness={0.96} metalness={0.0} />
      </mesh>
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
      positions[i * 3] = -4 + Math.random() * 8;
      positions[i * 3 + 1] = 0.5 + Math.random() * 2.0;
      positions[i * 3 + 2] = 3.5 + Math.random() * 4.0;

      vels[i * 3] = (Math.random() - 0.5) * 0.2;
      vels[i * 3 + 1] = -0.2 - Math.random() * 0.2;
      vels[i * 3 + 2] = -2.5 - Math.random() * 1.5;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geo: geometry, velocities: vels };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;
    const pos = pointsRef.current.geometry.attributes.position;
    if (!pos) return;

    for (let i = 0; i < count; i++) {
      let z = pos.getZ(i) + (velocities[i * 3 + 2] ?? 0) * delta;
      let y = pos.getY(i) + (velocities[i * 3 + 1] ?? 0) * delta;
      let x = pos.getX(i) + (velocities[i * 3] ?? 0) * delta;

      if (z < -0.5) {
        z = 5.0 + Math.random() * 2.0;
        x = -2.5 + Math.random() * 5.0;
        y = 0.8 + Math.random() * 1.5;
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
      pos[i * 3] = (Math.random() - 0.5) * 0.32;
      pos[i * 3 + 1] = 0.55 + Math.random() * 1.25;
      pos[i * 3 + 2] = 0.015 + (Math.random() - 0.5) * 0.01;
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
              color="#f1f5f9"
              metalness={0.95}
              roughness={0.15}
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

/* ─── Main 3D Canvas Scene ─── */
export function StoryScene({
  action,
  cameraKeyframe,
  reduceMotion = false,
  isPlaying = true,
}: StorySceneProps) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ fov: 40, near: 0.1, far: 100, position: cameraKeyframe.pos }}
      style={{ background: "#020408" }}
    >
      {/* Aerospace Lighting */}
      <ambientLight intensity={0.35} color="#e2e8f0" />
      <directionalLight
        position={[-12, 8, 12]}
        intensity={2.8}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[10, 4, -8]} intensity={0.6} color="#60a5fa" />
      <hemisphereLight args={["#93c5fd", "#1e293b", 0.4]} />

      <StoryEnvironment />

      <SWCExperimentModel
        action={action}
        isPlaying={isPlaying}
        reduceMotion={reduceMotion}
      />

      <StoryCameraRig
        cameraKeyframe={cameraKeyframe}
        reduceMotion={reduceMotion}
        isPlaying={isPlaying}
      />
    </Canvas>
  );
}
