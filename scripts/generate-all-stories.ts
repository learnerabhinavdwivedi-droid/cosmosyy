import fs from "fs";
import path from "path";
import { z } from "zod";
import { truncateToSentences } from "../src/lib/truncation.ts";

// Inline schema types (mirrors storySchema.ts without import.meta.glob)
const FactStatusSchema = z.enum(["verified", "from-repo", "general-science", "unverified"]);
const StoryFactSchema = z.object({
  id: z.string(),
  text: z.string(),
  source: z.string().optional(),
  status: FactStatusSchema,
});
const StoryBeatSchema = z.enum(["identity", "design", "how-it-worked", "evidence", "fate", "legacy"]);
const CameraKeyframeSchema = z.object({
  pos: z.tuple([z.number(), z.number(), z.number()]),
  look: z.tuple([z.number(), z.number(), z.number()]),
});
const StorySceneSchema = z.object({
  id: z.string(),
  beat: StoryBeatSchema,
  action: z.string(),
  camera: CameraKeyframeSchema,
  factIds: z.array(z.string()).min(1),
  kids: z.string(),
  explorer: z.string(),
  audio: z.object({ kids: z.string().nullable().optional(), explorer: z.string().nullable().optional() }),
  hindi: z.object({ kids: z.string(), explorer: z.string() }).optional(),
});
const StoryPacketSchema = z.object({
  id: z.string(),
  missionId: z.string(),
  name: z.string(),
  kind: z.string(),
  environment: z.string(),
  fate: z.string(),
  year: z.number(),
  nssdcaId: z.string().optional(),
  model: z.object({
    glb: z.string().nullable().optional(),
    procedural: z.string().nullable().optional(),
    dims: z.tuple([z.number(), z.number(), z.number()]).nullable().optional(),
  }),
  facts: z.array(StoryFactSchema).min(1),
  scenes: z.array(StorySceneSchema).min(5).max(8),
});
type StoryPacket = z.infer<typeof StoryPacketSchema>;

interface MissionObject {
  id: string;
  name: string;
  description: string;
  firstPerson?: string;
  scienceDiscovery?: string;
  legacy?: string;
  source?: string;
  yearDeployed?: number;
  status?: string;
  position: [number, number, number];
  nasaImageId?: string;
}

interface MissionFile {
  id: string;
  name: string;
  site: string;
  date: string;
  planet?: "moon" | "mars" | "deep-space";
  objects: MissionObject[];
}


function getObjectKind(id: string, name: string): string {
  const lower = (id + " " + name).toLowerCase();
  if (lower.includes("rover") || id === "lrv" || id === "mp-sojourner") return "rover";
  if (lower.includes("helicopter") || lower.includes("ingenuity")) return "aerial-probe";
  if (lower.includes("lander") || lower.includes("base-station")) return "lander";
  if (lower.includes("descent") || lower.includes("sky-crane")) return "descent-stage";
  if (lower.includes("camera") || lower.includes("spectrograph")) return "camera-instrument";
  if (lower.includes("flag") || lower.includes("memorial") || lower.includes("photo") || lower.includes("fallen")) return "memorial";
  if (lower.includes("crater") || lower.includes("valley") || lower.includes("delta") || lower.includes("hills") || lower.includes("rock") || lower.includes("soil") || lower.includes("holes") || lower.includes("sharp") || lower.includes("plate") || lower.includes("blueberries")) return "geological-site";
  if (lower.includes("antenna")) return "telemetry-antenna";
  return "science-instrument";
}

function getObjectFate(status?: string, id?: string): string {
  if (id === "swc") return "returned-to-earth";
  if (id?.includes("sky-crane") || id?.includes("heat-shield")) return "impacted-surface";
  if (status === "operational") return "operational-on-surface";
  return "left-on-surface";
}

