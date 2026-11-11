import { useRef, useEffect, useMemo, useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Stars, useGLTF } from "@react-three/drei";
import { Effects } from "./Effects";
import { EarthAtmosphere } from "./EarthAtmosphere";
import { useGameStore, type GamePhase } from "@/store/useGameStore";
import { useAppStore } from "@/store/useAppStore";
import { getMissionOrNull, type MissionSpec, type Planet } from "@/lib/missionData";
import { gameAudio } from "@/lib/gameAudio";
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
const STAGE_SEP_AT = 0.35;

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
    if (progress < STAGE_SEP_AT) {
      const pullback = 5 + progress * 4;
      _camPos.set(sp.x + 3, sp.y + 1.5, sp.z + pullback);
      _camLook.copy(sp);
    } else if (progress < STAGE_SEP_AT + 0.2) {
      const sepT = (progress - STAGE_SEP_AT) / 0.2;
      _camPos.set(sp.x + 4 + sepT * 4, sp.y + 2 + sepT * 2, sp.z + 8 + sepT * 3);
      _camLook.copy(sp);
    } else {
      const pullback = 6 + (progress - 0.55) * 8;
      _camPos.set(sp.x + 3, sp.y + 2 + progress * 3, sp.z + pullback);
      _camLook.copy(sp);
    }
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
  { from: "flight" as GamePhase, event: "START_COAST" as const, delay: 16000 },
  { from: "coast" as GamePhase, event: "REACH_ORBIT" as const, delay: 14000 },
  { from: "orbit" as GamePhase, event: "LOCK_TARGET" as const, delay: 12000 },
  // targetLocked: GATE — player presses Space to BEGIN_DESCENT
  { from: "descent" as GamePhase, event: "TOUCH_DOWN" as const, delay: 14000 },
  // touchdown: GATE — player presses Space to OPEN_HATCH
  { from: "stepOut" as GamePhase, event: "STEP_OUT" as const, delay: 10000 },
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
  "mars-viking1": (n) => ({
    flight: "Welcome to the mission, " + n + ". Viking 1 launched on 20 August 1975, bound for Mars. After ten months of interplanetary cruise, it will be the first spacecraft to successfully land on the Red Planet.",
    coast: "The spacecraft coasts through interplanetary space. Mars is 225 million kilometres away. The orbiter will map the surface to find a safe landing site before the lander separates.",
    orbit: "Mars Orbit Insertion complete. Chryse Planitia is visible below — a vast, smooth plain where ancient floodwaters once carved channels. The original landing site was too rough. A new one was chosen.",
    targetLocked: "Target locked: Chryse Planitia. 22.48 degrees North, 49.97 degrees West. The lander separates from the orbiter. No turning back.",
    descent: "The lander enters the Martian atmosphere at 4.5 kilometres per second. Aeroshell, parachute, retrorockets. Seven minutes of terror — in 1976, with a 20-minute signal delay.",
    touchdown: "Touchdown confirmed. Viking 1 has landed on Mars. July 20, 1976. The first successful Mars landing. The cameras begin to scan. A rocky, rust-coloured desert fills the frame.",
    stepOut: "Deploying instruments, " + n + ". The soil sampler extends. The meteorology boom unfolds. The biology experiments begin their search for life on Mars.",
  }),
  "mars-pathfinder": (n) => ({
    flight: "Welcome to the mission, " + n + ". Mars Pathfinder launched on 4 December 1996 — a low-cost mission to prove that faster, cheaper exploration works. It carries the first Mars rover: tiny Sojourner.",
    coast: "Pathfinder cruises toward Mars on a direct trajectory, no orbit insertion needed. It will enter the atmosphere and land in a single pass. The airbag landing system has never been tried on another planet.",
    orbit: "Approaching Mars. No orbit for this mission — Pathfinder is heading straight in. Ares Vallis, an ancient flood plain, is the target. The rocks washed here billions of years ago will tell the story of Mars's wet past.",
    targetLocked: "Target locked: Ares Vallis. 19.33 degrees North, 33.55 degrees West. Entry interface in minutes. The heat shield will face temperatures over 1,600 degrees Celsius.",
    descent: "Entry. Parachute deployed. Heat shield jettisoned. Airbags inflate — 24 spheres surrounding the lander. Retrorockets fire. Cut. Free fall. Impact. Bouncing. Bouncing across Mars.",
    touchdown: "Pathfinder has landed. July 4, 1997. After bouncing 15 times and rolling for over a minute, it comes to rest. The petals open. Welcome to the Carl Sagan Memorial Station.",
    stepOut: "Deploying Sojourner, " + n + ". The ramp extends. The first rover to operate on another planet begins to roll. Six wheels on Mars. Just 10.6 kilograms making history.",
  }),
  "mars-spirit": (n) => ({
    flight: "Welcome to the mission, " + n + ". Spirit, also known as MER-A, launched on 10 June 2003. Destination: Gusev Crater, a 160-kilometre-wide basin that may once have been a lake.",
    coast: "Spirit cruises toward Mars. Designed for 90 sols — about 90 days — on the surface. The rover carries a panoramic camera, a microscopic imager, and a rock abrasion tool to grind into stones.",
    orbit: "Approaching Mars. Like Pathfinder, Spirit will land directly — no orbital phase. Gusev Crater looms ahead. A channel called Ma'adim Vallis once fed water into this basin.",
    targetLocked: "Target locked: Gusev Crater. 14.57 degrees South, 175.47 degrees East. Entry in minutes. The airbags are ready. The parachute is armed.",
    descent: "Entry, descent, and landing. Parachute deployed. Retrorockets fire. Airbags inflate. Spirit bounces across the crater floor, tumbling to a stop. The petals begin to open.",
    touchdown: "Spirit has landed in Gusev Crater. January 4, 2004. Named the Columbia Memorial Station in honour of the seven astronauts lost on Space Shuttle Columbia.",
    stepOut: "Deploying Spirit, " + n + ". The rover rolls off the lander platform onto Martian soil. Panoramic cameras spin. The Columbia Hills are visible in the distance — Spirit will reach them.",
  }),
  "mars-opportunity": (n) => ({
    flight: "Welcome to the mission, " + n + ". Opportunity, MER-B, launched on 7 July 2003 — three weeks after its twin Spirit. Target: Meridiani Planum, where an orbiter detected grey haematite, a mineral that often forms in water.",
    coast: "Opportunity cruises toward Mars, trailing Spirit by 21 days. The rovers are identical, but their landing sites are a world apart. Meridiani Planum is flat and smooth — the haematite signal is strong.",
    orbit: "Approaching Mars. Meridiani Planum is on the far side from Gusev. Opportunity will enter and land in a single pass, just as Spirit did three weeks ago.",
    targetLocked: "Target locked: Meridiani Planum. 1.95 degrees South, 354.47 degrees East. If the haematite is there, it will be proof of ancient water. Entry sequence initiated.",
    descent: "Entry, descent, and landing. Parachute. Retrorockets. Airbags. Opportunity bounces into a small crater just 22 metres wide. Scientists call it a hole in one.",
    touchdown: "Opportunity has landed at Meridiani Planum. January 25, 2004. Inside Eagle Crater, bedrock is exposed right at the rover's wheels. This is better than anyone hoped.",
    stepOut: "Deploying Opportunity, " + n + ". The first image shows layered bedrock and tiny grey spheres — blueberries. Evidence of water, in the first frame. This rover will run for almost 15 years.",
  }),
  "mars-curiosity": (n) => ({
    flight: "Welcome to the mission, " + n + ". Curiosity, the Mars Science Laboratory, launched on 26 November 2011. At 899 kilograms, it is the size of a car — too heavy for airbags. A sky crane will lower it to the surface.",
    coast: "Curiosity cruises toward Mars carrying ten instruments and a nuclear power source. No solar panels — this rover will work through dust storms and winter darkness. Gale Crater awaits, with a 5-kilometre mountain of layered rock.",
    orbit: "Approaching Mars. Gale Crater sits near the equator, 154 kilometres wide. At its centre rises Mount Sharp — Aeolis Mons — a layered mountain taller than Mount Rainier. Each layer is a chapter of Mars history.",
    targetLocked: "Target locked: Gale Crater. 4.59 degrees South, 137.44 degrees East. Entry in seven minutes. The sky crane sequence has never been tried before. There is no margin for error.",
    descent: "Entry. Heat shield at 1,600 degrees. Parachute. Backshell separation. Sky crane rockets ignite. Nylon tethers lower Curiosity. Twenty metres. Ten. Five. Wheels down.",
    touchdown: "Curiosity has landed in Gale Crater. August 6, 2012. Bradbury Landing. The sky crane flies away and crashes. JPL erupts. The most complex landing in history succeeded.",
    stepOut: "Systems online, " + n + ". Curiosity's mast camera rises. Mount Sharp fills the frame. ChemCam fires its first laser pulse. The greatest Mars laboratory ever built is open for business.",
  }),
  "mars-perseverance": (n) => ({
    flight: "Welcome to the mission, " + n + ". Perseverance launched on 30 July 2020, bound for Jezero Crater — an ancient lakebed with a river delta. The mission: find signs of ancient life and cache samples for return to Earth.",
    coast: "Perseverance cruises toward Mars carrying Ingenuity, a 1.8-kilogram helicopter, strapped to its belly. If it flies, it will be the first powered flight on another planet. Also aboard: MOXIE, which will try to make oxygen from CO₂.",
    orbit: "Approaching Jezero Crater. An ancient river once flowed through a gap in the crater wall, spreading sediment into a fan-shaped delta. If microbial life ever existed on Mars, this delta is where to look.",
    targetLocked: "Target locked: Jezero Crater. 18.44 degrees North, 77.45 degrees East. The terrain-relative navigation system will steer around hazards in real time. Entry in seven minutes.",
    descent: "Entry, descent, landing. Heat shield. Supersonic parachute. Radar. Sky crane. The range trigger deploys the chute at exactly the right moment. Terrain navigation steers past boulders. Touchdown.",
    touchdown: "Perseverance has landed at Jezero Crater. February 18, 2021. Octavia E. Butler Landing. Cameras recorded the entire descent — the first video of a Mars landing.",
    stepOut: "Systems online, " + n + ". Perseverance rolls off the landing pad. Ingenuity is still folded underneath. Sample tubes are ready. The search for ancient life on Mars begins now.",
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
  if (mission?.planet === "mars") {
    return mission.name + " Has Landed";
  }
  const lm = mission?.lm || "LM";
  return lm + " Has Landed";
}

const MOON_PHASE_LABELS: Record<string, string> = {
  flight: "Trans-Lunar Injection",
  coast: "Translunar Coast",
  orbit: "Lunar Orbit Insertion",
  targetLocked: "Target Locked",
  descent: "Powered Descent",
  stepOut: "Opening Hatch",
};

const MARS_PHASE_LABELS: Record<string, string> = {
  flight: "Trans-Mars Injection",
  coast: "Interplanetary Cruise",
  orbit: "Mars Orbit Insertion",
  targetLocked: "Target Locked",
  descent: "Entry, Descent & Landing",
  stepOut: "Deploying Instruments",
};

function getPhaseLabel(phase: string, planet: Planet): string {
  const labels = planet === "mars" ? MARS_PHASE_LABELS : MOON_PHASE_LABELS;
  return labels[phase] ?? "";
}

/* ---- 3D ---- */

function EarthSphere() {
  return <EarthAtmosphere radius={5} position={EARTH} rotationSpeed={0.05} />;
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

function MarsSphere() {
  const ref = useRef<THREE.Mesh>(null);
  const phaseRef = useRef(useGameStore.getState().phase);
  const elRef = useRef(0);

  useEffect(
    () => useGameStore.subscribe((s) => {
      if (s.phase !== phaseRef.current) { phaseRef.current = s.phase; elRef.current = 0; }
    }),
    [],
  );

  useFrame((_, dt) => {
    elRef.current += dt;
    if (ref.current) {
      ref.current.rotation.y += dt * 0.012;
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
        color="#c1440e"
        roughness={0.85}
        metalness={0.1}
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

  useFrame(() => {
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

  const lineObj = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: "#6ee7ff", transparent: true, opacity: 0.3 });
    return new THREE.Line(geo, mat);
  }, [geo]);

  return (
    <group ref={groupRef}>
      <primitive object={lineObj} />
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
  const boosterRef = useRef<THREE.Group>(null);
  const phaseRef = useRef(useGameStore.getState().phase);
  const elapsed = useRef(0);
  const lookRef = useRef(new THREE.Vector3(0, 0, -10));
  const landingCut = useRef(false);
  const separated = useRef(false);
  const sepPos = useRef(new THREE.Vector3());
  const sepDir = useRef(new THREE.Vector3());
  const sepTime = useRef(0);

  const { scene: saturnScene } = useGLTF("/models/saturn-v.glb");
  const { scene: lmScene } = useGLTF("/models/lunar-module.glb");
  const saturnClone = useMemo(() => saturnScene.clone(true), [saturnScene]);
  const lmClone = useMemo(() => lmScene.clone(true), [lmScene]);
  const boosterClone = useMemo(() => saturnScene.clone(true), [saturnScene]);

  useEffect(
    () =>
      useGameStore.subscribe((s) => {
        if (s.phase !== phaseRef.current) {
          phaseRef.current = s.phase;
          elapsed.current = 0;
          if (s.phase === "flight") {
            separated.current = false;
            sepTime.current = 0;
          }
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

    if (phase === "coast" && progress >= STAGE_SEP_AT && !separated.current) {
      separated.current = true;
      sepTime.current = 0;
      sepPos.current.copy(_shipCopy);
      _aheadCopy.copy(shipPos(phase, Math.min(progress + 0.05, 1)));
      sepDir.current.subVectors(_shipCopy, _aheadCopy).normalize();
      gameAudio.playStaging();
    }

    if (separated.current) {
      sepTime.current += dt;
    }

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

    if (boosterRef.current) {
      if (separated.current && phase !== "flight") {
        boosterRef.current.visible = true;
        const t = sepTime.current;
        const drift = t * 1.2;
        boosterRef.current.position.set(
          sepPos.current.x + sepDir.current.x * drift,
          sepPos.current.y + sepDir.current.y * drift - t * 0.1,
          sepPos.current.z + sepDir.current.z * drift,
        );
        boosterRef.current.rotation.x = Math.PI / 2 + t * 0.15;
        boosterRef.current.rotation.z = t * 0.08;
        const fade = Math.max(0.15, 1 - t * 0.12);
        boosterRef.current.scale.setScalar(0.5 * fade);
      } else {
        boosterRef.current.visible = false;
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

    const useLM = separated.current || phase === "orbit" || phase === "targetLocked"
      || phase === "descent" || phase === "touchdown" || phase === "stepOut";
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
    <>
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
      <group ref={boosterRef} visible={false}>
        <group scale={0.5} rotation={[Math.PI / 2, 0, 0]}>
          <primitive object={boosterClone} />
        </group>
      </group>
    </>
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

function MarsLandingGround() {
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
          color="#a0522d"
          roughness={0.92}
          metalness={0}
        />
      </mesh>
      <ambientLight intensity={0.15} color="#e8c4a0" />
      <directionalLight position={[10, 15, 5]} intensity={2.0} color="#ffe0b0" />
    </group>
  );
}

function FlightContent() {
  const missionId = useGameStore((s) => s.missionId);
  const mission = useMemo(() => getMissionOrNull(missionId), [missionId]);
  const isMars = mission?.planet === "mars";

  return (
    <>
      <ambientLight intensity={0.12} />
      <hemisphereLight args={[isMars ? "#aa7755" : "#8899aa", "#22252a", 0.15]} />
      <directionalLight position={[30, 20, -40]} intensity={2.2} color="#fff8e1" />
      {/* Distant Sun Disc */}
      <group position={[150, 100, -200]}>
        <mesh>
          <sphereGeometry args={[8, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh scale={[1.8, 1.8, 1.8]}>
          <sphereGeometry args={[8, 32, 32]} />
          <meshBasicMaterial color="#fff4d0" transparent opacity={0.35} />
        </mesh>
      </group>
      <Stars
        radius={300}
        depth={80}
        count={8000}
        factor={5}
        saturation={0.6}
        fade
        speed={0.2}
      />
      <Suspense fallback={null}>
        <EarthSphere />
      </Suspense>
      <Suspense fallback={null}>
        {isMars ? <MarsSphere /> : <MoonSphere />}
      </Suspense>
      <LandingMarker />
      <OrbitPath />
      <Suspense fallback={null}>
        {isMars ? <MarsLandingGround /> : <LandingGround />}
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
  const planet = mission?.planet ?? "moon";
  const label = phase === "touchdown"
    ? getTouchdownLabel(mission)
    : (getPhaseLabel(phase, planet) || t(`flight.phaseLabels.${phase}`, { defaultValue: "" }));
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
        <Effects bloom vignette bloomThreshold={0.55} bloomIntensity={1.0} />
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
