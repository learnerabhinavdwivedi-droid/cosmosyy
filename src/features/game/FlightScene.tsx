import { useRef, useEffect, useMemo, useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Stars, useGLTF } from "@react-three/drei";
import { Effects } from "./Effects";
import { useGameStore, type GamePhase } from "@/store/useGameStore";
import { useAppStore } from "@/store/useAppStore";
import { getMissionOrNull, type MissionSpec } from "@/lib/missionData";
import * as THREE from "three";

const EARTH = new THREE.Vector3(-28, 0, -20);
const MOON = new THREE.Vector3(20, 0, -20);
const MOON_R = 8;
const ORBIT_R = 11;

const ease = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

const ORBIT_A0 = Math.PI;
const ORBIT_A1 = Math.PI * 1.8;

const WP_FLIGHT_A = new THREE.Vector3(-20, 1, -16);
const WP_FLIGHT_B = new THREE.Vector3(-4, 3, -17);
const WP_COAST_B = new THREE.Vector3(9, 1.5, -20);
const WP_ORBIT_END = new THREE.Vector3();
const WP_TARGET_B = new THREE.Vector3(28, 3, -20);
const WP_LAND = new THREE.Vector3(28, 0.2, -20);

const LAND_SCENE = new THREE.Vector3(100, 0, 0);
const LAND_DROP_START = 12;
const LAND_CUT_AT = 0.3;

const _orbitOut = new THREE.Vector3();
function orbitPos(angle: number, out: THREE.Vector3): THREE.Vector3 {
  return out.set(
    MOON.x + ORBIT_R * Math.cos(angle),
    1,
    MOON.z + ORBIT_R * Math.sin(angle),
  );
}

const _shipOut = new THREE.Vector3();
function shipPos(phase: string, p: number): THREE.Vector3 {
  const t = ease(p);
  const v = _shipOut;
  switch (phase) {
    case "flight":
      v.lerpVectors(WP_FLIGHT_A, WP_FLIGHT_B, t);
      break;
    case "coast":
      v.lerpVectors(WP_FLIGHT_B, WP_COAST_B, t);
      break;
    case "orbit":
      orbitPos(ORBIT_A0 + (ORBIT_A1 - ORBIT_A0) * t, v);
      break;
    case "targetLocked":
      orbitPos(ORBIT_A1, WP_ORBIT_END);
      v.lerpVectors(WP_ORBIT_END, WP_TARGET_B, t);
      break;
    case "descent":
      if (p < LAND_CUT_AT) {
        v.lerpVectors(WP_TARGET_B, WP_LAND, t);
      } else {
        const lp = (p - LAND_CUT_AT) / (1 - LAND_CUT_AT);
        const height = LAND_DROP_START * (1 - ease(lp));
        v.set(LAND_SCENE.x, LAND_SCENE.y + 0.5 + height, LAND_SCENE.z);
      }
      break;
    default:
      v.set(LAND_SCENE.x, LAND_SCENE.y + 0.5, LAND_SCENE.z);
  }
  return v;
}

const _camPos = new THREE.Vector3();
const _camLook = new THREE.Vector3();
const ORBIT_CAM_POS = new THREE.Vector3(42, 12, -5);
const MOON_LOOK = new THREE.Vector3(MOON.x, MOON.y + 1, MOON.z);

