import { useRef, useEffect, useMemo, useState, useCallback, Suspense, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Stars, useGLTF, Preload } from "@react-three/drei";
import { damp, damp3, dampQ, cubic, sine } from "maath/easing";
import { Effects } from "./Effects";
import { EarthAtmosphere } from "./EarthAtmosphere";
import { useGameStore, type GamePhase } from "@/store/useGameStore";
import { useAppStore } from "@/store/useAppStore";
import { getMissionOrNull, type MissionSpec, type Planet } from "@/lib/missionData";
import { gameAudio } from "@/lib/gameAudio";
import { onNarrationComplete } from "@/lib/narration";
import { isTouchDevice } from "@/lib/useMobile";
import { useFullscreen } from "@/lib/fullscreen";
import { getSolarPanelTexture, getCharredHeatShieldTexture } from "./heritage3D/textures";
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
const WP_COAST_B = new THREE.Vector3(9, 1.0, -20);
const WP_ORBIT_END = new THREE.Vector3();
const WP_TARGET_B = new THREE.Vector3(28, 3, -20);
const WP_LAND = new THREE.Vector3(28, 0.2, -20);

const LAND_SCENE = new THREE.Vector3(100, 0, 0);
const LAND_DROP_START = 12;
const LAND_CUT_AT = 0.3;
const STAGE_SEP_AT = 0.35;
const CRUISE_SEP_AT = 0.05;

function orbitPos(angle: number, out: THREE.Vector3): THREE.Vector3 {
  return out.set(
    MOON.x + ORBIT_R * Math.cos(angle),
    1,
    MOON.z + ORBIT_R * Math.sin(angle),
  );
}

const _shipOut = new THREE.Vector3();
function shipPos(phase: string, p: number): THREE.Vector3 {
  const t = sine.inOut(Math.max(0, Math.min(1, p)));
  const v = _shipOut;
  switch (phase) {
    case "flight":
      v.lerpVectors(WP_FLIGHT_A, WP_FLIGHT_B, cubic.out(Math.max(0, Math.min(1, p))));
      break;
    case "coast":
      v.lerpVectors(WP_FLIGHT_B, WP_COAST_B, t);
      break;
    case "orbit":
      orbitPos(ORBIT_A0 + (ORBIT_A1 - ORBIT_A0) * t, v);
      break;
    case "targetLocked":
      orbitPos(ORBIT_A1, WP_ORBIT_END);
      v.lerpVectors(WP_ORBIT_END, WP_TARGET_B, ease(p));
      break;
    case "descent":
      if (p < LAND_CUT_AT) {
        const preP = p / LAND_CUT_AT;
        v.lerpVectors(WP_TARGET_B, WP_LAND, ease(preP));
      } else {
        const lp = (p - LAND_CUT_AT) / (1 - LAND_CUT_AT);
        const height = LAND_DROP_START * (1 - cubic.out(Math.max(0, Math.min(1, lp))));
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
      const pullback = 5 + (progress / STAGE_SEP_AT) * 2;
      _camPos.set(sp.x + 2.5, sp.y + 1.4, sp.z + pullback);
      _camLook.copy(sp);
    } else if (progress < STAGE_SEP_AT + 0.25) {
      const sepT = sine.inOut((progress - STAGE_SEP_AT) / 0.25);
      _camPos.set(sp.x + 2.5 + sepT * 4.5, sp.y + 1.4 + sepT * 2.0, sp.z + 7 + sepT * 3.5);
      _camLook.copy(sp);
    } else {
      const tailT = ease((progress - (STAGE_SEP_AT + 0.25)) / (1 - (STAGE_SEP_AT + 0.25)));
      _camPos.set(sp.x + 7 - tailT * 2, sp.y + 3.4 - tailT * 1.2, sp.z + 10.5 - tailT * 2.5);
      _camLook.copy(sp);
    }
  } else if (phase === "targetLocked") {
    _camPos.set(sp.x + 3.0, sp.y + 1.2, sp.z + 5.2);
    _camLook.copy(sp);
  } else if (phase === "descent") {
    if (progress < LAND_CUT_AT) {
      const preP = progress / LAND_CUT_AT;
      _camPos.set(sp.x + 3.0 - preP * 1.2, sp.y + 1.2 + preP * 0.8, sp.z + 5.2 - preP * 1.4);
      _camLook.copy(sp);
    } else {
      const postP = ease((progress - LAND_CUT_AT) / (1 - LAND_CUT_AT));
      _camPos.set(
        LAND_SCENE.x + 6.5 - postP * 1.5,
        LAND_SCENE.y + 2.6 - postP * 1.1,
        LAND_SCENE.z + 6.5 - postP * 1.5,
      );
      _camLook.set(LAND_SCENE.x, Math.max(LAND_SCENE.y + 0.5, sp.y * 0.85 + 0.1), LAND_SCENE.z);
    }
  } else if (phase === "touchdown") {
    _camPos.set(LAND_SCENE.x + 5, LAND_SCENE.y + 1.5, LAND_SCENE.z + 5);
    _camLook.set(LAND_SCENE.x, LAND_SCENE.y + 0.5, LAND_SCENE.z);
  } else if (phase === "stepOut") {
    _camPos.set(LAND_SCENE.x + 3.4, LAND_SCENE.y + 1.1, LAND_SCENE.z + 3.4);
    _camLook.set(LAND_SCENE.x, LAND_SCENE.y + 0.5, LAND_SCENE.z);
  } else {
    _camPos.set(sp.x + 3, sp.y + 2, sp.z + 5);
    _camLook.copy(sp);
  }
  return { pos: _camPos, look: _camLook };
}

const DUR: Record<string, number> = {
  flight: 16,
  coast: 14,
  orbit: 12,
  targetLocked: 4,
  descent: 14,
  touchdown: 12,
  stepOut: 10,
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
  const color = useLoader(THREE.TextureLoader, "/textures/mars-color-2k.jpg");
  const disp = useLoader(THREE.TextureLoader, "/textures/moon-elevation-2k.png");

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
        map={color}
        displacementMap={disp}
        displacementScale={0.15}
        roughness={0.9}
        metalness={0}
      />
    </mesh>
  );
}

