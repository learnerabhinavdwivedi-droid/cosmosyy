import apollo11 from "../../content/missions/apollo-11.json";
import apollo12 from "../../content/missions/apollo-12.json";
import apollo14 from "../../content/missions/apollo-14.json";
import apollo15 from "../../content/missions/apollo-15.json";
import apollo16 from "../../content/missions/apollo-16.json";
import apollo17 from "../../content/missions/apollo-17.json";
import marsViking1 from "../../content/missions/mars-viking1.json";
import marsPathfinder from "../../content/missions/mars-pathfinder.json";
import marsSpirit from "../../content/missions/mars-spirit.json";
import marsOpportunity from "../../content/missions/mars-opportunity.json";
import marsCuriosity from "../../content/missions/mars-curiosity.json";
import marsPerseverance from "../../content/missions/mars-perseverance.json";
import deepDawn from "../../content/missions/deep-dawn.json";
import deepNear from "../../content/missions/deep-near.json";
import deepVoyager from "../../content/missions/deep-voyager.json";
import deepKepler from "../../content/missions/deep-kepler.json";

export type Planet = "moon" | "mars" | "deep-space";

export interface MissionCrew {
  commander: string;
  lmp: string;
  cmp: string;
}

export interface HeritageObject {
  id: string;
  name: string;
  position: [number, number, number];
  description: string;
  xp: number;
  source?: string;
  hidden?: boolean;
  whySent?: string;
  scienceDiscovery?: string;
  ongoingScience?: string;
  hardwareType?:
    | "surface-lander"
    | "rover"
    | "orbiter"
    | "deep-space-probe"
    | "passive-reflector"
    | "scientific-package";
  legacy?: string;
  status?: "operational" | "dormant" | "defunct" | "cruising";
  firstPerson?: string;
  yearDeployed?: number;
  yearLastContact?: number;
  nasaImageId?: string;
}

export interface MissionTimeline {
  launch: string;
  landing: string;
  lastContact?: string;
  endOfMission?: string;
}

export interface MissionSpec {
  id: string;
  planet: Planet;
  name: string;
  site: string;
  date: string;
  evaSunTime: string;
  crew: MissionCrew;
  missionType?: "crewed" | "robotic";
  operator?: string;
  lm?: string;
  cm?: string;
  landing: { lat: number; lon: number; label: string };
  terrain: { model: string | null; ortho: string | null };
  objects: HeritageObject[];
  keyDiscovery?: string;
  missionLegacy?: string;
  funFact?: string;
  heritageNote?: string;
  timeline?: MissionTimeline;
}

const RAW: Record<string, unknown> = {
  "apollo-11": apollo11,
  "apollo-12": apollo12,
  "apollo-14": apollo14,
  "apollo-15": apollo15,
  "apollo-16": apollo16,
  "apollo-17": apollo17,
  "mars-viking1": marsViking1,
  "mars-pathfinder": marsPathfinder,
  "mars-spirit": marsSpirit,
  "mars-opportunity": marsOpportunity,
  "mars-curiosity": marsCuriosity,
  "mars-perseverance": marsPerseverance,
  "deep-dawn": deepDawn,
  "deep-near": deepNear,
  "deep-voyager": deepVoyager,
  "deep-kepler": deepKepler,
};

function parse(raw: unknown): MissionSpec {
  const r = raw as Record<string, unknown>;
  const crew = r.crew as MissionCrew;
  const landing = r.landing as { lat: number; lon: number; label: string };
  const terrain = r.terrain as { model: string | null; ortho: string | null };
  const objects = (r.objects as Array<Record<string, unknown>>).map((o) => ({
    id: o.id as string,
    name: o.name as string,
    position: o.position as [number, number, number],
    description: o.description as string,
    xp: (o.xp as number) ?? 50,
    source: (o.source as string) ?? undefined,
    hidden: (o.hidden as boolean) ?? undefined,
    whySent: (o.whySent as string) ?? undefined,
    scienceDiscovery: (o.scienceDiscovery as string) ?? undefined,
    ongoingScience: (o.ongoingScience as string) ?? undefined,
    hardwareType: (o.hardwareType as HeritageObject["hardwareType"]) ?? undefined,
    legacy: (o.legacy as string) ?? undefined,
    status: (o.status as HeritageObject["status"]) ?? undefined,
    firstPerson: (o.firstPerson as string) ?? undefined,
    yearDeployed: (o.yearDeployed as number) ?? undefined,
    yearLastContact: (o.yearLastContact as number) ?? undefined,
    nasaImageId: (o.nasaImageId as string) ?? undefined,
  }));
  return {
    id: r.id as string,
    planet: (r.planet as Planet) ?? "moon",
    name: r.name as string,
    site: r.site as string,
    date: r.date as string,
    evaSunTime: r.evaSunTime as string,
    crew,
    missionType: (r.missionType as "crewed" | "robotic") ?? "crewed",
    operator: (r.operator as string) ?? undefined,
    lm: (r.lm as string) ?? undefined,
    cm: (r.cm as string) ?? undefined,
    landing,
    terrain,
    objects,
    keyDiscovery: (r.keyDiscovery as string) ?? undefined,
    missionLegacy: (r.missionLegacy as string) ?? undefined,
    funFact: (r.funFact as string) ?? undefined,
    heritageNote: (r.heritageNote as string) ?? undefined,
    timeline: (r.timeline as MissionTimeline) ?? undefined,
  };
}

export function getPlanet(missionId: string): Planet {
  const raw = RAW[missionId];
  if (!raw) return "moon";
  return ((raw as Record<string, unknown>).planet as Planet) ?? "moon";
}

const CACHE = new Map<string, MissionSpec>();

export function getMission(id: string): MissionSpec {
  let spec = CACHE.get(id);
  if (spec) return spec;
  const raw = RAW[id];
  if (!raw) throw new Error(`Unknown mission: ${id}`);
  spec = parse(raw);
  CACHE.set(id, spec);
  return spec;
}

export function getMissionOrNull(id: string | null): MissionSpec | null {
  if (!id) return null;
  try {
    return getMission(id);
  } catch {
    return null;
  }
}