function camTarget(
  phase: string,
  sp: THREE.Vector3,
  progress: number,
): { pos: THREE.Vector3; look: THREE.Vector3 } {
  if (phase === "orbit") {
    _camPos.copy(ORBIT_CAM_POS);
    _camLook.copy(MOON_LOOK);
  } else if (phase === "flight") {
    _camPos.set(sp.x + 2, sp.y + 1.2, sp.z + 5);
    _camLook.copy(sp);
  } else if (phase === "coast") {
    const pullback = 5 + progress * 6;
    _camPos.set(sp.x + 3, sp.y + 2 + progress * 3, sp.z + pullback);
    _camLook.copy(sp);
  } else if (phase === "targetLocked") {
    _camPos.set(sp.x + 2, sp.y - 0.5, sp.z + 4);
    _camLook.copy(sp);
  } else if (phase === "descent") {
    if (progress < LAND_CUT_AT) {
      const close = 4 - progress * 4;
      _camPos.set(sp.x + close, sp.y + 0.5 + (1 - progress) * 2, sp.z + close);
      _camLook.copy(sp);
    } else {
      _camPos.set(LAND_SCENE.x + 6, LAND_SCENE.y + 2, LAND_SCENE.z + 6);
      _camLook.set(LAND_SCENE.x, sp.y, LAND_SCENE.z);
    }
  } else if (phase === "touchdown") {
    _camPos.set(LAND_SCENE.x + 5, LAND_SCENE.y + 1.5, LAND_SCENE.z + 5);
    _camLook.set(LAND_SCENE.x, LAND_SCENE.y + 0.5, LAND_SCENE.z);
  } else if (phase === "stepOut") {
    _camPos.set(LAND_SCENE.x + 4, LAND_SCENE.y + 1, LAND_SCENE.z + 4);
    _camLook.set(LAND_SCENE.x, LAND_SCENE.y + 0.5, LAND_SCENE.z);
  } else {
    _camPos.set(sp.x + 3, sp.y + 2, sp.z + 5);
    _camLook.copy(sp);
  }
  return { pos: _camPos, look: _camLook };
}

const DUR: Record<string, number> = {
  flight: 14,
  coast: 13,
  orbit: 12,
  targetLocked: 4,
  descent: 13,
  touchdown: 12,
  stepOut: 12,
};

const BEAT_EVENTS = [
  { from: "flight" as GamePhase, event: "START_COAST" as const, delay: 20000 },
  { from: "coast" as GamePhase, event: "REACH_ORBIT" as const, delay: 18000 },
  { from: "orbit" as GamePhase, event: "LOCK_TARGET" as const, delay: 16000 },
  // targetLocked: GATE — player presses Space to BEGIN_DESCENT
  { from: "descent" as GamePhase, event: "TOUCH_DOWN" as const, delay: 17000 },
  // touchdown: GATE — player presses Space to OPEN_HATCH
  { from: "stepOut" as GamePhase, event: "STEP_OUT" as const, delay: 16000 },
];

type NarrationSet = Record<string, string>;

