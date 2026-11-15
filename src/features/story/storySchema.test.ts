import { describe, it, expect } from "vitest";
import {
  StoryPacketSchema,
  getStoryPacket,
  hasStoryPacket,
  getAllStoryPackets,
} from "./storySchema";
import swcJson from "../../../content/stories/apollo-11/swc.story.json";

describe("storySchema", () => {
  it("validates Apollo 11 SWC story packet cleanly", () => {
    const result = StoryPacketSchema.safeParse(swcJson);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("swc");
      expect(result.data.scenes.length).toBe(6);
      expect(result.data.facts.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("registry retrieves SWC story packet correctly", () => {
    expect(hasStoryPacket("apollo-11", "swc")).toBe(true);
    expect(hasStoryPacket("apollo-11", "non-existent")).toBe(false);

    const packet = getStoryPacket("apollo-11", "swc");
    expect(packet).not.toBeNull();
    expect(packet?.name).toBe("Solar Wind Composition Experiment");
  });

  it("registry loads all Object Story Packets across all missions", () => {
    const all = getAllStoryPackets();
    expect(all.length).toBeGreaterThanOrEqual(110);

    for (const packet of all) {
      expect(packet.scenes.length).toBeGreaterThanOrEqual(5);
      expect(packet.scenes.length).toBeLessThanOrEqual(8);
      expect(packet.facts.length).toBeGreaterThanOrEqual(1);
      expect(hasStoryPacket(packet.missionId, packet.id)).toBe(true);
    }
  });

  it("rejects packet with fewer than 5 scenes", () => {
    const invalid = {
      ...swcJson,
      scenes: swcJson.scenes.slice(0, 3),
    };
    const result = StoryPacketSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