function LandingMarker({ isMars }: { isMars: boolean }) {
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
          color={isMars ? "#ff6633" : "#ffd36e"}
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

function OrbitPath({ isMars }: { isMars: boolean }) {
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
    const mat = new THREE.LineDashedMaterial({
      color: isMars ? "#ffaa77" : "#88e0ff",
      transparent: true,
      opacity: 0.22,
      dashSize: 0.5,
      gapSize: 0.25,
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    return line;
  }, [geo, isMars]);

  return (
    <group ref={groupRef}>
      <primitive object={lineObj} />
    </group>
  );
}

export function MarsCruiseStageContent() {
  const solarTex = useMemo(() => getSolarPanelTexture(), []);

  return (
    <group>
      {/* ── Main Bus / Equipment Ring ── */}
      {/* Outer titanium structural ring */}
      <mesh>
        <cylinderGeometry args={[0.44, 0.44, 0.24, 32]} />
        <meshStandardMaterial color="#c2c7cc" metalness={0.78} roughness={0.24} />
      </mesh>
      {/* Top and bottom dark collar rims */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.455, 0.455, 0.025, 32]} />
        <meshStandardMaterial color="#35383e" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.455, 0.455, 0.025, 32]} />
        <meshStandardMaterial color="#35383e" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Central gold MLI thermal blanket band */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.445, 0.445, 0.14, 32]} />
        <meshStandardMaterial color="#d4a338" metalness={0.88} roughness={0.22} />
      </mesh>
      {/* Upper equipment deck with thermal louvers */}
      <mesh position={[0, 0.122, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.44, 32]} />
        <meshStandardMaterial color="#8e949c" metalness={0.65} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* ── Internal Propellant Tanks (4 gold spherical titanium tanks) ── */}
      {[45, 135, 225, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh key={deg} position={[Math.cos(rad) * 0.24, 0, Math.sin(rad) * 0.24]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#e5b440" metalness={0.92} roughness={0.18} />
          </mesh>
        );
      })}

      {/* ── Central Main Engine / Retrorocket Nozzle ── */}
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 0.14, 20]} />
        <meshStandardMaterial color="#2d3036" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Inner nozzle throat with amber glow */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.04, 0.07, 0.02, 16]} />
        <meshStandardMaterial color="#ff7722" emissive="#cc4400" emissiveIntensity={0.6} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* ── 4 RCS Thruster Outrigger Assemblies (90° intervals) ── */}
      {[0, 90, 180, 270].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return (
          <group key={deg} position={[cos * 0.45, -0.02, sin * 0.45]} rotation={[0, -rad, 0]}>
            {/* Outrigger structural bracket */}
            <mesh position={[0.04, 0, 0]}>
              <boxGeometry args={[0.08, 0.03, 0.06]} />
              <meshStandardMaterial color="#40444c" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Gold heat shield deflector plate */}
            <mesh position={[0.07, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
              <boxGeometry args={[0.01, 0.08, 0.08]} />
              <meshStandardMaterial color="#dfa535" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* 3 micro-nozzles (roll, pitch, yaw) */}
            <mesh position={[0.08, 0.035, 0]}>
              <cylinderGeometry args={[0.008, 0.015, 0.035, 8]} />
              <meshStandardMaterial color="#22252a" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0.08, -0.035, 0]} rotation={[Math.PI, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.015, 0.035, 8]} />
              <meshStandardMaterial color="#22252a" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0.095, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.015, 0.035, 8]} />
              <meshStandardMaterial color="#22252a" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        );
      })}

      {/* ── High-Gain Parabolic Antenna (HGA) on Steerable Gimbal Boom ── */}
      <group position={[0.26, 0.16, 0.22]} rotation={[-0.32, 0.45, 0.2]}>
        {/* Gimbal mounting pedestal */}
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 0.08, 12]} />
          <meshStandardMaterial color="#3a3e46" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Gold articulated hinge actuator */}
        <mesh position={[0, 0.01, 0]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshStandardMaterial color="#d89f28" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Parabolic reflector dish */}
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.18, 0.05, 0.05, 24]} />
          <meshStandardMaterial color="#f2f0eb" metalness={0.4} roughness={0.35} />
        </mesh>
        {/* Gold thermal backing on dish */}
        <mesh position={[0, 0.065, 0]}>
          <cylinderGeometry args={[0.176, 0.048, 0.01, 24]} />
          <meshStandardMaterial color="#cda032" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Central feed horn strut + subreflector */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.008, 0.014, 0.11, 8]} />
          <meshStandardMaterial color="#a0a4aa" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.21, 0]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshStandardMaterial color="#e0ded8" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* ── Twin Star Tracker Camera Baffles & Sun Sensor ── */}
      <group position={[-0.24, 0.14, 0.24]} rotation={[0.4, -0.3, 0]}>
        <mesh position={[-0.03, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.026, 0.09, 12]} />
          <meshStandardMaterial color="#1a1c20" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.03, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.026, 0.09, 12]} />
          <meshStandardMaterial color="#1a1c20" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Camera lenses (deep anti-reflective blue) */}
        <mesh position={[-0.03, 0.046, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.005, 12]} />
          <meshStandardMaterial color="#0055aa" emissive="#002255" emissiveIntensity={0.5} roughness={0.1} />
        </mesh>
        <mesh position={[0.03, 0.046, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.005, 12]} />
          <meshStandardMaterial color="#0055aa" emissive="#002255" emissiveIntensity={0.5} roughness={0.1} />
        </mesh>
      </group>

      {/* ── Magnetometer / Science Sensor Mast ── */}
      <group position={[0, 0.1, -0.42]} rotation={[-0.25, 0, 0]}>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.008, 0.012, 0.36, 8]} />
          <meshStandardMaterial color="#2e3238" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.37, 0]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#dfa230" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Solar Array Wings (Port & Starboard) with Silicon Solar Cell PBR Texture ── */}
      {/* Starboard Wing (+X) */}
      <group position={[0.45, 0, 0]}>
        {/* Root hinge & drive gimbal */}
        <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 12]} />
          <meshStandardMaterial color="#353840" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Gold structural actuator cuff */}
        <mesh position={[0.08, 0, 0]}>
          <boxGeometry args={[0.04, 0.06, 0.06]} />
          <meshStandardMaterial color="#d89f28" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Primary Inboard Solar Panel Frame */}
        <mesh position={[0.55, 0, 0]}>
          <boxGeometry args={[0.88, 0.02, 0.44]} />
          <meshStandardMaterial color="#1e222a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Silicon Photovoltaic Cells with PBR Grid (Upper Surface) */}
        <mesh position={[0.55, 0.012, 0]}>
          <boxGeometry args={[0.84, 0.004, 0.4]} />
          <meshStandardMaterial map={solarTex} metalness={0.75} roughness={0.22} />
        </mesh>
        {/* Photovoltaic Cells (Lower Surface) */}
        <mesh position={[0.55, -0.012, 0]}>
          <boxGeometry args={[0.84, 0.004, 0.4]} />
          <meshStandardMaterial map={solarTex} metalness={0.75} roughness={0.22} />
        </mesh>
        {/* Gold solar busbars / interconnect grid lines */}
        {[-0.14, 0, 0.14].map((zOffset) => (
          <mesh key={zOffset} position={[0.55, 0.015, zOffset]}>
            <boxGeometry args={[0.82, 0.002, 0.01]} />
            <meshStandardMaterial color="#e5b842" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Outboard Wing Extension Panel */}
        <mesh position={[1.18, 0, 0]}>
          <boxGeometry args={[0.36, 0.018, 0.38]} />
          <meshStandardMaterial color="#1e222a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[1.18, 0.011, 0]}>
          <boxGeometry args={[0.33, 0.004, 0.34]} />
          <meshStandardMaterial map={solarTex} metalness={0.75} roughness={0.22} />
        </mesh>
      </group>

      {/* Port Wing (-X) */}
      <group position={[-0.45, 0, 0]} rotation={[0, Math.PI, 0]}>
        {/* Root hinge & drive gimbal */}
        <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 12]} />
          <meshStandardMaterial color="#353840" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Gold structural actuator cuff */}
        <mesh position={[0.08, 0, 0]}>
          <boxGeometry args={[0.04, 0.06, 0.06]} />
          <meshStandardMaterial color="#d89f28" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Primary Inboard Solar Panel Frame */}
        <mesh position={[0.55, 0, 0]}>
          <boxGeometry args={[0.88, 0.02, 0.44]} />
          <meshStandardMaterial color="#1e222a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Silicon Photovoltaic Cells (Upper Surface) */}
        <mesh position={[0.55, 0.012, 0]}>
          <boxGeometry args={[0.84, 0.004, 0.4]} />
          <meshStandardMaterial map={solarTex} metalness={0.75} roughness={0.22} />
        </mesh>
        {/* Photovoltaic Cells (Lower Surface) */}
        <mesh position={[0.55, -0.012, 0]}>
          <boxGeometry args={[0.84, 0.004, 0.4]} />
          <meshStandardMaterial map={solarTex} metalness={0.75} roughness={0.22} />
        </mesh>
        {/* Gold solar busbars / interconnect grid lines */}
        {[-0.14, 0, 0.14].map((zOffset) => (
          <mesh key={zOffset} position={[0.55, 0.015, zOffset]}>
            <boxGeometry args={[0.82, 0.002, 0.01]} />
            <meshStandardMaterial color="#e5b842" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Outboard Wing Extension Panel */}
        <mesh position={[1.18, 0, 0]}>
          <boxGeometry args={[0.36, 0.018, 0.38]} />
          <meshStandardMaterial color="#1e222a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[1.18, 0.011, 0]}>
          <boxGeometry args={[0.33, 0.004, 0.34]} />
          <meshStandardMaterial map={solarTex} metalness={0.75} roughness={0.22} />
        </mesh>
      </group>
    </group>
  );
}