const MISSION_NARRATION: Record<string, (n: string) => NarrationSet> = {
  "apollo-11": (n) => ({
    flight: "Welcome aboard, " + n + ". Apollo 11 is bound for the Moon. Three days, 240,000 miles. Your mission: land at the Sea of Tranquility and find what Armstrong and Aldrin left behind.",
    coast: "Collins stays in orbit aboard Columbia. You ride Eagle down with Armstrong and Aldrin. No human has ever attempted a lunar landing before.",
    orbit: "Lunar Orbit Insertion complete. The far side was silent and dark. Now the Sea of Tranquility fills your window.",
    targetLocked: "Target locked: Tranquility Base. 0.67 degrees North, 23.47 degrees East. Undocking Eagle for powered descent.",
    descent: "Eagle's descent engine firing. Program alarms, 1202, 1202. Ignore them. Armstrong takes manual control. Fuel running low. Almost there.",
    touchdown: "Contact light. Engine stop. The Eagle has landed. Tranquility Base, July 20, 1969. Houston, we copy you on the ground.",
    stepOut: "Cabin depressurised. Opening the hatch. That's one small step for man, " + n + ". One giant leap for mankind.",
  }),
  "apollo-12": (n) => ({
    flight: "Welcome aboard, " + n + ". Apollo 12 is bound for the Ocean of Storms. Thirty-six seconds after launch, lightning struck the Saturn V twice. All telemetry went haywire. But the crew kept flying.",
    coast: "Gordon stays in orbit aboard Yankee Clipper. You ride Intrepid down with Conrad and Bean. Target: a precision landing beside Surveyor 3, the unmanned probe that landed two years ago.",
    orbit: "Lunar Orbit Insertion complete. The Ocean of Storms stretches below, vast and grey. Surveyor 3 is down there somewhere, waiting.",
    targetLocked: "Target locked: 3.01 degrees South, 23.42 degrees West. Ocean of Storms. Conrad is threading the needle, aiming Intrepid right next to Surveyor 3.",
    descent: "Intrepid's descent engine firing. Conrad grins: he can see the crater. Bean calls out the numbers. Right on target.",
    touchdown: "Contact light. Intrepid has landed. November 19, 1969. Conrad's first words: Whoopee! Man, that may have been a small one for Neil, but that's a long one for me.",
    stepOut: "Cabin depressurised. Opening the hatch. The Ocean of Storms awaits, " + n + ". Surveyor 3 is just a short walk away.",
  }),
  "apollo-14": (n) => ({
    flight: "Welcome aboard, " + n + ". Apollo 14 is bound for Fra Mauro, the highlands target Apollo 13 never reached. Shepard is back. America's first astronaut, now commanding a Moon mission at age 47.",
    coast: "Roosa stays in orbit aboard Kitty Hawk. You ride Antares down with Shepard and Mitchell. After the Apollo 13 abort, NASA needs this landing to succeed.",
    orbit: "Lunar Orbit Insertion complete. Fra Mauro's rolling hills are visible below. This ancient impact site holds secrets about the Moon's formation.",
    targetLocked: "Target locked: 3.65 degrees South, 17.47 degrees West. Fra Mauro formation. A computer abort signal fires, but it's a false alarm. Mitchell patches the software. Undocking Antares.",
    descent: "Antares is descending. The landing radar locks on late, 18,000 feet. Shepard takes manual control. The highlands rise to meet you.",
    touchdown: "Contact light. Antares has landed at Fra Mauro. February 5, 1971. Shepard: It's been a long way, but we're here.",
    stepOut: "Cabin depressurised. Opening the hatch. Walk the hills of Fra Mauro, " + n + ". And yes, Shepard brought his golf club.",
  }),
  "apollo-15": (n) => ({
    flight: "Welcome aboard, " + n + ". Apollo 15 is the first J-mission: longer stays, more science, and the first lunar rover. Destination: the Hadley-Apennine region, where mountains meet a winding canyon.",
    coast: "Worden stays in orbit aboard Endeavour running a full science bay. You ride Falcon down with Scott and Irwin. The rover is folded up in the descent stage, ready to deploy.",
    orbit: "Lunar Orbit Insertion complete. The Apennine mountains tower 15,000 feet above the plain. Hadley Rille carves a sinuous channel along the base. Extraordinary.",
    targetLocked: "Target locked: 26.13 degrees North, 3.63 degrees East. Hadley-Apennine. Undocking Falcon. Scott and Irwin will drive farther from the LM than anyone before.",
    descent: "Falcon's descent engine firing. The Apennine Front looms ahead, a wall of mountains. Scott guides Falcon between the peaks and the rille.",
    touchdown: "Contact light. Falcon has landed at Hadley. July 30, 1971. Scott: Okay, Houston. The Falcon is on the plain at Hadley.",
    stepOut: "Cabin depressurised. Opening the hatch. The mountains surround you, " + n + ". Time to unpack the rover and explore.",
  }),
  "apollo-16": (n) => ({
    flight: "Welcome aboard, " + n + ". Apollo 16 targets the Descartes Highlands, a region scientists believe is volcanic. Young and Duke will test that theory on the ground.",
    coast: "Mattingly stays in orbit aboard Casper. You ride Orion down with Young and Duke. But in orbit, a problem: Casper's engine gimbal shakes. Mission Control debates an abort for six anxious hours.",
    orbit: "Lunar Orbit Insertion complete. The Descartes Highlands roll out below, ancient and cratered. Houston gives the go. The landing is on.",
    targetLocked: "Target locked: 8.97 degrees South, 15.50 degrees East. Descartes Highlands. Undocking Orion after the longest hold in Apollo history.",
    descent: "Orion's descent engine firing. The highlands approach. Young and Duke are finally going down, six hours late but on target.",
    touchdown: "Contact light. Orion has landed at Descartes. April 21, 1972. Young: Orion is finally here, Houston. Fantastic.",
    stepOut: "Cabin depressurised. Opening the hatch. Welcome to the Descartes Highlands, " + n + ". Young will set the lunar high-jump record here.",
  }),
  "apollo-17": (n) => ({
    flight: "Welcome aboard, " + n + ". Apollo 17. The last mission. The final crew to leave Earth for the Moon. This is history's closing chapter on the lunar surface.",
    coast: "Evans stays in orbit aboard America. You ride Challenger down with Cernan and Schmitt. Schmitt is a geologist, the only scientist to walk on another world.",
    orbit: "Lunar Orbit Insertion complete. Taurus-Littrow valley is a dark slash between towering massifs. It was chosen for its geological diversity: old highlands and young volcanic fill.",
    targetLocked: "Target locked: 20.19 degrees North, 30.77 degrees East. Taurus-Littrow. Undocking Challenger for the final crewed lunar descent in the 20th century.",
    descent: "Challenger's descent engine firing. The massifs rise on either side. Cernan guides the last crewed lander down between them.",
    touchdown: "Contact light. Challenger has landed at Taurus-Littrow. December 11, 1972. Cernan: Houston, the Challenger has landed.",
    stepOut: "Cabin depressurised. Opening the hatch. The last footprints, " + n + ". Make them count. Schmitt's geologist eyes are already scanning the regolith.",
  }),
};

