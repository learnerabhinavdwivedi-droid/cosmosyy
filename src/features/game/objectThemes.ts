export interface ObjectTheme {
  primary: string;
  primaryDim: string;
  border: string;
  glow: string;
  category: string;
  iconType: "spacecraft" | "science" | "rover" | "memorial" | "equipment" | "geological" | "helicopter";
}

export type ThemeName = "spacecraft" | "science" | "rover" | "memorial" | "equipment" | "geological" | "helicopter";

const T: Record<ThemeName, ObjectTheme> = {
  spacecraft: {
    primary: "#A8C4D8",
    primaryDim: "rgba(168,196,216,0.12)",
    border: "rgba(168,196,216,0.35)",
    glow: "rgba(168,196,216,0.5)",
    category: "SPACECRAFT",
    iconType: "spacecraft",
  },
  science: {
    primary: "#00D4FF",
    primaryDim: "rgba(0,212,255,0.12)",
    border: "rgba(0,212,255,0.35)",
    glow: "rgba(0,212,255,0.5)",
    category: "SCIENCE INSTRUMENT",
    iconType: "science",
  },
  rover: {
    primary: "#FFB300",
    primaryDim: "rgba(255,179,0,0.12)",
    border: "rgba(255,179,0,0.35)",
    glow: "rgba(255,179,0,0.5)",
    category: "ROVER",
    iconType: "rover",
  },
  memorial: {
    primary: "#FF6B6B",
    primaryDim: "rgba(255,107,107,0.12)",
    border: "rgba(255,107,107,0.35)",
    glow: "rgba(255,107,107,0.5)",
    category: "MEMORIAL",
    iconType: "memorial",
  },
  equipment: {
    primary: "#B388FF",
    primaryDim: "rgba(179,136,255,0.12)",
    border: "rgba(179,136,255,0.35)",
    glow: "rgba(179,136,255,0.5)",
    category: "EQUIPMENT",
    iconType: "equipment",
  },
  geological: {
    primary: "#E8A050",
    primaryDim: "rgba(232,160,80,0.12)",
    border: "rgba(232,160,80,0.35)",
    glow: "rgba(232,160,80,0.5)",
    category: "GEOLOGICAL SITE",
    iconType: "geological",
  },
  helicopter: {
    primary: "#FF6B2C",
    primaryDim: "rgba(255,107,44,0.12)",
    border: "rgba(255,107,44,0.35)",
    glow: "rgba(255,107,44,0.5)",
    category: "ROTORCRAFT",
    iconType: "helicopter",
  },
};

export function getObjectTheme(objectId: string): ObjectTheme {
  if (
    objectId.includes("descent") ||
    objectId.includes("sky-crane") ||
    objectId.includes("lander") ||
    objectId.includes("base-station") ||
    objectId.includes("surveyor")
  )
    return T.spacecraft;

  if (
    objectId.includes("lrrr") ||
    objectId.includes("psep") ||
    objectId.includes("alsep") ||
    objectId.includes("seismo") ||
    objectId.includes("meteorol") ||
    objectId.includes("sampler") ||
    objectId.includes("swc")
  )
    return T.science;

  if (objectId.includes("ingenuity")) return T.helicopter;

  if (
    objectId.includes("lrv") ||
    objectId.includes("rover") ||
    objectId.includes("sojourner") ||
    objectId.includes("met")
  )
    return T.rover;

  if (
    objectId.includes("flag") ||
    objectId.includes("fallen") ||
    objectId.includes("family") ||
    objectId.includes("golf")
  )
    return T.memorial;

  if (
    objectId.includes("camera") ||
    objectId.includes("antenna") ||
    objectId.includes("mesa") ||
    objectId.includes("hand-tool") ||
    objectId.includes("ramp") ||
    objectId.includes("calibration") ||
    objectId.includes("supercam") ||
    objectId.includes("sample") ||
    objectId.includes("imp-") ||
    objectId.includes("uv-") ||
    objectId.includes("s-band") ||
    objectId.includes("tv-")
  )
    return T.equipment;

  if (
    objectId.includes("crater") ||
    objectId.includes("valley") ||
    objectId.includes("hills") ||
    objectId.includes("plate") ||
    objectId.includes("track") ||
    objectId.includes("soil") ||
    objectId.includes("drill") ||
    objectId.includes("mount") ||
    objectId.includes("blueberr") ||
    objectId.includes("shield") ||
    objectId.includes("bonneville") ||
    objectId.includes("barnacle") ||
    objectId.includes("yogi") ||
    objectId.includes("delta") ||
    objectId.includes("orange") ||
    objectId.includes("yellowknife")
  )
    return T.geological;

  return T.science;
}

export function getThemeColor3(objectId: string): string {
  return getObjectTheme(objectId).primary;
}
