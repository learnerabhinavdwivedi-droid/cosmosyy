import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { MissionSpecSchema } from "../content/schema.js";

const CONTENT_DIR = join(import.meta.dirname, "..", "content", "missions");

async function main() {
  let files: string[];
  try {
    files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith(".json"));
  } catch {
    console.log("No content/missions/ directory yet — skipping validation.");
    process.exit(0);
  }

  if (files.length === 0) {
    console.log("No mission JSON files found — skipping validation.");
    process.exit(0);
  }

  let errors = 0;

  for (const file of files) {
    const path = join(CONTENT_DIR, file);
    const raw = JSON.parse(await readFile(path, "utf-8"));
    const result = MissionSpecSchema.safeParse(raw);
    if (!result.success) {
      console.error(`\n❌ ${file}:`);
      console.error(result.error.format());
      errors++;
    } else {
      console.log(`✓ ${file}`);
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} file(s) failed validation.`);
    process.exit(1);
  }

  console.log(`\nAll ${files.length} mission file(s) valid.`);
}

main();
