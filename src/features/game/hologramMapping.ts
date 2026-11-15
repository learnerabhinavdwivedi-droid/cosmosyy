export interface HologramComponent {
  name: string;
  center_m: [number, number, number];
  explode_vector: [number, number, number];
}

export interface HologramManifest {
  id: string;
  title: string;
  region: string;
  archetype: string;
  model: string;
  components: HologramComponent[];
}

interface ModelEntry {
  modelPath: string;
  manifestPath: string;
}

const MODEL_MAP: Record<string, Record<string, ModelEntry>> = {
  "apollo-11": {
    "descent-stage": m("apollo11_eagle"),
    flag: m("apollo11_eagle"),
    lrrr: m("apollo11_easep"),
    psep: m("apollo11_easep"),
    "tv-camera": m("apollo11_eagle"),
    mesa: m("apollo11_eagle"),
    swc: m("apollo11_easep"),
  },
  "apollo-12": {
    "descent-stage": m("apollo12_intrepid"),
    flag: m("apollo12_intrepid"),
    "surveyor-3": m("surveyor3"),
    alsep: m("alsep_packages"),
    "s-band-antenna": m("surveyor3"),
    "hand-tool-carrier": m("apollo12_intrepid"),
  },
  "apollo-14": {
    "descent-stage": m("apollo14_antares_met"),
    flag: m("apollo14_antares_met"),
    alsep: m("alsep_packages"),
    lrrr: m("apollo11_easep"),
    met: m("apollo14_antares_met"),
    "golf-balls": m("apollo14_antares_met"),
  },
  "apollo-15": {
    "descent-stage": m("apollo15_falcon_lrv1"),
    flag: m("apollo15_falcon_lrv1"),
    lrv: m("apollo15_falcon_lrv1"),
    alsep: m("alsep_packages"),
    lrrr: m("apollo11_easep"),
    "fallen-astronaut": {
      modelPath: "/models/astronaut.glb",
      manifestPath: "/manifests/apollo15_falcon_lrv1.json",
    },
  },
  "apollo-16": {
    "descent-stage": m("apollo16_orion_lrv2"),
    flag: m("apollo16_orion_lrv2"),
    lrv: m("apollo16_orion_lrv2"),
    alsep: m("alsep_packages"),
    "uv-camera": m("apollo16_orion_lrv2"),
    "family-photo": m("apollo16_orion_lrv2"),
  },
  "apollo-17": {
    "descent-stage": m("apollo17_challenger_lrv3"),
    flag: m("apollo17_challenger_lrv3"),
    lrv: m("apollo17_challenger_lrv3"),
    alsep: m("alsep_packages"),
    lrrr: m("apollo11_easep"),
    "orange-soil": m("apollo17_challenger_lrv3"),
  },
  "mars-viking1": {
    "v1-lander-body": m("viking1"),
    "v1-sampler-arm": m("viking1"),
    "v1-meteorology": m("viking1"),
    "v1-cameras": m("viking1"),
    "v1-antenna": m("viking1"),
    "v1-seismometer": m("viking1"),
  },
  "mars-pathfinder": {
    "mp-base-station": m("phoenix"),
    "mp-sojourner": m("sojourner"),
    "mp-ramp": m("sojourner"),
    "mp-imp-camera": m("sojourner"),
    "mp-barnacle-bill": m("sojourner"),
    "mp-yogi": m("sojourner"),
  },
  "mars-spirit": {
    "sp-rover": m("spirit"),
    "sp-columbia-hills": m("spirit"),
    "sp-home-plate": m("spirit"),
    "sp-wheel-tracks": m("spirit"),
    "sp-bonneville": m("spirit"),
    "sp-heat-shield": m("phoenix"),
  },
  "mars-opportunity": {
    "op-rover": m("opportunity"),
    "op-eagle-crater": m("opportunity"),
    "op-blueberries": m("opportunity"),
    "op-heat-shield": m("phoenix"),
    "op-marathon-valley": m("opportunity"),
    "op-perseverance-valley": m("opportunity"),
  },
  "mars-curiosity": {
    "cu-rover": m("opportunity"),
    "cu-sky-crane": m("insight"),
    "cu-drill-holes": m("opportunity"),
    "cu-yellowknife": m("opportunity"),
    "cu-calibration-target": m("opportunity"),
    "cu-mount-sharp": m("opportunity"),
  },
  "mars-perseverance": {
    "pe-rover": m("spirit"),
    "pe-ingenuity": m("ingenuity"),
    "pe-sample-tubes": m("spirit"),
    "pe-delta": m("spirit"),
    "pe-supercam": m("spirit"),
    "pe-sky-crane": m("insight"),
  },
};

function m(id: string): ModelEntry {
  return {
    modelPath: `/models/heritage/${id}.glb`,
    manifestPath: `/manifests/${id}.json`,
  };
}

export function getHologramModel(missionId: string, objectId: string): ModelEntry {
  const direct = MODEL_MAP[missionId]?.[objectId];
  if (direct) return direct;

  // Resilient fallback to high-quality authentic model by archetype / mission
  if (missionId.startsWith("mars")) {
    return m("spirit");
  }
  return m("apollo11_eagle");
}

function formatComponentName(raw: string): string {
  return raw
    .replace(/_/g, " ")
    .replace(/[-]?\d+(\.\d+)?$/g, "")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export function getDisplayComponents(
  manifest: HologramManifest,
): { name: string; displayName: string; explode: [number, number, number] }[] {
  const seen = new Set<string>();
  return manifest.components
    .filter((c) => {
      const base = c.name.replace(/[-_]\d+(\.\d+)?$/, "");
      if (seen.has(base)) return false;
      seen.add(base);
      return true;
    })
    .slice(0, 6)
    .map((c) => ({
      name: c.name,
      displayName: formatComponentName(c.name),
      explode: c.explode_vector,
    }));
}
