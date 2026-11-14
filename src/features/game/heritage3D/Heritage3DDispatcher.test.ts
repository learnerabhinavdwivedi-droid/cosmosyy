import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";
import {
  hasDedicated3DModel,
  getDedicatedComponents,
} from "./Heritage3DDispatcher";

describe("Heritage3DDispatcher Coverage", () => {
  const missionsDir = resolve(process.cwd(), "content/missions");
  const files = readdirSync(missionsDir).filter((f) => f.endsWith(".json"));

  it("should have at least 12 mission configuration files", () => {
    expect(files.length).toBeGreaterThanOrEqual(12);
  });

  files.forEach((file) => {
    const raw = readFileSync(resolve(missionsDir, file), "utf-8");
    const mission = JSON.parse(raw);

    describe(`Mission: ${mission.id} (${mission.name})`, () => {
      mission.objects.forEach((obj: { id: string; name: string }) => {
        it(`object '${obj.id}' (${obj.name}) has an authentic dedicated 3D model`, () => {
          expect(hasDedicated3DModel(mission.id, obj.id)).toBe(true);
        });

        it(`object '${obj.id}' has subsystem explode breakdown components`, () => {
          const comps = getDedicatedComponents(mission.id, obj.id);
          expect(comps.length).toBeGreaterThanOrEqual(2);
        });
      });
    });
  });
});
