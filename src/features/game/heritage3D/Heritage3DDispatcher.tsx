import { JSX } from "react";
import {
  AmericanFlag3D,
  TVCamera3D,
  LaserRetroreflector3D,
  PSEPSeismometer3D,
  SolarWindComp3D,
  GolfBallsClub3D,
  FamilyPhoto3D,
  FallenAstronaut3D,
  SBandAntenna3D,
  METCart3D,
  OrangeSoil3D,
  MESA3D,
  HandToolCarrier3D,
  UVCamera3D,
  ALSEPCentralStation3D,
  Surveyor3Spacecraft3D,
  LunarRovingVehicle3D,
  LunarModuleDescentStage3D,
} from "./MoonArtifacts";

import {
  CuriosityRover3D,
  OpportunityRover3D,
  PerseveranceRover3D,
  SpiritRover3D,
  YellowknifeBayFeature3D,
  MountSharpFeature3D,
  EagleCraterFeature3D,
  MarathonValleyFeature3D,
  PerseveranceValleyFeature3D,
  JezeroDeltaFeature3D,
  ColumbiaHillsFeature3D,
  HomePlateFeature3D,
  BonnevilleCraterFeature3D,
  MarsHeatShield3D,
  IngenuityHelicopter3D,
  MarsSampleTubes3D,
  SojournerRover3D,
  MarsCalibrationTarget3D,
  MarsBlueberries3D,
  MarsDrillHoles3D,
  SkyCraneDescentStage3D,
  VikingLanderBody3D,
  VikingSamplerArm3D,
  VikingMeteorology3D,
  VikingFacsimileCameras3D,
  VikingAntenna3D,
  VikingSeismometer3D,
  Viking2LanderBody3D,
  Viking2SamplerArm3D,
  Viking2Seismometer3D,
  Viking2Meteorology3D,
  Viking2FacsimileCameras3D,
  Viking2GCMSInlet3D,
  PhoenixLanderBody3D,
  PhoenixRoboticArm3D,
  PhoenixTEGA3D,
  PhoenixMECA3D,
  PhoenixSolarWings3D,
  PhoenixLidarStation3D,
  InSightLanderBody3D,
  InSightSEIS3D,
  InSightHP3Mole3D,
  InSightUltraFlexArrays3D,
  InSightIDCArm3D,
  InSightTWINS3D,
  PathfinderBaseStation3D,
  MarsDeploymentRamp3D,
  IMPCameraMast3D,
  BarnacleBillRock3D,
  YogiRock3D,
  SuperCamLaserMarks3D,
  BackshellParachute3D,
  RoverWheelTracks3D,
} from "./MarsArtifacts";

export interface Heritage3DProps {
  missionId: string;
  objectId: string;
  wireframe?: boolean;
  explode?: number;
  scale?: number;
}

export function hasDedicated3DModel(missionId: string, objectId: string): boolean {
  return getDedicated3DComponent(missionId, objectId) !== null;
}

