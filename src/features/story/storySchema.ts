/// <reference types="vite/client" />
export * from "./storyTypes";
import { StoryPacketSchema, type StoryPacket } from "./storyTypes";

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