function getNarration(phase: GamePhase, playerName: string, mission: MissionSpec | null): string {
  if (!mission) return "";
  const n = playerName || "Commander";
  const set = MISSION_NARRATION[mission.id];
  if (set) {
    const text = set(n)[phase];
    if (text) return text;
  }
  return "";
}

function getTouchdownLabel(mission: MissionSpec | null): string {
  const lm = mission?.lm || "LM";
  return lm + " Has Landed";
}

const PHASE_LABELS: Record<string, string> = {
  flight: "Trans-Lunar Injection",
  coast: "Translunar Coast",
  orbit: "Lunar Orbit Insertion",
  targetLocked: "Target Locked",
  descent: "Powered Descent",
  stepOut: "Opening Hatch",
};

/* ---- 3D ---- */

function EarthSphere() {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useLoader(THREE.TextureLoader, "/textures/earth.jpg");
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.05;
  });
  return (
    <mesh ref={ref} position={EARTH.toArray()}>
      <sphereGeometry args={[5, 64, 64]} />
      <meshStandardMaterial map={tex} />
    </mesh>
  );
}

function MoonSphere() {
  const ref = useRef<THREE.Mesh>(null);
  const phaseRef = useRef(useGameStore.getState().phase);
  const elRef = useRef(0);
  const color = useLoader(
    THREE.TextureLoader,
    "/textures/moon-color-4k.webp",
  );
  const disp = useLoader(
    THREE.TextureLoader,
    "/textures/moon-elevation-2k.png",
  );

  useEffect(
    () => useGameStore.subscribe((s) => {
      if (s.phase !== phaseRef.current) { phaseRef.current = s.phase; elRef.current = 0; }
    }),
    [],
  );

  useFrame((_, dt) => {
    elRef.current += dt;
    if (ref.current) {
      ref.current.rotation.y += dt * 0.015;
      const p = phaseRef.current;
      const dur = DUR[p] || 5;
      const prog = Math.min(elRef.current / dur, 1);
      const inLand = (p === "descent" && prog >= LAND_CUT_AT)
        || p === "touchdown" || p === "stepOut";
      ref.current.visible = !inLand;
    }
  });
  return (
    <mesh ref={ref} position={MOON.toArray()}>
      <sphereGeometry args={[MOON_R, 128, 128]} />
      <meshStandardMaterial
        map={color}
        displacementMap={disp}
        displacementScale={0.2}
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  );
}