function MarsAeroshellContent() {
  const heatShieldTex = useMemo(() => getCharredHeatShieldTexture(), []);

  return (
    <group position={[0, 0.15, 0]}>
      {/* ── Conical Backshell (Aft Aero-Shell with Thermal Protection System) ── */}
      <mesh position={[0, 0.14, 0]}>
        <coneGeometry args={[0.56, 0.52, 32]} />
        <meshStandardMaterial
          color="#ebe7de"
          roughness={0.55}
          metalness={0.15}
        />
      </mesh>
      {/* Parachute Mortar Canister at Apex */}
      <mesh position={[0, 0.39, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.08, 20]} />
        <meshStandardMaterial color="#3a3d42" metalness={0.75} roughness={0.3} />
      </mesh>
      {/* Mortar ejection cover plate */}
      <mesh position={[0, 0.435, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.015, 20]} />
        <meshStandardMaterial color="#b05830" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Parachute bridle attachment brackets */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh key={deg} position={[Math.cos(rad) * 0.13, 0.38, Math.sin(rad) * 0.13]}>
            <boxGeometry args={[0.02, 0.04, 0.02]} />
            <meshStandardMaterial color="#22252a" metalness={0.8} roughness={0.3} />
          </mesh>
        );
      })}

      {/* Marmon Clamp Band Interface Ring (Separator with gold release bolts) */}
      <mesh position={[0, -0.11, 0]}>
        <cylinderGeometry args={[0.575, 0.575, 0.04, 32]} />
        <meshStandardMaterial color="#40444c" metalness={0.82} roughness={0.28} />
      </mesh>
      {/* Golden explosive separation bolt assemblies around perimeter */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh key={deg} position={[Math.cos(rad) * 0.582, -0.11, Math.sin(rad) * 0.582]}>
            <cylinderGeometry args={[0.012, 0.012, 0.05, 8]} />
            <meshStandardMaterial color="#dfa838" metalness={0.9} roughness={0.2} />
          </mesh>
        );
      })}

      {/* ── Forward Ablative Heat Shield with Charred PICA-X Tiles ── */}
      <mesh position={[0, -0.18, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.575, 0.17, 32]} />
        <meshStandardMaterial
          map={heatShieldTex}
          roughness={0.78}
          metalness={0.25}
        />
      </mesh>
      {/* Aerodynamic Shoulder Ring Transition */}
      <mesh position={[0, -0.11, 0]}>
        <cylinderGeometry args={[0.575, 0.575, 0.02, 32]} />
        <meshStandardMaterial color="#68564a" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Stagnation nose cap */}
      <mesh position={[0, -0.265, 0]}>
        <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#42342c" metalness={0.3} roughness={0.8} />
      </mesh>
    </group>
  );
}

