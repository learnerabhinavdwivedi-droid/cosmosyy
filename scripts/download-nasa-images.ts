import fs from "node:fs";
import path from "node:path";
import https from "node:https";

interface MissionObject {
  id: string;
  name: string;
  nasaImageId?: string;
}

interface MissionData {
  id: string;
  name: string;
  objects: MissionObject[];
}

const MISSIONS_DIR = path.resolve("content/missions");
const OUTPUT_BASE = path.resolve("public/images/heritage");

function downloadFile(url: string, destPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    const req = https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, destPath).then(resolve);
          return;
        }
      }
      if (res.statusCode !== 200) {
        fs.unlink(destPath, () => {});
        resolve(false);
        return;
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close(() => resolve(true));
      });
    });

    req.on("error", () => {
      fs.unlink(destPath, () => {});
      resolve(false);
    });

    req.setTimeout(8000, () => {
      req.destroy();
      fs.unlink(destPath, () => {});
      resolve(false);
    });
  });
}

async function main() {
  const missionFiles = fs.readdirSync(MISSIONS_DIR).filter((f) => f.endsWith(".json"));
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of missionFiles) {
    const filePath = path.join(MISSIONS_DIR, file);
    const mission: MissionData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const missionDir = path.join(OUTPUT_BASE, mission.id);
    fs.mkdirSync(missionDir, { recursive: true });

    console.log(`Processing mission: ${mission.name} (${mission.id})`);

    for (const obj of mission.objects) {
      const destPath = path.join(missionDir, `${obj.id}.jpg`);
      if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
        skipped++;
        continue;
      }

      if (!obj.nasaImageId) {
        console.warn(`  [NO_ID] ${obj.id} (${obj.name})`);
        failed++;
        continue;
      }

      const url = `https://images-assets.nasa.gov/image/${obj.nasaImageId}/${obj.nasaImageId}~thumb.jpg`;
      process.stdout.write(`  Downloading ${obj.id} (${obj.nasaImageId})... `);
      const success = await downloadFile(url, destPath);
      if (success) {
        console.log(`OK (${fs.statSync(destPath).size} bytes)`);
        downloaded++;
      } else {
        console.log(`FAILED (HTTP error or timeout)`);
        failed++;
      }
    }
  }

  console.log(`\nDownload summary: ${downloaded} downloaded, ${skipped} skipped (already present), ${failed} failed/missing.`);
}

main().catch(console.error);