function LandingMarker() {
  const ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const phaseRef = useRef(useGameStore.getState().phase);

  useEffect(
    () => useGameStore.subscribe((s) => (phaseRef.current = s.phase)),
    [],
  );

  useFrame((_, _dt, frame) => {
    const show =
      phaseRef.current === "orbit" ||
      phaseRef.current === "targetLocked" ||
      phaseRef.current === "descent";
    if (groupRef.current) groupRef.current.visible = show;
    if (ref.current && show) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.5 + Math.sin(Date.now() * 0.005) * 0.35;
    }
  });
  return (
    <group ref={groupRef}>
      <mesh
        ref={ref}
        position={[28, 0.5, -20]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.5, 0.8, 32]} />
        <meshBasicMaterial
          color="#ffd36e"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function OrbitPath() {
  const groupRef = useRef<THREE.Group>(null);
  const phaseRef = useRef(useGameStore.getState().phase);

  useEffect(
    () => useGameStore.subscribe((s) => (phaseRef.current = s.phase)),
    [],
  );

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.visible =
        phaseRef.current === "orbit" || phaseRef.current === "targetLocked";
    }
  });

  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const _p = new THREE.Vector3();
    for (let i = 0; i <= 96; i++) {
      orbitPos((i / 96) * Math.PI * 2, _p);
      pts.push(_p.clone());
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  return (
    <group ref={groupRef}>
      <line geometry={geo}>
        <lineBasicMaterial color="#6ee7ff" transparent opacity={0.3} />
      </line>
    </group>
  );
}

const _shipCopy = new THREE.Vector3();
const _aheadCopy = new THREE.Vector3();

