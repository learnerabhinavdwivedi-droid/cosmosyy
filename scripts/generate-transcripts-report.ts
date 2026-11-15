import fs from "fs";
import path from "path";

interface MissionObject {
  id: string;
  name: string;
  description: string;
  firstPerson?: string;
  scienceDiscovery?: string;
  legacy?: string;
}

interface MissionFile {
  id: string;
  name: string;
  site: string;
  date: string;
  planet?: string;
  objects: MissionObject[];
}

const missionsDir = path.resolve(process.cwd(), "content/missions");
const audioHeritageDir = path.resolve(process.cwd(), "public/audio/heritage");
const audioNarrationDir = path.resolve(process.cwd(), "public/audio/narration");

const missionFiles = fs.readdirSync(missionsDir).filter((f) => f.endsWith(".json"));

let report = `# 🎙️ Cosmosyy — Complete Mission & Audio Transcripts Catalog\n\n`;
report += `This document contains the complete transcripts of all flight narrations, heritage voice logs, and audio inventory across all 20 active missions.\n\n`;

report += `## Summary Statistics\n`;
report += `- **Total Missions**: ${missionFiles.length}\n`;

let totalObjects = 0;

for (const mf of missionFiles) {
  const raw = fs.readFileSync(path.join(missionsDir, mf), "utf-8");
  const m = JSON.parse(raw) as MissionFile;
  totalObjects += m.objects.length;
}

// Count audio files
function getFilesRecursive(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFilesRecursive(res));
    } else if (entry.name.endsWith(".mp3") || entry.name.endsWith(".wav") || entry.name.endsWith(".ogg")) {
      files.push(res);
    }
  }
  return files;
}

const allHeritageAudios = getFilesRecursive(audioHeritageDir);
const allNarrationAudios = getFilesRecursive(audioNarrationDir);
const allAudioFiles = getFilesRecursive(path.resolve(process.cwd(), "public/audio"));

const englishHeritage = allHeritageAudios.filter((f) => !f.endsWith("_hi.mp3"));
const hinglishHeritage = allHeritageAudios.filter((f) => f.endsWith("_hi.mp3"));
const englishNarration = allNarrationAudios.filter((f) => !f.endsWith("_hi.mp3"));
const hinglishNarration = allNarrationAudios.filter((f) => f.endsWith("_hi.mp3"));

report += `- **Total Heritage Artifacts**: ${totalObjects}\n`;
report += `- **English Audio Files**: ${englishHeritage.length} Heritage + ${englishNarration.length} Narration = ${englishHeritage.length + englishNarration.length}\n`;
report += `- **Hinglish Audio Files**: ${hinglishHeritage.length} Heritage + ${hinglishNarration.length} Narration = ${hinglishHeritage.length + hinglishNarration.length}\n`;
report += `- **Total Physical Audio Assets in Game**: ${allAudioFiles.length} files\n\n`;

report += `---\n\n`;

// Group missions by planet
const moonMissions: MissionFile[] = [];
const marsMissions: MissionFile[] = [];
const deepMissions: MissionFile[] = [];

for (const mf of missionFiles) {
  const raw = fs.readFileSync(path.join(missionsDir, mf), "utf-8");
  const m = JSON.parse(raw) as MissionFile;
  if (m.planet === "mars") marsMissions.push(m);
  else if (m.planet === "deep-space" || m.id.startsWith("deep")) deepMissions.push(m);
  else moonMissions.push(m);
}

function renderMissionGroup(title: string, list: MissionFile[]) {
  let section = `## ${title}\n\n`;
  for (const m of list) {
    section += `### 🛰️ ${m.name} (\`${m.id}\`)\n`;
    section += `- **Site**: ${m.site}\n`;
    section += `- **Date**: ${m.date}\n`;
    section += `- **Artifact Count**: ${m.objects.length}\n\n`;

    section += `#### 📻 Artifact Voice Log Transcripts (Heritage Audios)\n\n`;
    for (const obj of m.objects) {
      const audioRel = `public/audio/heritage/${m.id}/${obj.id}.mp3`;
      const audioExists = fs.existsSync(path.resolve(process.cwd(), audioRel));
      const audioHiRel = `public/audio/heritage/${m.id}/${obj.id}_hi.mp3`;
      const audioHiExists = fs.existsSync(path.resolve(process.cwd(), audioHiRel));

      section += `##### 🔹 ${obj.name} (\`${obj.id}\`)\n`;
      section += `- **English Audio**: \`${audioRel}\` [${audioExists ? "✅ Present" : "⚡ Fallback"}]\n`;
      section += `- **Hinglish Audio**: \`${audioHiRel}\` [${audioHiExists ? "✅ Present" : "⚡ Fallback"}]\n`;
      section += `- **Description**: ${obj.description}\n`;
      if (obj.firstPerson) {
        section += `> **🎙️ Voice Log Transcript**:\n`;
        section += `> *"${obj.firstPerson}"*\n\n`;
      } else {
        section += `> *(Standard telemetry audio link)*\n\n`;
      }
      if (obj.scienceDiscovery) {
        section += `- **Science Discovery**: ${obj.scienceDiscovery}\n`;
      }
      section += `\n`;
    }
    section += `---\n\n`;
  }
  return section;
}

report += renderMissionGroup("🌕 The Moon Missions", moonMissions);
report += renderMissionGroup("🔴 Mars Missions", marsMissions);
report += renderMissionGroup("✨ Deep Space & Asteroid Missions", deepMissions);

// Audio Inventory Section
report += `## 📁 Complete Audio Files Inventory\n\n`;
report += `### 1. Heritage Voice Logs (\`public/audio/heritage/\`)\n`;
for (const f of allHeritageAudios) {
  const rel = path.relative(process.cwd(), f).replace(/\\/g, "/");
  const sizeKb = (fs.statSync(f).size / 1024).toFixed(1);
  report += `- \`${rel}\` (${sizeKb} KB)\n`;
}

report += `\n### 2. Flight & Phase Narrations (\`public/audio/narration/\`)\n`;
for (const f of allNarrationAudios) {
  const rel = path.relative(process.cwd(), f).replace(/\\/g, "/");
  const sizeKb = (fs.statSync(f).size / 1024).toFixed(1);
  report += `- \`${rel}\` (${sizeKb} KB)\n`;
}

fs.writeFileSync(path.resolve(process.cwd(), "docs/MISSION_AUDIO_TRANSCRIPTS.md"), report, "utf-8");
console.log("Successfully generated docs/MISSION_AUDIO_TRANSCRIPTS.md!");
