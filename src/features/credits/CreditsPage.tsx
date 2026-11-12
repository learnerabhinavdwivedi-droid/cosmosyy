import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface CreditItem {
  category: string;
  items: Array<{
    name: string;
    source: string;
    license: string;
    url?: string;
  }>;
}

const CREDITS: CreditItem[] = [
  {
    category: "3D Models & Celestial Assets",
    items: [
      {
        name: "Apollo Lunar Module (Eagle) & Saturn V",
        source: "NASA 3D Resources",
        license: "Public Domain (NASA Media Policy)",
        url: "https://github.com/nasa/NASA-3D-Resources",
      },
      {
        name: "Apollo 11 Landing Site Relief Model",
        source: "NASA 3D Resources / USGS Astrogeology",
        license: "Public Domain",
        url: "https://github.com/nasa/NASA-3D-Resources",
      },
      {
        name: "Moon CGI Color & LDEM Elevation Maps",
        source: "NASA Scientific Visualization Studio (SVS)",
        license: "Public Domain (Ernie Wright / SVS #4720)",
        url: "https://svs.gsfc.nasa.gov",
      },
      {
        name: "Blue Marble Earth & Cloud Textures",
        source: "NASA Visible Earth",
        license: "Public Domain",
        url: "https://visibleearth.nasa.gov",
      },
    ],
  },
  {
    category: "Scientific & Historical Equipment Data",
    items: [
      {
        name: "Lunar Heritage Equipment Positions",
        source: "LROC NAC DTM & Shapefiles (Gonzales et al. 2019, LPS L #3089)",
        license: "Public Domain (US Government Work)",
        url: "https://pds.lroc.asu.edu",
      },
      {
        name: "Apollo Lunar Surface Journals (ALSJ)",
        source: "NASA History Division (Eric M. Jones)",
        license: "Public Domain",
        url: "https://www.hq.nasa.gov/alsj",
      },
    ],
  },
  {
    category: "Audio & Narration",
    items: [
      {
        name: "Quindar Tones & Radio Comm Effects",
        source: "NASA Apollo Mission Audio Archives",
        license: "Public Domain",
      },
      {
        name: "Mission Voice Narration",
        source: "Generated via Neural Voice Synthesizer",
        license: "Public / Project License",
      },
    ],
  },
  {
    category: "Typography & Fonts",
    items: [
      {
        name: "Barlow Condensed, Inter Variable, JetBrains Mono",
        source: "Fontsource / Google Fonts",
        license: "SIL Open Font License (OFL-1.1)",
      },
    ],
  },
];

export default function CreditsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-space-950 px-4 py-12 text-fg">
      {/* Background radial glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--space-900)_0%,_var(--space-950)_80%)]" />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-space-700/60 bg-space-900/85 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between border-b border-space-700/50 pb-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-regolith-100">
              {t("credits.title", { defaultValue: "Credits & Attributions" })}
            </h1>
            <p className="mt-0.5 text-xs text-regolith-400">
              Cosmosyy — Apollo Lunar Exploration Simulator
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="border-space-700 bg-space-800/80 text-regolith-200 hover:bg-space-700 hover:text-signal"
          >
            ← {t("common.back", { defaultValue: "Back" })}
          </Button>
        </div>

        <div className="mt-6 max-h-[60vh] space-y-6 overflow-y-auto pr-2">
          {CREDITS.map((group) => (
            <div key={group.category} className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-signal">
                {group.category}
              </h2>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-lg border border-space-700/40 bg-space-800/40 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm text-regolith-200">
                        {item.name}
                      </p>
                      <span className="shrink-0 rounded bg-space-700/60 px-2 py-0.5 font-mono text-[10px] text-regolith-400">
                        {item.license}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-regolith-400">
                      {item.source}
                    </p>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-[11px] text-signal/80 underline hover:text-signal"
                      >
                        {item.url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-space-700/40 pt-4 text-center">
          <p className="text-xs text-regolith-400/60">
            Dedicated to the Apollo crews, engineers, and scientists who made the journey possible.
          </p>
        </div>
      </div>
    </div>
  );
}
