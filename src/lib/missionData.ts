import apollo11 from "../../content/missions/apollo-11.json";
import apollo12 from "../../content/missions/apollo-12.json";
import apollo14 from "../../content/missions/apollo-14.json";
import apollo15 from "../../content/missions/apollo-15.json";
import apollo16 from "../../content/missions/apollo-16.json";
import apollo17 from "../../content/missions/apollo-17.json";

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
}

export interface MissionSpec {
  id: string;
  name: string;
  site: string;
  date: string;
  evaSunTime: string;
  crew: MissionCrew;
  lm?: string;
  cm?: string;
  landing: { lat: number; lon: number; label: string };
  terrain: { model: string | null; ortho: string | null };
  objects: HeritageObject[];
}

const RAW: Record<string, unknown> = {
  "apollo-11": apollo11,
  "apollo-12": apollo12,
  "apollo-14": apollo14,
  "apollo-15": apollo15,
  "apollo-16": apollo16,
  "apollo-17": apollo17,
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
  }));
  return {
    id: r.id as string,
    name: r.name as string,
    site: r.site as string,
    date: r.date as string,
    evaSunTime: r.evaSunTime as string,
    crew,
    lm: (r.lm as string) ?? undefined,
    cm: (r.cm as string) ?? undefined,
    landing,
    terrain,
    objects,
  };
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
  try { return getMission(id); } catch { return null; }
}