const _shipCopy = new THREE.Vector3();
const _aheadCopy = new THREE.Vector3();
const _targetQuat = new THREE.Quaternion();
const _lookMat = new THREE.Matrix4();
const _up = new THREE.Vector3(0, 1, 0);

function FlightAnimator({
  isMars,
  cutVeilRef,
}: {
  isMars: boolean;
  cutVeilRef: RefObject<HTMLDivElement | null>;
}) {
  const { camera } = useThree();
  const shipRef = useRef<THREE.Group>(null);
  const saturnRef = useRef<THREE.Group>(null);
  const lmRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Group>(null);
  const boosterRef = useRef<THREE.Group>(null);
  const sepFlashRef = useRef<THREE.Mesh>(null);
  const phaseRef = useRef(useGameStore.getState().phase);
  const elapsed = useRef(0);
  const lookRef = useRef(new THREE.Vector3(0, 0, -10));
  const landingCut = useRef(false);
  const orientInit = useRef(false);
  const separated = useRef(false);
  const sepPos = useRef(new THREE.Vector3());
  const sepDir = useRef(new THREE.Vector3());
  const sepQuat = useRef(new THREE.Quaternion());
  const sepTime = useRef(0);

  const marsProbeRef = useRef<THREE.Group>(null);
  const marsCruiseRef = useRef<THREE.Group>(null);
  const marsCruiseSepRef = useRef<THREE.Group>(null);
  const cruiseSeparated = useRef(false);
  const cruiseSepPos = useRef(new THREE.Vector3());
  const cruiseSepDir = useRef(new THREE.Vector3());
  const cruiseSepQuat = useRef(new THREE.Quaternion());
  const cruiseSepTime = useRef(0);

  const marsLanderRef = useRef<THREE.Group>(null);
  const chuteRef = useRef<THREE.Group>(null);
  const heatShieldRef = useRef<THREE.Mesh>(null);
  const shieldDropRef = useRef<THREE.Mesh>(null);
  const shieldDropY = useRef(0);
  const flameState = useRef({ scale: 0 });

  const { scene: saturnScene } = useGLTF("/models/saturn-v.glb");
  const { scene: lmScene } = useGLTF("/models/lunar-module.glb");
  const saturnClone = useMemo(() => {
    const clone = saturnScene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.castShadow = true;
        m.receiveShadow = true;
        if (m.material && (m.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
          const mat = (m.material as THREE.MeshStandardMaterial).clone();
          mat.roughness = 0.38;
          mat.metalness = 0.25;
          m.material = mat;
        }
      }
    });
    return clone;
  }, [saturnScene]);
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
            cruiseSeparated.current = false;
            cruiseSepTime.current = 0;
            shieldDropY.current = 0;
            landingCut.current = false;
            orientInit.current = false;
          }
        }
      }),
    [],
  );

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const phase = phaseRef.current;
    elapsed.current += dt;
    const dur = DUR[phase] || 5;
    const progress = Math.min(elapsed.current / dur, 1);

    _shipCopy.copy(shipPos(phase, progress));

    const inLandingScene =
      (phase === "descent" && progress >= LAND_CUT_AT) ||
      phase === "touchdown" ||
      phase === "stepOut";

    // Subtle atmospheric entry haze across orbital-to-terminal landing transition — no pitch-black blackout!
    if (cutVeilRef.current) {
      let veil = 0;
      if (phase === "descent") {
        if (progress >= 0.27 && progress < LAND_CUT_AT) {
          veil = 0.3 * ease((progress - 0.27) / (LAND_CUT_AT - 0.27));
        } else if (progress >= LAND_CUT_AT && progress < 0.35) {
          veil = 0.3 * (1 - ease((progress - LAND_CUT_AT) / 0.05));
        }
      }
      cutVeilRef.current.style.opacity = String(veil);
    }

    // Stage 1 separation: launch booster detaches cleanly for BOTH Moon & Mars
    if (phase === "coast" && progress >= STAGE_SEP_AT && !separated.current) {
      separated.current = true;
      sepTime.current = 0;
      sepPos.current.copy(_shipCopy);
      _aheadCopy.copy(shipPos(phase, Math.min(progress + 0.05, 1)));
      sepDir.current.subVectors(_shipCopy, _aheadCopy).normalize();
      if (shipRef.current) sepQuat.current.copy(shipRef.current.quaternion);
      gameAudio.playStaging();
    }
    if (separated.current) {
      sepTime.current += dt;
    }

    // Stage 2 Mars separation: Cruise/Orbiter stage separates from Entry Aeroshell/Lander
    if (
      isMars &&
      phase === "descent" &&
      progress >= CRUISE_SEP_AT &&
      !inLandingScene &&
      !cruiseSeparated.current
    ) {
      cruiseSeparated.current = true;
      cruiseSepTime.current = 0;
      cruiseSepPos.current.copy(_shipCopy);
      _aheadCopy.copy(shipPos(phase, Math.min(progress + 0.05, 1)));
      cruiseSepDir.current.subVectors(_shipCopy, _aheadCopy).normalize();
      if (shipRef.current) cruiseSepQuat.current.copy(shipRef.current.quaternion);
      gameAudio.playStaging();
    }
    if (cruiseSeparated.current) {
      cruiseSepTime.current += dt;
    }

    if (shipRef.current) {
      shipRef.current.position.copy(_shipCopy);
      if (inLandingScene) {
        shipRef.current.quaternion.identity();
      } else {
        _aheadCopy.copy(shipPos(phase, Math.min(progress + 0.03, 1)));
        if (_aheadCopy.distanceToSquared(_shipCopy) > 0.000001) {
          _lookMat.lookAt(_aheadCopy, _shipCopy, _up);
          _targetQuat.setFromRotationMatrix(_lookMat);
          if (!orientInit.current) {
            shipRef.current.quaternion.copy(_targetQuat);
            orientInit.current = true;
          } else {
            dampQ(shipRef.current.quaternion, _targetQuat, 0.14, dt);
          }
        }
      }
    }

    // Stage 1 booster drift (now visible on Mars just like Moon)
    if (boosterRef.current) {
      const showBooster =
        separated.current &&
        phase !== "flight" &&
        !inLandingScene &&
        phase !== "targetLocked" &&
        sepTime.current < 16;
      if (showBooster) {
        boosterRef.current.visible = true;
        const t = sepTime.current;
        const drift = t * 1.35;
        boosterRef.current.position.set(
          sepPos.current.x + sepDir.current.x * drift,
          sepPos.current.y + sepDir.current.y * drift - t * 0.08,
          sepPos.current.z + sepDir.current.z * drift,
        );
        boosterRef.current.quaternion.copy(sepQuat.current);
        boosterRef.current.rotateX(t * 0.14);
        boosterRef.current.rotateZ(t * 0.08);
        const fade = Math.max(0.12, 1 - t * 0.09);
        boosterRef.current.scale.setScalar(0.5 * fade);
      } else {
        boosterRef.current.visible = false;
      }
    }

    // Stage separation RCS puff pulse
    if (sepFlashRef.current) {
      const active = separated.current && sepTime.current < 0.75 && !inLandingScene;
      sepFlashRef.current.visible = active;
      if (active) {
        const ft = sepTime.current / 0.75;
        sepFlashRef.current.position.copy(sepPos.current);
        sepFlashRef.current.scale.setScalar(0.4 + ft * 2.4);
        (sepFlashRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - ft) * 0.65;
      }
    }

    // Stage 2 Mars Cruise/Orbiter drift before atmospheric entry
    if (marsCruiseSepRef.current) {
      const showCruiseDrift =
        isMars &&
        cruiseSeparated.current &&
        phase === "descent" &&
        !inLandingScene;
      marsCruiseSepRef.current.visible = showCruiseDrift;
      if (showCruiseDrift) {
        const t = cruiseSepTime.current;
        const drift = t * 1.6;
        marsCruiseSepRef.current.position.set(
          cruiseSepPos.current.x + cruiseSepDir.current.x * drift,
          cruiseSepPos.current.y + cruiseSepDir.current.y * drift + t * 0.12,
          cruiseSepPos.current.z + cruiseSepDir.current.z * drift,
        );
        marsCruiseSepRef.current.quaternion.copy(cruiseSepQuat.current);
        marsCruiseSepRef.current.rotateX(-t * 0.18);
        marsCruiseSepRef.current.rotateZ(t * 0.1);
        marsCruiseSepRef.current.scale.setScalar(0.42 * Math.max(0.2, 1 - t * 0.15));
      }
    }

    const ct = camTarget(phase, _shipCopy, progress);
    if (inLandingScene && !landingCut.current) {
      camera.position.copy(ct.pos);
      lookRef.current.copy(ct.look);
      landingCut.current = true;
    } else {
      const smooth = phase === "orbit" ? 0.85 : inLandingScene ? 0.55 : 0.65;
      damp3(camera.position, ct.pos, smooth, dt);
      damp3(lookRef.current, ct.look, 0.45, dt);
    }
    camera.lookAt(lookRef.current);

    if (phase === "flight" || phase === "coast") landingCut.current = false;

    if (isMars) {
      const showRocket =
        phase === "flight" || (phase === "coast" && !separated.current);
      if (saturnRef.current) saturnRef.current.visible = showRocket;
      if (lmRef.current) lmRef.current.visible = false;
      if (marsProbeRef.current) {
        marsProbeRef.current.visible = !showRocket && !inLandingScene;
      }
      if (marsCruiseRef.current) {
        marsCruiseRef.current.visible = !cruiseSeparated.current && !inLandingScene;
      }
      if (marsLanderRef.current) {
        marsLanderRef.current.visible = inLandingScene;
      }
      const inChutePhase = inLandingScene && phase === "descent" && progress < 0.58;
      if (chuteRef.current) {
        chuteRef.current.visible = inChutePhase;
        if (inChutePhase) {
          chuteRef.current.rotation.z = Math.sin(elapsed.current * 2.2) * 0.04;
        }
      }
      if (heatShieldRef.current) {
        heatShieldRef.current.visible = inChutePhase;
        if (inChutePhase) {
          const heatIntensity = 0.28 + Math.sin(elapsed.current * 8) * 0.12;
          (heatShieldRef.current.material as THREE.MeshBasicMaterial).opacity = heatIntensity;
        }
      }
      if (shieldDropRef.current) {
        const dropping = inLandingScene && phase === "descent" && progress >= 0.58 && shieldDropY.current > -18;
        shieldDropRef.current.visible = dropping;
        if (dropping) {
          shieldDropY.current -= dt * 7.5;
          shieldDropRef.current.position.set(0, -0.45 + shieldDropY.current, 0);
          shieldDropRef.current.rotation.x += dt * 0.4;
        } else if (!inLandingScene || progress < 0.58) {
          shieldDropY.current = 0;
        }
      }
    } else {
      const useLM =
        separated.current ||
        phase === "orbit" ||
        phase === "targetLocked" ||
        phase === "descent" ||
        phase === "touchdown" ||
        phase === "stepOut";
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
      if (marsProbeRef.current) marsProbeRef.current.visible = false;
      if (marsLanderRef.current) marsLanderRef.current.visible = false;
      if (chuteRef.current) chuteRef.current.visible = false;
      if (heatShieldRef.current) heatShieldRef.current.visible = false;
      if (shieldDropRef.current) shieldDropRef.current.visible = false;
    }

    const powered =
      phase === "flight" ||
      phase === "targetLocked" ||
      (phase === "descent" &&
        (isMars
          ? !inLandingScene
            ? progress < 0.12
            : progress > 0.58 && progress < 0.94
          : !(inLandingScene && progress > 0.9)));
    damp(flameState.current, "scale", powered ? 1 : 0, 0.12, dt);
    if (flameRef.current) {
      const s = flameState.current.scale;
      flameRef.current.visible = s > 0.02;
      if (s > 0.02) {
        const t = elapsed.current;
        const flicker = 0.93 + Math.sin(t * 34) * 0.05 + Math.cos(t * 52) * 0.03;
        const radial = 0.96 + Math.sin(t * 24) * 0.04;
        if (inLandingScene) {
          flameRef.current.rotation.set(Math.PI, 0, 0);
          flameRef.current.position.set(0, isMars ? -0.9 : -1, 0);
          flameRef.current.scale.set(s * 0.45 * radial, s * 0.45 * radial, s * 0.45 * flicker);
        } else {
          flameRef.current.rotation.set(-Math.PI / 2, 0, 0);
          flameRef.current.position.set(0, -0.3725, -0.08);
          flameRef.current.scale.set(s * radial, s * radial, s * flicker);
        }
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

        {/* Mars Cruise Ring + Entry Aeroshell/Lander stack (separates during descent!) */}
        <group ref={marsProbeRef} scale={0.42} rotation={[Math.PI / 2, 0, 0]} visible={false}>
          {/* Detachable Cruise Stage / Orbiter Ring */}
          <group ref={marsCruiseRef} position={[0, -0.45, 0]}>
            <MarsCruiseStageContent />
          </group>
          {/* Conical Entry Aeroshell + Backshell + Heat Shield */}
          <MarsAeroshellContent />
        </group>

        {/* Mars Surface Descent Pod / Lander + Parachute + Heat Shield Drop */}
        <group ref={marsLanderRef} scale={0.62} visible={false}>
          {/* Descent Stage / Sky Crane body */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.45, 0.58, 0.38, 24]} />
            <meshStandardMaterial color="#c8b896" metalness={0.55} roughness={0.38} />
          </mesh>
          {/* Sky crane top ring */}
          <mesh position={[0, 0.46, 0]}>
            <cylinderGeometry args={[0.42, 0.45, 0.04, 24]} />
            <meshStandardMaterial color="#b0a888" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Gold Foil Thermal Belly */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.38, 0.32, 0.16, 24]} />
            <meshStandardMaterial color="#d4a238" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Bottom panel / nozzle deck */}
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.52, 0.56, 0.06, 24]} />
            <meshStandardMaterial color="#8a8070" metalness={0.5} roughness={0.45} />
          </mesh>
          {/* 8 MLE thrusters around perimeter */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <mesh
                key={`thr-${deg}`}
                position={[Math.cos(rad) * 0.48, -0.06, Math.sin(rad) * 0.48]}
              >
                <cylinderGeometry args={[0.025, 0.035, 0.08, 12]} />
                <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
              </mesh>
            );
          })}
          {/* 4 Landing Legs / Rocker Struts */}
          {[45, 135, 225, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <group key={deg}>
                <mesh
                  position={[Math.cos(rad) * 0.52, -0.12, Math.sin(rad) * 0.52]}
                  rotation={[Math.sin(rad) * 0.35, 0, -Math.cos(rad) * 0.35]}
                >
                  <cylinderGeometry args={[0.025, 0.018, 0.52, 8]} />
                  <meshStandardMaterial color="#888888" metalness={0.65} roughness={0.35} />
                </mesh>
                {/* Foot pad */}
                <mesh position={[Math.cos(rad) * 0.68, -0.38, Math.sin(rad) * 0.68]}>
                  <cylinderGeometry args={[0.05, 0.06, 0.02, 12]} />
                  <meshStandardMaterial color="#777777" metalness={0.5} roughness={0.5} />
                </mesh>
              </group>
            );
          })}
          {/* High-Gain Dish */}
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.24, 0.08, 0.06, 24]} />
            <meshStandardMaterial color="#e0ded8" metalness={0.75} roughness={0.25} />
          </mesh>
          {/* Dish feed horn */}
          <mesh position={[0, 0.62, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
            <meshStandardMaterial color="#aaaaaa" metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Doppler radar altimeter (surface ranging radar) */}
          <group position={[0.24, -0.06, 0.24]} rotation={[0.3, 0.4, 0]}>
            <mesh>
              <cylinderGeometry args={[0.07, 0.02, 0.03, 16]} />
              <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.25} />
            </mesh>
            <mesh position={[0, -0.02, 0]}>
              <boxGeometry args={[0.03, 0.02, 0.03]} />
              <meshStandardMaterial color="#dfa230" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>

          {/* Panoramic Camera / Science Mast */}
          <group position={[-0.22, 0.46, -0.2]} rotation={[0, 0.2, 0]}>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.012, 0.016, 0.24, 8]} />
              <meshStandardMaterial color="#40444c" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[0.06, 0.04, 0.04]} />
              <meshStandardMaterial color="#d4a238" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>

          {/* Supersonic Parachute + Bridle */}
          <group ref={chuteRef} position={[0, 2.3, 0]} visible={false}>
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[1.15, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
              <meshStandardMaterial color="#e85828" roughness={0.65} side={THREE.DoubleSide} />
            </mesh>
            {/* White band pattern on chute */}
            <mesh position={[0, 0.18, 0]}>
              <sphereGeometry args={[1.14, 32, 6, 0, Math.PI * 2, Math.PI * 0.18, Math.PI * 0.08]} />
              <meshStandardMaterial color="#f0e8d8" roughness={0.7} side={THREE.DoubleSide} />
            </mesh>
            {/* 8 suspension lines */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <mesh
                  key={deg}
                  position={[Math.cos(rad) * 0.44, -0.8, Math.sin(rad) * 0.44]}
                  rotation={[Math.sin(rad) * 0.22, 0, -Math.cos(rad) * 0.22]}
                >
                  <cylinderGeometry args={[0.005, 0.005, 1.9, 4]} />
                  <meshBasicMaterial color="#cccccc" />
                </mesh>
              );
            })}
          </group>

          {/* Heat shield entry plasma glow */}
          <mesh ref={heatShieldRef} position={[0, -0.25, 0]} visible={false}>
            <sphereGeometry args={[0.68, 24, 16, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55]} />
            <meshBasicMaterial
              color="#ff5511"
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Separated heat shield falling away */}
          <mesh ref={shieldDropRef} position={[0, -0.45, 0]} rotation={[Math.PI, 0, 0]} visible={false}>
            <coneGeometry args={[0.58, 0.16, 24]} />
            <meshStandardMaterial color="#3c2a21" metalness={0.2} roughness={0.8} />
          </mesh>
        </group>

        {/* Realistic Multi-Layer Rocket Exhaust Plume */}
        <group ref={flameRef} position={[0, -0.3725, -0.08]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Dynamic Combustion Point Light (illuminates rocket tail & fins realistically) */}
          <pointLight
            color="#ff9a36"
            intensity={4.5}
            distance={12}
            decay={1.8}
            position={[0, 0.2, 0]}
          />

          {/* 5 Individual F-1 Engine Nozzle Supersonic Jets */}
          {([
            [0, 0, 0],
            [0, 0, 0.175],
            [0, 0, -0.175],
            [-0.175, 0, 0],
            [0.175, 0, 0],
          ] as const).map(([nx, ny, nz], i) => (
            <group key={i} position={[nx, ny, nz]}>
              {/* Nozzle white-hot shock core */}
              <mesh position={[0, 0.45, 0]}>
                <coneGeometry args={[0.07, 0.9, 12]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.95}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
              {/* Nozzle fiery golden cone */}
              <mesh position={[0, 0.65, 0]}>
                <coneGeometry args={[0.11, 1.3, 12]} />
                <meshBasicMaterial
                  color="#ffaa33"
                  transparent
                  opacity={0.8}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            </group>
          ))}

          {/* Main Merged Supersonic Exhaust Plume: Inner Brilliant Core */}
          <mesh position={[0, 1.25, 0]}>
            <coneGeometry args={[0.22, 2.5, 16]} />
            <meshBasicMaterial
              color="#fff0cc"
              transparent
              opacity={0.92}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Main Merged Supersonic Exhaust Plume: Mid Fiery Amber Layer */}
          <mesh position={[0, 1.8, 0]}>
            <coneGeometry args={[0.36, 3.6, 16]} />
            <meshBasicMaterial
              color="#ff8811"
              transparent
              opacity={0.75}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Main Merged Supersonic Exhaust Plume: Outer Expanding Plasma Sheath */}
          <mesh position={[0, 2.3, 0]}>
            <coneGeometry args={[0.52, 4.6, 16]} />
            <meshBasicMaterial
              color="#ff4400"
              transparent
              opacity={0.45}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Mach Disks / Shock Diamonds along the plume centerline */}
          {[0.5, 0.95, 1.45, 2.0].map((y, idx) => (
            <mesh key={`diamond-${idx}`} position={[0, y, 0]} rotation={[0, (idx * Math.PI) / 4, 0]}>
              <octahedronGeometry args={[0.08 - idx * 0.012, 0]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.9 - idx * 0.15}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Stage 1 Rocket Booster drifting away cleanly (Moon & Mars) */}
      <group ref={boosterRef} visible={false}>
        <group scale={0.5} rotation={[Math.PI / 2, 0, 0]}>
          <primitive object={boosterClone} />
        </group>
      </group>

      {/* Separation RCS flash pulse */}
      <mesh ref={sepFlashRef} visible={false}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial
          color="#a8e6ff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Stage 2 Mars Cruise Stage separating away before entry */}
      <group ref={marsCruiseSepRef} visible={false}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <MarsCruiseStageContent />
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
    const show = phase === "descent" || phase === "touchdown" || phase === "stepOut";
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
  const tex = useLoader(THREE.TextureLoader, "/textures/mars-color-2k.jpg");
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
    const show = phase === "descent" || phase === "touchdown" || phase === "stepOut";
    if (groupRef.current) groupRef.current.visible = show;
  });

  return (
    <group ref={groupRef} position={LAND_SCENE.toArray()} visible={false}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60, 1, 1]} />
        <meshStandardMaterial
          map={clonedTex}
          roughness={0.92}
          metalness={0}
          color="#c08060"
        />
      </mesh>
      <ambientLight intensity={0.15} color="#e8c4a0" />
      <directionalLight position={[10, 15, 5]} intensity={2.0} color="#ffe0b0" />
    </group>
  );
}

