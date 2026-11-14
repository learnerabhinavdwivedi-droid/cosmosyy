import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const MISSIONS_DIR = path.resolve("content/missions");
const OUTPUT_BASE = path.resolve("public/images/heritage");

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

function downloadFile(url: string, destPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
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
    }).on("error", () => {
      fs.unlink(destPath, () => {});
      resolve(false);
    });
  });
}

async function resolveAndDownload(query: string, destPath: string): Promise<boolean> {
  try {
    const data = await fetchJson(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`);
    const items = data.collection?.items;
    if (!items || items.length === 0) return false;
    const thumbUrl = items[0].links?.find((l: any) => l.rel === "preview")?.href || items[0].links?.[0]?.href;
    if (!thumbUrl) return false;
    return await downloadFile(thumbUrl, destPath);
  } catch {
    return false;
  }
}

async function main() {
  const missionFiles = fs.readdirSync(MISSIONS_DIR).filter((f) => f.endsWith(".json"));
  let recovered = 0;

  for (const file of missionFiles) {
    const filePath = path.join(MISSIONS_DIR, file);
    const mission = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const missionDir = path.join(OUTPUT_BASE, mission.id);

    for (const obj of mission.objects) {
      const destPath = path.join(missionDir, `${obj.id}.jpg`);
      if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
        continue;
      }

      console.log(`Recovering ${mission.id} / ${obj.id}...`);
      const queries = [
        obj.nasaImageId,
        `${mission.name} ${obj.name}`,
        `${mission.name} ${obj.id}`,
        obj.name,
      ].filter(Boolean) as string[];

      let ok = false;
      for (const q of queries) {
        ok = await resolveAndDownload(q, destPath);
        if (ok) {
          console.log(`  ✓ SUCCESS using query "${q}": ${destPath} (${fs.statSync(destPath).size} bytes)`);
          recovered++;
          break;
        }
      }

      if (!ok) {
        console.log(`  ✗ Still failed for ${obj.id}`);
      }
    }
  }

  console.log(`\nRecovery finished: ${recovered} images recovered.`);
}

main().catch(console.error);
