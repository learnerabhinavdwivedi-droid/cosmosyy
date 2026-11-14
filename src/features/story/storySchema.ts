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

// Static registry of bundled story packets
import swcStory from "../../../content/stories/apollo-11/swc.story.json";

const STORY_REGISTRY: Record<string, Record<string, unknown>> = {
  "apollo-11": {
    swc: swcStory,
  },
};

export function hasStoryPacket(missionId: string, objectId: string): boolean {
  return Boolean(STORY_REGISTRY[missionId]?.[objectId]);
}

export function getStoryPacket(missionId: string, objectId: string): StoryPacket | null {
  const raw = STORY_REGISTRY[missionId]?.[objectId];
  if (!raw) return null;

  const result = StoryPacketSchema.safeParse(raw);
  if (!result.success) {
    console.error(`Invalid story packet for ${missionId}/${objectId}:`, result.error);
    return null;
  }

  const packet = result.data;

  // Validate that every scene's factIds exist in facts
  const factMap = new Map(packet.facts.map((f) => [f.id, f]));
  for (const scene of packet.scenes) {
    const sceneFacts = scene.factIds.map((id) => factMap.get(id)).filter(Boolean);
    const allUnverified = sceneFacts.every((f) => f?.status === "unverified");

    if (allUnverified) {
      if (import.meta.env.PROD) {
        throw new Error(
          `Production build rejected: Scene ${scene.id} in ${missionId}/${objectId} relies exclusively on unverified facts.`,
        );
      } else {
        console.warn(
          `[DEV REVIEW FLAG] Scene ${scene.id} in ${missionId}/${objectId} has unverified facts.`,
        );
      }
    }
  }

  return packet;
}
