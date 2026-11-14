/// <reference types="vite/client" />
import { z } from "zod";

export const FactStatusSchema = z.enum([
  "verified",
  "from-repo",
  "general-science",
  "unverified",
]);

export const StoryFactSchema = z.object({
  id: z.string(),
  text: z.string(),
  source: z.string().optional(),
  status: FactStatusSchema,
});

export const StoryBeatSchema = z.enum([
  "identity",
  "design",
  "how-it-worked",
  "evidence",
  "fate",
  "legacy",
]);

export const CameraKeyframeSchema = z.object({
  pos: z.tuple([z.number(), z.number(), z.number()]),
  look: z.tuple([z.number(), z.number(), z.number()]),
});

export const StorySceneSchema = z.object({
  id: z.string(),
  beat: StoryBeatSchema,
  action: z.string(),
  camera: CameraKeyframeSchema,
  factIds: z.array(z.string()).min(1),
  kids: z.string(),
  explorer: z.string(),
  audio: z.object({
    kids: z.string().nullable().optional(),
    explorer: z.string().nullable().optional(),
  }),
  hindi: z
    .object({
      kids: z.string(),
      explorer: z.string(),
    })
    .optional(),
});

export const StoryPacketSchema = z.object({
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

export type StoryPacket = z.infer<typeof StoryPacketSchema>;
export type ObjectStoryPacket = StoryPacket;
export type StoryScene = z.infer<typeof StorySceneSchema>;
export type StoryFact = z.infer<typeof StoryFactSchema>;
export type StoryBeat = z.infer<typeof StoryBeatSchema>;
export type FactStatus = z.infer<typeof FactStatusSchema>;

// Dynamic Vite-powered registry of all bundled story packets
const storyModules = import.meta.glob<{ default: unknown }>(
  "../../../content/stories/**/*.story.json",
  { eager: true }
);

const STORY_REGISTRY: Record<string, Record<string, StoryPacket>> = {};

for (const [modPath, mod] of Object.entries(storyModules)) {
  const normalizedPath = modPath.replace(/\\/g, "/");
  const match = normalizedPath.match(/content\/stories\/([^/]+)\/([^/]+)\.story\.json$/);
  if (match && match[1] && match[2]) {
    const missionId = match[1];
    const objectId = match[2];
    const raw = (mod as { default?: unknown }).default ?? mod;
    const parsed = StoryPacketSchema.safeParse(raw);
    if (parsed.success) {
      if (!STORY_REGISTRY[missionId]) {
        STORY_REGISTRY[missionId] = {};
      }
      STORY_REGISTRY[missionId][objectId] = parsed.data;
    } else {
      console.error(`Invalid story packet at ${modPath}:`, parsed.error);
    }
  }
}

export function hasStoryPacket(missionId: string, objectId: string): boolean {
  return Boolean(STORY_REGISTRY[missionId]?.[objectId]);
}

export function getStoryPacket(missionId: string, objectId: string): StoryPacket | null {
  return STORY_REGISTRY[missionId]?.[objectId] ?? null;
}

export function getAllStoryPackets(): StoryPacket[] {
  const all: StoryPacket[] = [];
  for (const missionPackets of Object.values(STORY_REGISTRY)) {
    all.push(...Object.values(missionPackets));
  }
  return all;
}
