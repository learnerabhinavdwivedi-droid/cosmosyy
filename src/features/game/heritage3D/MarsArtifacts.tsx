/**
 * Mars Heritage Artifacts — Facade Re-exporting from Compartmentalized Mission Modules
 */
export type { ArtifactProps } from "./missions/shared";
export { MarsLandscapeFeature3D } from "./missions/shared";
export {
  CuriosityRover3D,
  MarsDrillHoles3D,
  MarsCalibrationTarget3D,
  SkyCraneDescentStage3D,
  YellowknifeBayFeature3D,
  MountSharpFeature3D,
} from "./missions/marsCuriosity";
export {
  OpportunityRover3D,
  MarsBlueberries3D,
  MarsHeatShield3D,
  EagleCraterFeature3D,
  MarathonValleyFeature3D,
  PerseveranceValleyFeature3D,
} from "./missions/marsOpportunity";
export {
  SojournerRover3D,
  PathfinderBaseStation3D,
  MarsDeploymentRamp3D,
  IMPCameraMast3D,
  BarnacleBillRock3D,
  YogiRock3D,
} from "./missions/marsPathfinder";
export {
  PerseveranceRover3D,
  IngenuityHelicopter3D,
  MarsSampleTubes3D,
  SuperCamLaserMarks3D,
  JezeroDeltaFeature3D,
} from "./missions/marsPerseverance";
export {
  SpiritRover3D,
  RoverWheelTracks3D,
  BackshellParachute3D,
  ColumbiaHillsFeature3D,
  HomePlateFeature3D,
  BonnevilleCraterFeature3D,
} from "./missions/marsSpirit";
export {
  VikingLanderBody3D,
  VikingSamplerArm3D,
  VikingMeteorology3D,
  VikingFacsimileCameras3D,
  VikingAntenna3D,
  VikingSeismometer3D,
} from "./missions/marsViking1";
export {
  Viking2LanderBody3D,
  Viking2SamplerArm3D,
  Viking2Seismometer3D,
  Viking2Meteorology3D,
  Viking2FacsimileCameras3D,
  Viking2GCMSInlet3D,
} from "./missions/marsViking2";
export {
  PhoenixLanderBody3D,
  PhoenixRoboticArm3D,
  PhoenixTEGA3D,
  PhoenixMECA3D,
  PhoenixSolarWings3D,
  PhoenixLidarStation3D,
} from "./missions/marsPhoenix";
export {
  InSightLanderBody3D,
  InSightSEIS3D,
  InSightHP3Mole3D,
  InSightUltraFlexArrays3D,
  InSightIDCArm3D,
  InSightTWINS3D,
} from "./missions/marsInsight";