function FlightAnimator() {
  const { camera } = useThree();
  const shipRef = useRef<THREE.Group>(null);
  const saturnRef = useRef<THREE.Group>(null);
  const lmRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const phaseRef = useRef(useGameStore.getState().phase);
  const elapsed = useRef(0);
  const lookRef = useRef(new THREE.Vector3(0, 0, -10));
  const landingCut = useRef(false);

  const { scene: saturnScene } = useGLTF("/models/saturn-v.glb");
  const { scene: lmScene } = useGLTF("/models/lunar-module.glb");
  const saturnClone = useMemo(() => saturnScene.clone(true), [saturnScene]);
  const lmClone = useMemo(() => lmScene.clone(true), [lmScene]);

  useEffect(
    () =>
      useGameStore.subscribe((s) => {
        if (s.phase !== phaseRef.current) {
          phaseRef.current = s.phase;
          elapsed.current = 0;
        }
      }),
    [],
  );

  useFrame((_, dt) => {
    const phase = phaseRef.current;
    elapsed.current += dt;
    const dur = DUR[phase] || 5;
    const progress = Math.min(elapsed.current / dur, 1);

    _shipCopy.copy(shipPos(phase, progress));

    const inLandingScene = (phase === "descent" && progress >= LAND_CUT_AT)
      || phase === "touchdown" || phase === "stepOut";

    if (shipRef.current) {
      shipRef.current.position.copy(_shipCopy);
      if (inLandingScene) {
        shipRef.current.rotation.set(0, 0, 0);
      } else {
        _aheadCopy.copy(shipPos(phase, Math.min(progress + 0.03, 1)));
        const dx = _aheadCopy.x - _shipCopy.x;
        const dy = _aheadCopy.y - _shipCopy.y;
        const dz = _aheadCopy.z - _shipCopy.z;
        if (dx * dx + dy * dy + dz * dz > 0.000001)
          shipRef.current.lookAt(_aheadCopy);
      }
    }

    const ct = camTarget(phase, _shipCopy, progress);
    if (inLandingScene && !landingCut.current) {
      camera.position.copy(ct.pos);
      lookRef.current.copy(ct.look);
      landingCut.current = true;
    } else {
      const lerpSpeed = inLandingScene ? dt * 2 : dt * 1.5;
      camera.position.lerp(ct.pos, lerpSpeed);
      lookRef.current.lerp(ct.look, dt * 2);
    }
    camera.lookAt(lookRef.current);

    if (phase === "flight" || phase === "coast") landingCut.current = false;

    const useLM = phase === "orbit" || phase === "targetLocked" || phase === "descent"
      || phase === "touchdown" || phase === "stepOut";
    if (saturnRef.current) saturnRef.current.visible = !useLM;
    if (lmRef.current) {
      lmRef.current.visible = useLM;
      if (inLandingScene) {
        lmRef.current.rotation.set(0, 0, 0);
        lmRef.current.scale.setScalar(0.35);
      } else {
        lmRef.current.rotation.set(Math.PI / 2, 0, 0);
        lmRef.current.scale.setScalar(0.2);
      }
    }

    const powered = phase === "flight" || phase === "targetLocked"
      || (phase === "descent" && !(inLandingScene && progress > 0.85));
    if (flameRef.current) {
      flameRef.current.visible = powered;
      if (powered) {
        flameRef.current.scale.z = 0.8 + Math.sin(elapsed.current * 12) * 0.2;
      }
      if (inLandingScene) {
        flameRef.current.rotation.set(Math.PI, 0, 0);
        flameRef.current.position.set(0, -1, 0);
      } else {
        flameRef.current.rotation.set(-Math.PI / 2, 0, 0);
        flameRef.current.position.set(0, 0, 1.5);
      }
    }
  });

  return (
    <group ref={shipRef}>
      <group ref={saturnRef} scale={0.5} rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={saturnClone} />
      </group>
      <group ref={lmRef} scale={0.2} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <primitive object={lmClone} />
      </group>
      <mesh
        ref={flameRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 1.5]}
      >
        <coneGeometry args={[0.2, 2, 12]} />
        <meshBasicMaterial
          color="#ffb36b"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/saturn-v.glb");
useGLTF.preload("/models/lunar-module.glb");

function LandingGround() {
  const tex = useLoader(THREE.TextureLoader, "/textures/moon-color-4k.webp");
  const clonedTex = useMemo(() => {
    const t = tex.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 3);
    return t;
  }, [tex]);

  const groupRef = useRef<THREE.Group>(null);
  const phaseRef = useRef(useGameStore.getState().phase);
  const elapsedRef = useRef(0);

  useEffect(
    () => useGameStore.subscribe((s) => {
      if (s.phase !== phaseRef.current) {
        phaseRef.current = s.phase;
        elapsedRef.current = 0;
      }
    }),
    [],
  );

  useFrame((_, dt) => {
    elapsedRef.current += dt;
    const phase = phaseRef.current;
    const dur = DUR[phase] || 5;
    const progress = Math.min(elapsedRef.current / dur, 1);
    const show = (phase === "descent" && progress >= LAND_CUT_AT)
      || phase === "touchdown" || phase === "stepOut";
    if (groupRef.current) groupRef.current.visible = show;
  });

  return (
    <group ref={groupRef} position={LAND_SCENE.toArray()} visible={false}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60, 1, 1]} />
        <meshStandardMaterial
          map={clonedTex}
          roughness={0.95}
          metalness={0}
          color="#8a8a8a"
        />
      </mesh>
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 15, 5]} intensity={2.5} color="#fff5e0" />
    </group>
  );
}

function FlightContent() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[30, 20, -40]} intensity={1.8} />
      <Stars
        radius={300}
        depth={60}
        count={6000}
        factor={4}
        fade
        speed={0}
      />
      <Suspense fallback={null}>
        <EarthSphere />
      </Suspense>
      <Suspense fallback={null}>
        <MoonSphere />
      </Suspense>
      <LandingMarker />
      <OrbitPath />
      <Suspense fallback={null}>
        <LandingGround />
      </Suspense>
      <FlightAnimator />
    </>
  );
}

/* ---- HUD ---- */