export function getDedicated3DComponent(
  _missionId: string,
  objectId: string,
): ((props: { wireframe?: boolean; explode?: number; scale?: number }) => JSX.Element) | null {
  // ── Moon Missions (Apollo 11 to 17) ──
  if (objectId === "flag") return AmericanFlag3D;
  if (objectId === "tv-camera") return TVCamera3D;
  if (objectId === "lrrr") return LaserRetroreflector3D;
  if (objectId === "psep") return PSEPSeismometer3D;
  if (objectId === "swc") return SolarWindComp3D;
  if (objectId === "mesa") return MESA3D;
  if (objectId === "s-band-antenna") return SBandAntenna3D;
  if (objectId === "hand-tool-carrier") return HandToolCarrier3D;
  if (objectId === "met") return METCart3D;
  if (objectId === "golf-balls") return GolfBallsClub3D;
  if (objectId === "fallen-astronaut") return FallenAstronaut3D;
  if (objectId === "uv-camera") return UVCamera3D;
  if (objectId === "family-photo") return FamilyPhoto3D;
  if (objectId === "orange-soil") return OrangeSoil3D;
  if (objectId === "alsep") return ALSEPCentralStation3D;
  if (objectId === "surveyor-3") return Surveyor3Spacecraft3D;
  if (objectId === "lrv") return LunarRovingVehicle3D;
  if (objectId === "descent-stage") return LunarModuleDescentStage3D;

  // ── Mars Missions ──
  // Curiosity
  if (objectId === "cu-rover") return CuriosityRover3D;
  if (objectId === "cu-drill-holes") return MarsDrillHoles3D;
  if (objectId === "cu-calibration-target") return MarsCalibrationTarget3D;
  if (objectId === "cu-sky-crane") return SkyCraneDescentStage3D;
  if (objectId === "cu-yellowknife") return YellowknifeBayFeature3D;
  if (objectId === "cu-mount-sharp") return MountSharpFeature3D;

  // Opportunity
  if (objectId === "op-rover") return OpportunityRover3D;
  if (objectId === "op-blueberries") return MarsBlueberries3D;
  if (objectId === "op-heat-shield") return MarsHeatShield3D;
  if (objectId === "op-eagle-crater") return EagleCraterFeature3D;
  if (objectId === "op-marathon-valley") return MarathonValleyFeature3D;
  if (objectId === "op-perseverance-valley") return PerseveranceValleyFeature3D;

  // Pathfinder
  if (objectId === "mp-sojourner") return SojournerRover3D;
  if (objectId === "mp-base-station") return PathfinderBaseStation3D;
  if (objectId === "mp-ramp") return MarsDeploymentRamp3D;
  if (objectId === "mp-imp-camera") return IMPCameraMast3D;
  if (objectId === "mp-barnacle-bill") return BarnacleBillRock3D;
  if (objectId === "mp-yogi") return YogiRock3D;

  // Perseverance
  if (objectId === "pe-rover") return PerseveranceRover3D;
  if (objectId === "pe-ingenuity") return IngenuityHelicopter3D;
  if (objectId === "pe-sample-tubes") return MarsSampleTubes3D;
  if (objectId === "pe-supercam") return SuperCamLaserMarks3D;
  if (objectId === "pe-sky-crane") return SkyCraneDescentStage3D;
  if (objectId === "pe-delta") return JezeroDeltaFeature3D;

  // Spirit
  if (objectId === "sp-rover") return SpiritRover3D;
  if (objectId === "sp-wheel-tracks") return RoverWheelTracks3D;
  if (objectId === "sp-heat-shield") return BackshellParachute3D;
  if (objectId === "sp-columbia-hills") return ColumbiaHillsFeature3D;
  if (objectId === "sp-home-plate") return HomePlateFeature3D;
  if (objectId === "sp-bonneville") return BonnevilleCraterFeature3D;

  // Viking 1
  if (objectId === "v1-lander-body") return VikingLanderBody3D;
  if (objectId === "v1-sampler-arm") return VikingSamplerArm3D;
  if (objectId === "v1-meteorology") return VikingMeteorology3D;
  if (objectId === "v1-cameras") return VikingFacsimileCameras3D;
  if (objectId === "v1-antenna") return VikingAntenna3D;
  if (objectId === "v1-seismometer") return VikingSeismometer3D;

  // Viking 2
  if (objectId === "v2-lander-body") return Viking2LanderBody3D;
  if (objectId === "v2-sampler-arm") return Viking2SamplerArm3D;
  if (objectId === "v2-seismometer") return Viking2Seismometer3D;
  if (objectId === "v2-meteorology") return Viking2Meteorology3D;
  if (objectId === "v2-facsimile-camera") return Viking2FacsimileCameras3D;
  if (objectId === "v2-gcms-inlet") return Viking2GCMSInlet3D;

  // Phoenix
  if (objectId === "phoenix-lander-body") return PhoenixLanderBody3D;
  if (objectId === "phoenix-ra-arm") return PhoenixRoboticArm3D;
  if (objectId === "phoenix-tega") return PhoenixTEGA3D;
  if (objectId === "phoenix-meca") return PhoenixMECA3D;
  if (objectId === "phoenix-solar-wings") return PhoenixSolarWings3D;
  if (objectId === "phoenix-lidar") return PhoenixLidarStation3D;

  // InSight
  if (objectId === "insight-lander-body") return InSightLanderBody3D;
  if (objectId === "insight-seis") return InSightSEIS3D;
  if (objectId === "insight-hp3") return InSightHP3Mole3D;
  if (objectId === "insight-ultraflex") return InSightUltraFlexArrays3D;
  if (objectId === "insight-idc-arm") return InSightIDCArm3D;
  if (objectId === "insight-twins") return InSightTWINS3D;

  return null;
}

export function HeritageObject3D({
  missionId,
  objectId,
  wireframe = false,
  explode = 0,
  scale = 1,
}: Heritage3DProps) {
  const Comp = getDedicated3DComponent(missionId, objectId);
  if (!Comp) return null;
  return <Comp wireframe={wireframe} explode={explode} scale={scale} />;
}

export function getDedicatedComponents(
  _missionId: string,
  objectId: string,
): { name: string; displayName: string; explode: [number, number, number] }[] {
  return DEDICATED_COMPONENTS[objectId] || [
    { name: "main", displayName: "Primary Structure", explode: [0, 0.1, 0] },
    { name: "subsystem", displayName: "Sensor & Avionics Subsystem", explode: [0.2, 0.2, 0] },
  ];
}