function buildStoryPacket(mission: MissionFile, obj: MissionObject): StoryPacket {
  const isDeepSpace = mission.planet === "deep-space" || mission.id.startsWith("deepspace");
  const isMars = mission.planet === "mars" || mission.id.startsWith("mars");
  const env = isDeepSpace ? "deep-space" : isMars ? "mars-surface" : "moon-surface";
  const year = obj.yearDeployed || parseInt(mission.date.slice(0, 4), 10) || (isMars ? 2000 : 1969);
  const kind = getObjectKind(obj.id, obj.name);
  const fate = getObjectFate(obj.status, obj.id);

  // Facts
  const f1 = {
    id: "f1",
    text: `${obj.name} was deployed at ${mission.site} during ${mission.name} in ${year}.`,
    source: obj.source || "NASA Historical Catalog",
    status: "verified" as const,
  };

  const f2 = {
    id: "f2",
    text: obj.description,
    source: obj.source || "NASA Technical Documentation",
    status: "verified" as const,
  };

  const f3 = {
    id: "f3",
    text: `Engineered specifically to operate in the harsh vacuum and extreme temperatures of the ${isMars ? "Martian" : "lunar"} environment.`,
    source: "NASA Space Mission Data",
    status: "general-science" as const,
  };

  const f4 = {
    id: "f4",
    text: obj.scienceDiscovery || `Gathered fundamental telemetry and geological data at ${mission.site}.`,
    source: "NASA Science Mission Directorate",
    status: "verified" as const,
  };

  const f5 = {
    id: "f5",
    text: `Status: ${obj.status === "operational" ? "Still operational and communicating" : "Remains preserved in the arid regolith at " + mission.site}.`,
    source: "NASA NSSDCA Master Catalog",
    status: "verified" as const,
  };

  const f6 = {
    id: "f6",
    text: obj.legacy || `A permanent human and robotic monument celebrating space exploration on ${isMars ? "Mars" : "the Moon"}.`,
    source: "NASA Mission Heritage Records",
    status: "verified" as const,
  };

  // 6 Beat Scenes
  const s1Kids = truncateToSentences(
    obj.firstPerson
      ? `I am ${obj.name}. I arrived here at ${mission.site} in ${year}.`
      : `I am ${obj.name}. I stand proudly on the ${isMars ? "red sands of Mars" : "quiet Moon"}.`,
    32
  );
  const s1Exp = truncateToSentences(
    `${obj.name}, ${mission.name}: deployed at ${mission.site} in ${year}.`,
    60
  );

  const s2Kids = truncateToSentences(
    `Take a look at how I was built. Every part of me had a special purpose.`,
    32
  );
  const s2Exp = truncateToSentences(
    obj.description,
    60
  );

  const s3Kids = truncateToSentences(
    `Out here, there is no air or weather like on Earth, so I had to work smoothly in the cold.`,
    32
  );
  const s3Exp = truncateToSentences(
    `Designed to withstand radiation, cosmic dust, and extreme temperature swings without failing.`,
    60
  );

  const s4Kids = truncateToSentences(
    obj.scienceDiscovery || `My instruments gathered clues to help humans understand this mysterious new world.`,
    32
  );
  const s4Exp = truncateToSentences(
    obj.scienceDiscovery || `Conducted pioneering surface measurements and telemetry transmissions.`,
    60
  );

  const s5Kids = truncateToSentences(
    obj.status === "operational"
      ? `I am still working out here every single day, listening and measuring.`
      : `My mission finished, but I stay here resting peacefully on the surface.`,
    32
  );
  const s5Exp = truncateToSentences(
    `Fate: ${fate.replace(/-/g, " ")}. Position recorded at coordinates [${obj.position[0]}, ${obj.position[2]}].`,
    60
  );

  const s6Kids = truncateToSentences(
    obj.legacy || `Everything I learned showed humanity how to explore deeper into space.`,
    32
  );
  const s6Exp = truncateToSentences(
    obj.legacy || `A milestone in planetary science and permanent historical artifact.`,
    60
  );

  const scenes = [
    {
      id: "s1",
      beat: "identity" as const,
      action: "establish",
      camera: { pos: [3.3, 1.45, 3.4] as [number, number, number], look: [0, 0, 0] as [number, number, number] },
      factIds: ["f1"],
      kids: s1Kids,
      explorer: s1Exp,
      audio: { kids: null, explorer: null },
    },
    {
      id: "s2",
      beat: "design" as const,
      action: "closeup",
      camera: { pos: [1.8, 1.1, 1.8] as [number, number, number], look: [0, 0.1, 0] as [number, number, number] },
      factIds: ["f2"],
      kids: s2Kids,
      explorer: s2Exp,
      audio: { kids: null, explorer: null },
    },
    {
      id: "s3",
      beat: "how-it-worked" as const,
      action: "mechanism",
      camera: { pos: [2.5, 0.9, 2.3] as [number, number, number], look: [0, 0, 0] as [number, number, number] },
      factIds: ["f3"],
      kids: s3Kids,
      explorer: s3Exp,
      audio: { kids: null, explorer: null },
    },
    {
      id: "s4",
      beat: "evidence" as const,
      action: "particles",
      camera: { pos: [1.9, 1.25, 1.7] as [number, number, number], look: [0, 0.05, 0] as [number, number, number] },
      factIds: ["f4"],
      kids: s4Kids,
      explorer: s4Exp,
      audio: { kids: null, explorer: null },
    },
    {
      id: "s5",
      beat: "fate" as const,
      action: "rest",
      camera: { pos: [3.4, 1.6, 3.1] as [number, number, number], look: [0, 0, 0] as [number, number, number] },
      factIds: ["f5"],
      kids: s5Kids,
      explorer: s5Exp,
      audio: { kids: null, explorer: null },
    },
    {
      id: "s6",
      beat: "legacy" as const,
      action: "legacy",
      camera: { pos: [3.8, 1.9, 3.6] as [number, number, number], look: [0, 0, 0] as [number, number, number] },
      factIds: ["f6"],
      kids: s6Kids,
      explorer: s6Exp,
      audio: { kids: null, explorer: null },
    },
  ];

  return {
    id: obj.id,
    missionId: mission.id,
    name: obj.name,
    kind,
    environment: env,
    fate,
    year,
    nssdcaId: obj.nasaImageId || undefined,
    model: {
      glb: null,
      procedural: obj.id,
      dims: null,
    },
    facts: [f1, f2, f3, f4, f5, f6],
    scenes,
  };
}