function FlightHUD() {
  const { t } = useTranslation();
  const phase = useGameStore((s) => s.phase);
  const missionId = useGameStore((s) => s.missionId);
  const playerName = useAppStore((s) => s.player.name);
  const mission = useMemo(() => getMissionOrNull(missionId), [missionId]);
  const label = phase === "touchdown"
    ? getTouchdownLabel(mission)
    : (PHASE_LABELS[phase] || t(`flight.phaseLabels.${phase}`, { defaultValue: "" }));
  const narration = getNarration(phase, playerName, mission);

  const phases = [
    "flight",
    "coast",
    "orbit",
    "targetLocked",
    "descent",
    "touchdown",
    "stepOut",
  ];
  const idx = phases.indexOf(phase);
  const pct = Math.max(0, (idx / (phases.length - 1)) * 100);

  const [alt, setAlt] = useState(15000);
  useEffect(() => {
    if (phase !== "descent") {
      setAlt(15000);
      return;
    }
    const t0 = Date.now();
    const interval = setInterval(() => {
      const prog = Math.min((Date.now() - t0) / 8000, 1);
      setAlt(Math.max(0, Math.round(15000 * (1 - prog))));
    }, 80);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      {/* Top bar */}
      <div className="flex items-start justify-between px-4 pt-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-regolith-400">
            {mission?.name?.toUpperCase() || "APOLLO"}
          </p>
          <p className="font-display text-lg font-semibold text-signal">
            {label}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-regolith-400">
            {t("flight.commander", { name: playerName })}
          </p>
          {phase === "descent" && (
            <p className="font-mono text-lg font-bold text-signal">
              {t("flight.alt", { alt: alt.toLocaleString() })}
            </p>
          )}
          {phase === "touchdown" && (
            <p className="font-mono text-lg font-bold text-signal">
              {t("flight.altContact")}
            </p>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mx-4 mt-3">
        <div className="h-1 rounded-full bg-space-800">
          <div
            className="h-1 rounded-full bg-signal transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between px-1">
          {phases.map((p, i) => (
            <div
              key={p}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${i <= idx ? "bg-signal" : "bg-space-700"}`}
            />
          ))}
        </div>
      </div>

      {/* Narration subtitle */}
      <div className="mt-auto px-4 pb-6">
        <div className="mx-auto max-w-2xl rounded-lg bg-space-950/85 px-6 py-4 backdrop-blur">
          <div className="flex items-baseline gap-3">
            <span className="shrink-0 text-xs font-bold tracking-widest text-signal">
              {label.toUpperCase() || "FLIGHT"}
            </span>
            <p className="text-base leading-relaxed text-regolith-200">
              {narration}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Main ---- */

const GATES: Partial<Record<GamePhase, { event: "BEGIN_DESCENT" | "OPEN_HATCH"; labelKey: string }>> = {
  targetLocked: { event: "BEGIN_DESCENT", labelKey: "flight.beginDescent" },
  touchdown: { event: "OPEN_HATCH", labelKey: "flight.openHatch" },
};

export function FlightScene() {
  const { t } = useTranslation();
  const phase = useGameStore((s) => s.phase);
  const send = useGameStore((s) => s.send);

  useEffect(() => {
    const beat = BEAT_EVENTS.find((b) => b.from === phase);
    if (!beat) return;
    const timer = setTimeout(() => send(beat.event), beat.delay);
    return () => clearTimeout(timer);
  }, [phase, send]);

  useEffect(() => {
    const gate = GATES[phase];
    if (!gate) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        send(gate.event);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, send]);

  const gate = GATES[phase];

  const showStepOutFade = phase === "stepOut";

  return (
    <div className="relative h-screen w-full">
      <Canvas
        camera={{ position: [-15, 3, -8], fov: 55, near: 0.1, far: 2000 }}
        gl={{ antialias: false }}
      >
        <color attach="background" args={["#020408"]} />
        <FlightContent />
        <Effects bloom bloomThreshold={0.8} bloomIntensity={0.7} />
      </Canvas>
      <FlightHUD />
      {gate && (
        <div className="absolute inset-x-0 bottom-24 z-20 flex justify-center">
          <button
            onClick={() => send(gate.event)}
            className="animate-pulse rounded-lg border border-signal/60 bg-signal/20 px-8 py-3 font-display text-lg font-semibold text-signal backdrop-blur transition hover:bg-signal/30"
          >
            [Space] {t(gate.labelKey)}
          </button>
        </div>
      )}
      {showStepOutFade && (
        <div className="absolute inset-0 z-30 animate-[fadeIn_2.5s_ease-in_forwards] bg-black opacity-0" />
      )}
    </div>
  );
}