function FlightContent({ cutVeilRef }: { cutVeilRef: RefObject<HTMLDivElement | null> }) {
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
      {!isMars && (
        <Suspense fallback={null}>
          <EarthSphere />
        </Suspense>
      )}
      <Suspense fallback={null}>
        {isMars ? <MarsSphere /> : <MoonSphere />}
      </Suspense>
      <LandingMarker isMars={!!isMars} />
      <OrbitPath isMars={!!isMars} />
      <Suspense fallback={null}>
        {isMars ? <MarsLandingGround /> : <LandingGround />}
      </Suspense>
      <FlightAnimator isMars={!!isMars} cutVeilRef={cutVeilRef} />
    </>
  );
}

/* ---- HUD ---- */

function FlightHUD({ onSkip }: { onSkip: () => void }) {
  const { t } = useTranslation();
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
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

  const startAlt = planet === "mars" ? 125000 : 15000;
  const [alt, setAlt] = useState(startAlt);
  useEffect(() => {
    if (phase !== "descent") {
      setAlt(startAlt);
      return;
    }
    const t0 = Date.now();
    const dur = 13600;
    const interval = setInterval(() => {
      const prog = Math.min((Date.now() - t0) / dur, 1);
      const shaped = 1 - Math.pow(prog, 1.35);
      setAlt(Math.max(0, Math.round(startAlt * Math.max(0, shaped))));
    }, 60);
    return () => clearInterval(interval);
  }, [phase, startAlt]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      {/* Top bar */}
      <div className="flex items-start justify-between px-3 sm:px-4 pt-3 sm:pt-4">
        <div>
          <p className="text-[10px] sm:text-xs font-medium tracking-wide text-regolith-400">
            {mission?.name?.toUpperCase() || "APOLLO"}
          </p>
          <p className="font-display text-base sm:text-lg font-semibold text-signal">
            {label}
          </p>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="text-right">
            <p className="text-[10px] sm:text-xs text-regolith-400">
              {t("flight.commander", { name: playerName })}
            </p>
            {phase === "descent" && (
              <p className="font-mono text-base sm:text-lg font-bold text-signal">
                {t("flight.alt", { alt: alt.toLocaleString() })}
              </p>
            )}
            {phase === "touchdown" && (
              <p className="font-mono text-base sm:text-lg font-bold text-signal">
                {t("flight.altContact")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="pointer-events-auto flex items-center justify-center gap-1.5 rounded-lg border border-space-700/80 bg-space-950/80 hover:bg-space-850 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-regolith-300 hover:text-white backdrop-blur transition hover:border-signal/50 active:scale-95 touch-manipulation shadow-lg"
            aria-label={isFullscreen ? t("fullscreen.exitHint") : t("fullscreen.enterHint")}
            title={isFullscreen ? t("fullscreen.exitHint") : t("fullscreen.enterHint")}
          >
            <span className="text-sm leading-none">{isFullscreen ? "🗗" : "⛶"}</span>
            <span className="hidden sm:inline text-[11px]">
              {isFullscreen ? t("fullscreen.exit") : t("fullscreen.enter")}
            </span>
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="pointer-events-auto flex items-center gap-1.5 rounded-lg border border-signal/50 bg-space-950/80 hover:bg-space-850 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-signal backdrop-blur transition hover:border-signal active:scale-95 touch-manipulation shadow-lg"
            aria-label="Skip to surface landing"
            title="Skip to surface (or press S)"
          >
            <span>{t("flight.skip")}</span>
            <span className="text-[10px]">⏩</span>
          </button>
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
      <div className="mt-auto px-3 sm:px-4 pb-4 sm:pb-6">
        <div className="mx-auto max-w-2xl rounded-lg bg-space-950/85 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur">
          <div className="flex items-baseline gap-2 sm:gap-3">
            <span className="shrink-0 text-[10px] sm:text-xs font-bold tracking-widest text-signal">
              {label.toUpperCase() || "FLIGHT"}
            </span>
            <p className="text-xs sm:text-base leading-relaxed text-regolith-200">
              {narration}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Main ---- */

function getGates(planet: Planet, missionType?: string): Partial<Record<GamePhase, { event: "BEGIN_DESCENT" | "OPEN_HATCH"; labelKey: string }>> {
  const isMars = planet === "mars";
  const isRobotic = missionType === "robotic";
  return {
    targetLocked: { event: "BEGIN_DESCENT", labelKey: isMars ? "flight.beginEntry" : "flight.beginDescent" },
    touchdown: { event: "OPEN_HATCH", labelKey: isRobotic ? "flight.deployInstruments" : "flight.openHatch" },
  };
}

export function FlightScene() {
  const { t } = useTranslation();
  const phase = useGameStore((s) => s.phase);
  const send = useGameStore((s) => s.send);

  const handleSkip = useCallback(() => {
    send("SKIP_TO_SURFACE");
  }, [send]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") {
        send("SKIP_TO_SURFACE");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [send]);
  const missionId = useGameStore((s) => s.missionId);
  const mission = useMemo(() => getMissionOrNull(missionId), [missionId]);
  const gates = useMemo(() => getGates(mission?.planet ?? "moon", mission?.missionType), [mission]);

  useEffect(() => {
    if (phase === "stepOut") return;
    const beat = BEAT_EVENTS.find((b) => b.from === phase);
    if (!beat) return;
    let cancelWait: (() => void) | null = null;
    const timer = setTimeout(() => {
      cancelWait = onNarrationComplete(() => send(beat.event), 12000);
    }, beat.delay);
    return () => {
      clearTimeout(timer);
      if (cancelWait) cancelWait();
    };
  }, [phase, send]);

  useEffect(() => {
    const gate = gates[phase];
    if (!gate) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        send(gate.event);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, send, gates]);

  const cutVeilRef = useRef<HTMLDivElement | null>(null);
  const [stepOutFading, setStepOutFading] = useState(false);

  useEffect(() => {
    if (phase !== "stepOut") {
      setStepOutFading(false);
      return;
    }
    let cancelWait: (() => void) | null = null;
    let sendTimer: ReturnType<typeof setTimeout> | null = null;
    const minTimer = setTimeout(() => {
      cancelWait = onNarrationComplete(() => {
        setStepOutFading(true);
        sendTimer = setTimeout(() => send("STEP_OUT"), 900);
      }, 10000);
    }, 7600);
    return () => {
      clearTimeout(minTimer);
      if (cancelWait) cancelWait();
      if (sendTimer) clearTimeout(sendTimer);
    };
  }, [phase, send]);

  const gate = gates[phase];
  const isMars = mission?.planet === "mars";

  return (
    <div className="relative h-screen w-full">
      <Canvas
        camera={{ position: [-18, 2.2, -11], fov: 55, near: 0.1, far: 2000 }}
        gl={{ antialias: false }}
      >
        <color attach="background" args={["#020408"]} />
        <FlightContent cutVeilRef={cutVeilRef} />
        <Effects bloom vignette bloomThreshold={0.55} bloomIntensity={1.0} />
        <Preload all />
      </Canvas>
      {/* Cross-dissolve veil across orbital-to-landing cut */}
      <div
        ref={cutVeilRef}
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          opacity: 0,
          backgroundColor: isMars ? "#160a04" : "#000000",
        }}
      />
      <FlightHUD onSkip={handleSkip} />
      {gate && (
        <div className="absolute inset-x-0 bottom-20 sm:bottom-24 z-20 flex justify-center px-4">
          <button
            onClick={() => send(gate.event)}
            className="touch-manipulation animate-pulse rounded-lg border border-signal/60 bg-signal/20 px-6 sm:px-10 py-3 sm:py-4 font-display text-base sm:text-xl font-semibold text-signal backdrop-blur transition hover:bg-signal/30 active:scale-95 min-h-[48px] sm:min-h-[56px]"
          >
            {isTouchDevice() ? t(gate.labelKey) : `[Space] ${t(gate.labelKey)}`}
          </button>
        </div>
      )}
      <div
        className={`pointer-events-none absolute inset-0 z-30 bg-black transition-opacity duration-900 ease-in ${stepOutFading ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
