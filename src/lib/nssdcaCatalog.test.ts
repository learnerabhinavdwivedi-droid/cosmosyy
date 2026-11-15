import { describe, it, expect } from "vitest";
import { CATALOG_DATA, getNssdcCatalog } from "./nssdcaCatalog";
import fs from "fs";
import path from "path";

interface MissionObject {
  id: string;
  name: string;
}

interface MissionFile {
  id: string;
  name: string;
  objects: MissionObject[];
}

describe("NASA NSSDCA Master Catalog 100% Coverage", () => {
  const missionsDir = path.resolve(process.cwd(), "content/missions");
  const missionFiles = fs.readdirSync(missionsDir).filter((f) => f.endsWith(".json"));

  it("indexes all 20 mission files in the repository", () => {
    expect(missionFiles.length).toBe(20);
    for (const file of missionFiles) {
      const raw = fs.readFileSync(path.join(missionsDir, file), "utf-8");
      const mission: MissionFile = JSON.parse(raw);
      expect(CATALOG_DATA[mission.id], `Missing mission ${mission.id} in CATALOG_DATA`).toBeDefined();
    }
  });

  it("provides 100% catalog coverage for every object across all 20 missions without fallback", () => {
    let totalObjects = 0;

    for (const file of missionFiles) {
      const raw = fs.readFileSync(path.join(missionsDir, file), "utf-8");
      const mission: MissionFile = JSON.parse(raw);

      for (const obj of mission.objects) {
        totalObjects++;
        // Direct catalog entry check
        const direct = CATALOG_DATA[mission.id]?.[obj.id];
        expect(
          direct,
          `Direct NSSDCA entry missing for mission: "${mission.id}", object: "${obj.id}"`
        ).toBeDefined();

        const entry = getNssdcCatalog(mission.id, obj.id);
        expect(entry).toBeDefined();
        expect(entry.nssdcaId).toBeTruthy();
        expect(entry.catalogUrl).toMatch(/^https:\/\/nssdc\.gsfc\.nasa\.gov\//);
        expect(entry.officialDesignation).toBeTruthy();
        expect(entry.archetype).toBeTruthy();
        expect(entry.funFactKid).toBeTruthy();
      }
    }

    expect(totalObjects).toBe(113);
  });
});