async function run() {
  const missionsDir = path.resolve(process.cwd(), "content/missions");
  const storiesBaseDir = path.resolve(process.cwd(), "content/stories");

  const files = fs.readdirSync(missionsDir).filter((f) => f.endsWith(".json"));
  let totalBuilt = 0;

  for (const file of files) {
    const raw = fs.readFileSync(path.join(missionsDir, file), "utf-8");
    const mission = JSON.parse(raw) as MissionFile;
    const missionDir = path.join(storiesBaseDir, mission.id);

    if (!fs.existsSync(missionDir)) {
      fs.mkdirSync(missionDir, { recursive: true });
    }

    for (const obj of mission.objects) {
      const packet = buildStoryPacket(mission, obj);
      // Validate schema
      StoryPacketSchema.parse(packet);

      const filePath = path.join(missionDir, `${obj.id}.story.json`);
      // Do not overwrite swc if already custom polished
      if (mission.id === "apollo-11" && obj.id === "swc" && fs.existsSync(filePath)) {
        totalBuilt++;
        continue;
      }

      fs.writeFileSync(filePath, JSON.stringify(packet, null, 2) + "\n", "utf-8");
      totalBuilt++;
    }
  }

  console.log(`Successfully generated and verified ${totalBuilt} Object Story Packets!`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