const DEDICATED_COMPONENTS: Record<string, { name: string; displayName: string; explode: [number, number, number] }[]> = {
  flag: [
    { name: "banner", displayName: "50-Star Nylon Banner", explode: [0.2, 0.1, 0] },
    { name: "crossbar", displayName: "Telescopic Spreader Bar", explode: [0, 0.2, 0] },
    { name: "staff", displayName: "Anodized Aluminum Staff", explode: [0, 0, 0] },
    { name: "finial", displayName: "Gold Spearpoint Finial", explode: [0, 0.3, 0] },
    { name: "base", displayName: "Lunar Regolith Mound", explode: [0, -0.2, 0] },
  ],
  "tv-camera": [
    { name: "optics", displayName: "Quartz Optical Lens Barrel", explode: [0.25, 0.1, 0] },
    { name: "housing", displayName: "Westinghouse SEC Vidicon Housing", explode: [0, 0.1, 0] },
    { name: "blanket", displayName: "Gold MLI Thermal Blanket", explode: [-0.15, 0.1, 0] },
    { name: "tripod", displayName: "3-Legged Tubular Tripod", explode: [0, -0.25, 0] },
    { name: "cable", displayName: "Lunar MESA Umbilical Cable", explode: [0.1, -0.2, 0] },
  ],
  lrrr: [
    { name: "prisms", displayName: "100 Fused-Silica Corner-Cubes", explode: [0, 0.25, 0.1] },
    { name: "pallet", displayName: "White Anodized Aluminum Pallet", explode: [0, 0, 0] },
    { name: "bracket", displayName: "45° Elevation Tilt Bracket", explode: [0, -0.15, 0] },
    { name: "gnomon", displayName: "Shadow-Pin Alignment Gnomon", explode: [0.2, 0.2, 0] },
  ],
  psep: [
    { name: "drum", displayName: "Central Seismic Sensor Drum", explode: [0, 0.1, 0] },
    { name: "wings", displayName: "Dual Fold-Out Solar Arrays", explode: [0.3, 0.1, 0] },
    { name: "skirt", displayName: "Aluminized Mylar Thermal Skirt", explode: [0, -0.15, 0] },
    { name: "antenna", displayName: "S-Band Helical Telemetry Antenna", explode: [0, 0.3, 0] },
  ],
  swc: [
    { name: "foil", displayName: "Swiss Platinum-Aluminum Foil", explode: [0.2, 0, 0] },
    { name: "mast", displayName: "Telescopic Vertical Staff", explode: [0, 0, 0] },
    { name: "reel", displayName: "Deployment Reel Canister", explode: [0, 0.25, 0] },
  ],
  mesa: [
    { name: "table", displayName: "Deployable Equipment Table", explode: [0, 0.2, 0] },
    { name: "src_boxes", displayName: "SRC Lunar Sample Return Boxes", explode: [-0.2, 0.3, 0] },
    { name: "tv_mount", displayName: "TV Camera Stowage Bracket", explode: [0.2, 0.2, 0] },
    { name: "thermal", displayName: "Kapton Multi-Layer Insulation", explode: [0, -0.1, 0] },
  ],
  "s-band-antenna": [
    { name: "dish", displayName: "10-Foot Parabolic Umbrella Mesh Dish", explode: [0, 0.35, 0] },
    { name: "feed", displayName: "Subreflector Feed Horn", explode: [0, 0.45, 0] },
    { name: "tripod", displayName: "Erectable Tripod Stand", explode: [0, -0.2, 0] },
  ],
  "hand-tool-carrier": [
    { name: "frame", displayName: "Tubular Aluminum Tote Frame", explode: [0, 0.1, 0] },
    { name: "bags", displayName: "Beta-Cloth Sample Collection Bags", explode: [0.2, 0, 0] },
    { name: "hammer", displayName: "Apollo Geology Hammer", explode: [0.3, 0.25, 0] },
    { name: "tongs", displayName: "Spring-Loaded Core Tongs", explode: [-0.3, 0.25, 0] },
  ],
  met: [
    { name: "chassis", displayName: "Tubular Aluminum Frame & Tow Bar", explode: [0, 0.1, 0] },
    { name: "tires", displayName: "Pneumatic Rubber Tires (Goodyear)", explode: [0.25, 0, 0] },
    { name: "stowage", displayName: "Tool & Rock Box Stowage Trays", explode: [0, 0.25, 0] },
  ],
  "golf-balls": [
    { name: "club", displayName: "Shepard's Wilson 6-Iron Club", explode: [0, 0.25, 0] },
    { name: "ball1", displayName: "No. 1 Golf Ball ('Miles and Miles')", explode: [0.2, 0.1, 0] },
    { name: "ball2", displayName: "No. 2 Golf Ball (Javelin Crater Lip)", explode: [-0.2, 0.1, 0] },
  ],
  "fallen-astronaut": [
    { name: "statue", displayName: "Solid Aluminum Stylized Astronaut", explode: [0, 0.2, 0] },
    { name: "plaque", displayName: "14-Astronaut & Cosmonaut Inscribed Plaque", explode: [0.25, 0.1, 0] },
  ],
  "uv-camera": [
    { name: "barrel", displayName: "Schmidt Optical Telescope Barrel", explode: [0, 0.25, 0] },
    { name: "body", displayName: "Gold-Anodized Spectrograph Body", explode: [0, 0, 0] },
    { name: "tripod", displayName: "Tripod & Shadow-Alignment Post", explode: [0, -0.25, 0] },
    { name: "film", displayName: "Film Canister Magazine Drum", explode: [0.25, 0.1, 0] },
  ],
  "family-photo": [
    { name: "photo", displayName: "Duke Family Portrait Photograph", explode: [0, 0.15, 0] },
    { name: "wrap", displayName: "Protective Polyethylene Shrink-Wrap", explode: [0, 0.25, 0] },
    { name: "inscription", displayName: "Handwritten Astronaut Inscription", explode: [0, 0.05, 0] },
  ],
  "orange-soil": [
    { name: "soil", displayName: "Shorty Crater Pyroclastic Glass Beads", explode: [0, 0.1, 0] },
    { name: "scoop", displayName: "Trenching Core Scoop", explode: [-0.25, 0.2, 0] },
    { name: "gnomon", displayName: "Color Calibration Gnomon Rod", explode: [0.25, 0.25, 0] },
  ],
  alsep: [
    { name: "station", displayName: "Central Telemetry Station Box", explode: [0, 0, 0] },
    { name: "sunshield", displayName: "Thermal Radiator Louver Sunshield", explode: [0, 0.2, 0] },
    { name: "antenna", displayName: "Helical Data Antenna Mast", explode: [0, 0.35, 0] },
    { name: "rtg", displayName: "SNAP-27 Nuclear RTG Generator", explode: [0.4, 0.1, 0] },
  ],
  "surveyor-3": [
    { name: "frame", displayName: "Triangular Aluminum Spaceframe", explode: [0, 0, 0] },
    { name: "legs", displayName: "3 Landing Legs & Footpads", explode: [0.3, -0.2, 0] },
    { name: "camera", displayName: "Television Camera (Retrieved by Bean)", explode: [0.25, 0.2, 0] },
    { name: "mast", displayName: "Solar Panel & High-Gain Mast", explode: [0, 0.35, 0] },
    { name: "sampler", displayName: "Soil Mechanics Surface Sampler", explode: [-0.25, 0.2, 0] },
  ],
  lrv: [
    { name: "chassis", displayName: "Aluminum Spaceframe Chassis", explode: [0, 0, 0] },
    { name: "wheels", displayName: "4 Spun-Aluminum Wire Mesh Wheels", explode: [0.35, 0, 0] },
    { name: "seats", displayName: "Lawn-Chair Tubular Crew Seats", explode: [0, 0.2, 0] },
    { name: "hga", displayName: "High-Gain Umbrella Dish Antenna", explode: [0.3, 0.4, 0] },
    { name: "tv", displayName: "Color RCA Lunar TV Camera", explode: [0.3, 0.25, 0] },
  ],
  "descent-stage": [
    { name: "structure", displayName: "Octagonal Structure & Gold Kapton", explode: [0, 0.1, 0] },
    { name: "dps", displayName: "Rocketdyne DPS Engine Bell", explode: [0, -0.3, 0] },
    { name: "gear", displayName: "4 Landing Outriggers & Footpads", explode: [0.4, -0.1, 0] },
  ],
  // Mars
  "op-heat-shield": [
    { name: "aeroshell", displayName: "Charred Hexagonal PICA Aeroshell", explode: [0, 0.3, 0] },
    { name: "honeycomb", displayName: "Fractured Aluminum Honeycomb Core", explode: [0, 0.15, 0] },
    { name: "crater", displayName: "Impact Gouge & Regolith Berm", explode: [0, -0.15, 0] },
    { name: "mylar", displayName: "Dropped Gold Mylar Thermal Foil", explode: [0.3, 0.1, 0] },
  ],
  "pe-ingenuity": [
    { name: "fuselage", displayName: "Gold-Foiled Avionics Fuselage Cube", explode: [0, 0, 0] },
    { name: "rotor1", displayName: "Lower Carbon-Fiber Rotor Blade", explode: [0, 0.25, 0] },
    { name: "rotor2", displayName: "Upper Counter-Rotating Rotor Blade", explode: [0, 0.4, 0] },
    { name: "solar", displayName: "Monocrystalline Solar Panel", explode: [0, 0.55, 0] },
    { name: "legs", displayName: "4 Carbon-Composite Landing Legs", explode: [0.25, -0.2, 0] },
  ],
  "pe-sample-tubes": [
    { name: "tube1", displayName: "Hermetic Titanium Core Sample Tube", explode: [-0.2, 0.15, 0] },
    { name: "tube2", displayName: "Atmospheric Witness Sample Tube", explode: [0.2, 0.15, 0] },
    { name: "collar", displayName: "Gold Nitrile Seal Collar", explode: [0, 0.25, 0] },
    { name: "regolith", displayName: "Jezero Crater Sample Drop Bed", explode: [0, -0.1, 0] },
  ],
  "mp-sojourner": [
    { name: "chassis", displayName: "Warm Gold-Foiled Chassis Body", explode: [0, 0, 0] },
    { name: "solar", displayName: "Silicon Photovoltaic Deck", explode: [0, 0.2, 0] },
    { name: "wheels", displayName: "6 Cleated Aluminum Wheels", explode: [0.25, -0.1, 0] },
    { name: "apxs", displayName: "Rear APXS Spectrometer Sensor Head", explode: [-0.3, 0.1, 0] },
  ],
  "cu-calibration-target": [
    { name: "plate", displayName: "Anodized Aluminum Mounting Bracket", explode: [0, 0, 0] },
    { name: "chips", displayName: "4 Primary Color Calibration Chips", explode: [0, 0.1, 0] },
    { name: "gnomon", displayName: "Sundial Gnomon Shadow Post", explode: [0, 0, 0.25] },
    { name: "penny", displayName: "1909 VDB Lincoln Wheat Penny", explode: [0.2, 0, 0.1] },
  ],
  "op-blueberries": [
    { name: "bedrock", displayName: "Layered Sulfate Bedrock Outcrop", explode: [0, -0.1, 0] },
    { name: "spherules", displayName: "Hematite Concretion Spherules", explode: [0, 0.2, 0] },
  ],
  "cu-drill-holes": [
    { name: "bedrock", displayName: "Grey Lakebed Mudstone Slab", explode: [0, 0, 0] },
    { name: "hole1", displayName: "1.6 cm Precision Core Borehole #1", explode: [-0.15, 0.15, 0] },
    { name: "hole2", displayName: "1.6 cm Precision Core Borehole #2", explode: [0.15, 0.15, 0] },
    { name: "laser", displayName: "ChemCam 5-Point Laser Pits", explode: [0, 0.2, 0] },
  ],
  "cu-sky-crane": [
    { name: "tanks", displayName: "Charred Titanium Hydrazine Tanks", explode: [0.25, 0.2, 0] },
    { name: "engines", displayName: "C-DRE Canted Rocket Nozzles", explode: [0, 0.3, 0] },
    { name: "truss", displayName: "Twisted Carbon Composite Truss", explode: [-0.2, 0.15, 0] },
    { name: "impact", displayName: "High-Velocity Impact Crater Berm", explode: [0, -0.15, 0] },
  ],
  "pe-sky-crane": [
    { name: "tanks", displayName: "Charred Titanium Hydrazine Tanks", explode: [0.25, 0.2, 0] },
    { name: "engines", displayName: "C-DRE Canted Rocket Nozzles", explode: [0, 0.3, 0] },
    { name: "truss", displayName: "Twisted Carbon Composite Truss", explode: [-0.2, 0.15, 0] },
  ],
  "v1-lander-body": [
    { name: "bus", displayName: "Hexagonal Titanium Equipment Bus", explode: [0, 0.1, 0] },
    { name: "legs", displayName: "3 Shock-Strut Outrigger Legs", explode: [0.35, -0.2, 0] },
    { name: "engines", displayName: "Dual Terminal Hydrazine Thrusters", explode: [0, -0.25, 0] },
  ],
  "v1-sampler-arm": [
    { name: "boom", displayName: "3-Meter Extendable Lattice Boom", explode: [0, 0.2, 0] },
    { name: "scoop", displayName: "Motorized Backhoe Soil Scoop", explode: [0, 0.35, 0.2] },
    { name: "sieve", displayName: "Fine-Mesh Sieve Sample Chamber", explode: [0, 0.15, 0.2] },
  ],
  "v1-meteorology": [
    { name: "mast", displayName: "Deployable Vertical Sensor Mast", explode: [0, 0.25, 0] },
    { name: "anemometer", displayName: "Hot-Film Anemometer Wind Head", explode: [0, 0.45, 0] },
    { name: "sensors", displayName: "Thermocouple Temperature Sensors", explode: [0.15, 0.4, 0] },
  ],
  "v1-cameras": [
    { name: "cam1", displayName: "Facsimile Scanning Camera #1", explode: [-0.25, 0.2, 0] },
    { name: "cam2", displayName: "Facsimile Scanning Camera #2", explode: [0.25, 0.2, 0] },
    { name: "mirrors", displayName: "Protective Nodding Quartz Mirrors", explode: [0, 0.35, 0] },
  ],
  "v1-antenna": [
    { name: "dish", displayName: "1-Meter Parabolic S-Band Dish", explode: [0, 0.3, 0] },
    { name: "gimbal", displayName: "2-Axis Articulated Gimbal Mount", explode: [0, -0.15, 0] },
    { name: "feed", displayName: "Central Subreflector Feed Horn", explode: [0, 0.45, 0] },
  ],
  "v1-seismometer": [
    { name: "drum", displayName: "Seismic Vacuum Sensor Cannister", explode: [0, 0, 0] },
    { name: "dome", displayName: "Gold Thermal Protective Dome", explode: [0, 0.3, 0] },
  ],
  // Viking 2
  "v2-lander-body": [
    { name: "bus", displayName: "Hexagonal Titanium Equipment Bus", explode: [0, 0.1, 0] },
    { name: "legs", displayName: "3 Inverted Tripod Landing Struts", explode: [0.35, -0.2, 0] },
    { name: "rtg", displayName: "Dual SNAP-19 RTGs with Wind Shields", explode: [-0.3, 0.2, 0] },
  ],
  "v2-sampler-arm": [
    { name: "boom", displayName: "Telescoping Collector Boom", explode: [0, 0.2, 0] },
    { name: "scoop", displayName: "Electromechanical Backhoe Scoop", explode: [0, 0.35, 0.2] },
    { name: "badger", displayName: "Basalt Boulder ('Mr. Badger')", explode: [0.35, 0, 0] },
  ],
  "v2-seismometer": [
    { name: "sensor", displayName: "Unlocked 3-Axis Inertial Sensor", explode: [0, 0, 0] },
    { name: "cover", displayName: "Anodized Environmental Cover Dome", explode: [0, 0.3, 0] },
  ],
  "v2-meteorology": [
    { name: "mast", displayName: "Vertical Meteorology Mast", explode: [0, 0.25, 0] },
    { name: "sensor", displayName: "Hot-Film Anemometer & Thermocouple", explode: [0, 0.45, 0] },
  ],
  "v2-facsimile-camera": [
    { name: "head", displayName: "Dual Nodding Mirror Scanner Heads", explode: [0, 0.25, 0] },
    { name: "pylon", displayName: "White Magnesium Alloy Pylons", explode: [0, 0.1, 0] },
  ],
  "v2-gcms-inlet": [
    { name: "funnel", displayName: "Sample Collection Funnel & Sieve", explode: [0, 0.2, 0] },
    { name: "oven", displayName: "Miniature Pyrolysis Ovens", explode: [0, -0.1, 0] },
  ],
  // Phoenix
  "phoenix-lander-body": [
    { name: "bus", displayName: "Octagonal Deck & Hydrazine Thrusters", explode: [0, 0.15, 0] },
    { name: "legs", displayName: "3 Inverted-Tripod Footpads", explode: [0.35, -0.2, 0] },
    { name: "ssi", displayName: "Surface Stereo Imager (SSI) Mast", explode: [0, 0.4, 0] },
  ],
  "phoenix-ra-arm": [
    { name: "arm", displayName: "2.35m Articulated Carbon Arm", explode: [0, 0.25, 0] },
    { name: "rasp", displayName: "Carbide Ice-Cutting Rasp & Scoop", explode: [0.2, 0.3, 0] },
    { name: "ice", displayName: "Exposed Subsurface Water Ice Sheet", explode: [0, -0.15, 0] },
  ],
  "phoenix-tega": [
    { name: "ovens", displayName: "Bank of 8 Miniature Vacuum Ovens", explode: [0, 0, 0] },
    { name: "doors", displayName: "Motorized Sample Seal Doors", explode: [0, 0.25, 0] },
  ],
  "phoenix-meca": [
    { name: "box", displayName: "Wet Chemistry Analytical Cell Box", explode: [0, 0, 0] },
    { name: "beakers", displayName: "4 Solution Beakers & Ion Electrodes", explode: [0, 0.25, 0] },
  ],
  "phoenix-solar-wings": [
    { name: "wing1", displayName: "Port Decagonal Fan-Fold Solar Array", explode: [-0.4, 0.1, 0] },
    { name: "wing2", displayName: "Starboard Decagonal Fan-Fold Solar Array", explode: [0.4, 0.1, 0] },
  ],
  "phoenix-lidar": [
    { name: "mast", displayName: "Canadian Space Agency Weather Mast", explode: [0, 0.2, 0] },
    { name: "laser", displayName: "Green Nd:YAG Atmospheric Lidar Beam", explode: [0, 0.5, 0] },
  ],
  // InSight
  "insight-lander-body": [
    { name: "deck", displayName: "Hexagonal Composite Equipment Deck", explode: [0, 0.1, 0] },
    { name: "rise", displayName: "Twin RISE Radio Science X-Band Horns", explode: [0, 0.35, 0] },
    { name: "legs", displayName: "3 Crushable Aluminum Honeycomb Legs", explode: [0.35, -0.15, 0] },
  ],
  "insight-seis": [
    { name: "dome", displayName: "Wind & Thermal Shield (WTS) Gold Dome", explode: [0, 0.35, 0] },
    { name: "vbb", displayName: "Three-Axis Evacuated Spherical Vacuum Sensor", explode: [0, 0, 0] },
    { name: "tether", displayName: "Ribbon Umbilical Cable to Lander", explode: [-0.25, 0, 0] },
  ],
  "insight-hp3": [
    { name: "housing", displayName: "Support Structure Assembly (SSA)", explode: [0, 0.15, 0] },
    { name: "mole", displayName: "Tungsten Self-Hammering Penetrator Mole", explode: [0.2, -0.25, 0] },
    { name: "tether", displayName: "Instrumented Thermal Sensor Cable", explode: [0, 0.2, 0] },
  ],
  "insight-ultraflex": [
    { name: "array1", displayName: "Port 2.15m Circular UltraFlex Array", explode: [-0.45, 0, 0] },
    { name: "array2", displayName: "Starboard 2.15m Circular UltraFlex Array", explode: [0.45, 0, 0] },
    { name: "dust", displayName: "Accumulated Red Regolith Dust Layer", explode: [0, 0.15, 0] },
  ],
  "insight-idc-arm": [
    { name: "arm", displayName: "1.9m Articulated Carbon Composite Boom", explode: [0, 0.25, 0] },
    { name: "grapple", displayName: "Wax-Actuated Instrument Grapple Claw", explode: [0.25, 0.35, 0] },
    { name: "camera", displayName: "Instrument Deployment Camera (IDC)", explode: [0.15, 0.15, 0] },
  ],
  "insight-twins": [
    { name: "boom1", displayName: "Port Temperature & Wind Sensor Boom", explode: [-0.3, 0.2, 0] },
    { name: "boom2", displayName: "Starboard Temperature & Wind Sensor Boom", explode: [0.3, 0.2, 0] },
  ],
  "mp-base-station": [
    { name: "bus", displayName: "Central Equipment Electronics Bus", explode: [0, 0, 0] },
    { name: "petals", displayName: "3 Deployable Solar Cell Petals", explode: [0.35, 0.1, 0] },
    { name: "airbags", displayName: "Deflated Kevlar Airbag Cushions", explode: [0.25, -0.15, 0] },
  ],
  "mp-ramp": [
    { name: "tracks", displayName: "Dual Rollout Track Ramps", explode: [0, 0.2, 0] },
    { name: "hinge", displayName: "Petal Deployment Guide Interface", explode: [0, 0.05, 0] },
  ],
  "mp-imp-camera": [
    { name: "mast", displayName: "80 cm Telescoping Mast", explode: [0, 0.2, 0] },
    { name: "stereo", displayName: "Binocular Stereo Camera Optics", explode: [0, 0.4, 0] },
  ],
  "mp-barnacle-bill": [
    { name: "rock", displayName: "Faceted Andesite Volcanic Rock", explode: [0, 0, 0] },
    { name: "contact", displayName: "APXS Chemical Contact Mark", explode: [0.15, 0.15, 0.15] },
  ],
  "mp-yogi": [
    { name: "rock", displayName: "Angular Basalt Grizzly Boulder", explode: [0, 0, 0] },
    { name: "drift", displayName: "Leeward Wind-Blown Dust Tail", explode: [0.25, -0.1, 0] },
  ],
  "pe-supercam": [
    { name: "rock", displayName: "Target Basalt Rock Face", explode: [0, 0, 0] },
    { name: "plasma", displayName: "10-Pulse LIBS Laser Ablation Pits", explode: [0, 0.15, 0.15] },
  ],
  "sp-wheel-tracks": [
    { name: "left_track", displayName: "Standard Rover Wheel Tread Track", explode: [-0.2, 0, 0] },
    { name: "right_trench", displayName: "Stalled Wheel Trench (90% Silica)", explode: [0.2, 0.1, 0] },
  ],
  "sp-heat-shield": [
    { name: "backshell", displayName: "Crumpled Conical Backshell", explode: [-0.3, 0.2, 0] },
    { name: "parachute", displayName: "Striped Nylon Supersonic Chute", explode: [0.3, 0.1, 0] },
  ],
  "cu-rover": [
    { name: "chassis", displayName: "Warm Electronics Box Chassis", explode: [0, 0, 0] },
    { name: "mast", displayName: "ChemCam & Mastcam Remote Sensing Mast", explode: [0, 0.45, 0] },
    { name: "arm", displayName: "5-DOF Robotic Arm with Coring Drill", explode: [0.4, -0.2, 0] },
    { name: "rtg", displayName: "Multi-Mission Radioisotope Generator (MMRTG)", explode: [-0.4, 0.2, 0] },
    { name: "wheels", displayName: "6 Cleated Machined Aluminum Wheels", explode: [0.3, 0, 0] },
    { name: "hga", displayName: "Steerable Hexagonal High-Gain Antenna", explode: [-0.2, 0.35, 0] },
  ],
  "pe-rover": [
    { name: "chassis", displayName: "Mars 2020 Chassis & MOXIE Vent", explode: [0, 0, 0] },
    { name: "supercam", displayName: "SuperCam Laser & Mastcam-Z Zoom Mast", explode: [0, 0.45, 0] },
    { name: "arm", displayName: "Heavy Robotic Arm with SHERLOC/PIXL Turret", explode: [0.4, -0.2, 0] },
    { name: "rtg", displayName: "Nuclear MMRTG & 8 Radiator Fins", explode: [-0.4, 0.2, 0] },
    { name: "wheels", displayName: "6 Upgraded Curved-Cleat Wheels", explode: [0.3, 0, 0] },
    { name: "meda", displayName: "MEDA Environmental Wind Sensor Booms", explode: [0.2, 0.3, 0] },
  ],
  "op-rover": [
    { name: "chassis", displayName: "Warm Electronics Box & Aerogel", explode: [0, 0, 0] },
    { name: "solar", displayName: "Triangular Solar Panel Wings", explode: [0, 0.3, 0] },
    { name: "mast", displayName: "Stereo Pancam & Navcam Camera Mast", explode: [0, 0.45, 0] },
    { name: "idd", displayName: "Instrument Deployment Device (RAT & Mössbauer)", explode: [0.35, -0.15, 0] },
    { name: "wheels", displayName: "6 Rocker-Bogie Aluminum Wheels", explode: [0.25, 0, 0] },
    { name: "hga", displayName: "High-Gain Parabolic Dish Antenna", explode: [-0.25, 0.3, 0] },
  ],
  "sp-rover": [
    { name: "chassis", displayName: "Warm Electronics Box Body", explode: [0, 0, 0] },
    { name: "solar", displayName: "Dust-Coated Gusev Solar Arrays", explode: [0, 0.3, 0] },
    { name: "mast", displayName: "Pancam Mast Assembly", explode: [0, 0.45, 0] },
    { name: "jammed_wheel", displayName: "Famous Jammed Right-Front Drag Wheel", explode: [0.3, 0, -0.3] },
    { name: "trench", displayName: "Pure Opaline White Silica Drag Trench", explode: [0.3, -0.2, -0.3] },
    { name: "hga", displayName: "High-Gain Parabolic Dish Antenna", explode: [-0.25, 0.3, 0] },
  ],
  "cu-yellowknife": [
    { name: "mudstone", displayName: "Sheepbed Lakebed Mudstone Slab", explode: [0, 0, 0] },
    { name: "veins", displayName: "White Calcium Sulfate Mineral Veins", explode: [0, 0.2, 0] },
    { name: "drill", displayName: "John Klein Drill Hole & Grey Tailings", explode: [0.2, 0.25, 0] },
  ],
  "cu-mount-sharp": [
    { name: "summit", displayName: "Upper Sulfate Canyons & Yardang Peak", explode: [0, 0.35, 0] },
    { name: "hematite", displayName: "Vera Rubin Ridge Hematite Layer", explode: [0, 0.2, 0] },
    { name: "murray", displayName: "Murray Formation Stratified Mudstone", explode: [0, 0.1, 0] },
    { name: "floor", displayName: "Gale Crater Basaltic Dune Floor", explode: [0, -0.1, 0] },
  ],
  "op-eagle-crater": [
    { name: "outcrop", displayName: "Opportunity Ledge Sulfate Bedrock", explode: [0, 0.2, 0] },
    { name: "blueberries", displayName: "Embedded Hematite Spherule Concretions", explode: [0, 0.35, 0] },
    { name: "rim", displayName: "Sandy Impact Crater Slopes", explode: [0, -0.1, 0] },
  ],
  "op-marathon-valley": [
    { name: "walls", displayName: "Endeavour Crater Rim Breccia Walls", explode: [0.3, 0.15, 0] },
    { name: "clay", displayName: "Blue-Grey Smectite Clay Fracture Veins", explode: [0, 0.25, 0] },
    { name: "mound", displayName: "Spirit Mound Promontory", explode: [0, 0.35, 0] },
  ],
  "op-perseverance-valley": [
    { name: "slope", displayName: "Inner Crater Wall Slope", explode: [0, 0.1, 0] },
    { name: "gully", displayName: "Carved Fluvial Channel Gully", explode: [0, 0.25, 0] },
    { name: "stripes", displayName: "Sorted Stone Stripes & Basalt Cobbles", explode: [0.2, 0.3, 0] },
  ],
  "pe-delta": [
    { name: "kodiak", displayName: "Kodiak Butte Layered Sandstone Promontory", explode: [0, 0.35, 0] },
    { name: "scarp", displayName: "Ancient Jezero River Delta Scarp", explode: [0, 0.2, 0] },
    { name: "channel", displayName: "Neretva Vallis Inflow Channel Cut", explode: [0.25, 0.1, 0] },
    { name: "boulders", displayName: "River-Transported Rounded Cobbles", explode: [-0.2, 0.4, 0] },
  ],
  "sp-columbia-hills": [
    { name: "summit", displayName: "Husband Hill Rocky Summit Massif", explode: [0, 0.25, 0] },
    { name: "outcrop", displayName: "Layered Olivine-Rich Volcanic Slabs", explode: [0, 0.4, 0] },
    { name: "ventifacts", displayName: "Wind-Sculpted Basalt Ventifacts", explode: [0.25, 0.35, 0] },
  ],
  "sp-home-plate": [
    { name: "tuff", displayName: "Plateau of Layered Volcanic Ash Tuff", explode: [0, 0.15, 0] },
    { name: "bomb_sag", displayName: "Volcanic Bomb Sag Impact Depression", explode: [-0.25, 0.3, 0] },
    { name: "silica", displayName: "Knobby Opaline Silica Hot-Spring Mounds", explode: [0.3, 0.35, 0] },
  ],
  "sp-bonneville": [
    { name: "ejecta", displayName: "Sharp Basalt Ejecta Blocks", explode: [0, 0.35, 0] },
    { name: "rim", displayName: "200m Impact Crater Ejecta Berm", explode: [0, 0.15, 0] },
    { name: "tracks", displayName: "Spirit Dual Rover Tracks on Rim Crest", explode: [0, 0.25, 0] },
  ],
};
