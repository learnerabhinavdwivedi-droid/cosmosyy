import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { MissionSpecSchema } from "../content/schema.js";
import { z } from "zod/v4";

const MISSIONS_DIR = join(import.meta.dirname, "..", "content", "missions");
const STORIES_DIR = join(import.meta.dirname, "..", "content", "stories");

async function main() {
  let files: string[];
  try {
    files = (await readdir(MISSIONS_DIR)).filter((f) => f.endsWith(".json"));
  } catch {
    console.log("No content/missions/ directory yet — skipping validation.");
    process.exit(0);
  }

  if (files.length === 0) {
    console.log("No mission JSON files found — skipping validation.");
    process.exit(0);
  }

  let errors = 0;

  // 1. Validate all mission specs
  for (const file of files) {
    const path = join(MISSIONS_DIR, file);
    const raw = JSON.parse(await readFile(path, "utf-8"));
    const result = MissionSpecSchema.safeParse(raw);
    if (!result.success) {
      console.error(`\n❌ ${file}:`);
      console.error(z.prettifyError(result.error));
      errors++;
    } else {
      console.log(`✓ ${file}`);
    }
  }

  // 2. Validate story files against the narrative truncation bug
  let validatedStories = 0;
  try {
    const missionDirs = await readdir(STORIES_DIR);
    for (const dirName of missionDirs) {
      const dirPath = join(STORIES_DIR, dirName);
      const dirStat = await stat(dirPath);
      if (!dirStat.isDirectory()) continue;

      const storyFiles = (await readdir(dirPath)).filter((f) => f.endsWith(".story.json"));
      for (const storyFile of storyFiles) {
        validatedStories++;
        const filePath = join(dirPath, storyFile);
        const story = JSON.parse(await readFile(filePath, "utf-8"));
        const factsMap = new Map<string, string>();
        for (const fact of story.facts || []) {
          if (fact.id && fact.text) {
            factsMap.set(fact.id, fact.text);
          }
        }

        for (const scene of story.scenes || []) {
          for (const field of ["kids", "explorer"] as const) {
            const sceneText = scene[field];
            if (!sceneText || typeof sceneText !== "string") continue;
            for (const fId of scene.factIds || []) {
              const factText = factsMap.get(fId);
              if (!factText) continue;

              const trimmedText = sceneText.trim();
              const textWithoutTrailingPunct = trimmedText.replace(/[.!?]+$/, "").trim();

              if (factText.startsWith(textWithoutTrailingPunct)) {
                const remainder = factText.slice(textWithoutTrailingPunct.length);
                if (remainder.length > 10) {
                  // Must end at a natural sentence boundary (period/exclamation/question + quotes + space or end)
                  const isNaturalBoundary = /^[.!?]['"’”\)\]]*(\s|$)/.test(remainder);
                  if (!isNaturalBoundary) {
                    console.error(
                      `\n❌ Truncation detected in ${dirName}/${storyFile} [${scene.id}.${field}]:`
                    );
                    console.error(`   Story text: "${trimmedText}"`);
                    console.error(`   Fact source: "${factText}"`);
                    errors++;
                  }
                }
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error reading story files for truncation check:", err);
    errors++;
  }

  if (errors > 0) {
    console.error(`\n${errors} validation error(s) found.`);
    process.exit(1);
  }

  console.log(`\nAll ${files.length} mission file(s) valid.`);
  console.log(`All ${validatedStories} story packet(s) verified free of mid-sentence truncation.`);
}

main();
