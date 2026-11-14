import type { ObjectStoryPacket } from "../storySchema";

export interface PosterStoryProps {
  packet: ObjectStoryPacket;
  sceneIndex: number;
}

export function PosterStory({ packet, sceneIndex }: PosterStoryProps) {
  const current = packet.scenes[sceneIndex] ?? packet.scenes[0];
  if (!current) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-space-950 via-space-900 to-space-950 p-6 text-center select-none">
      <div className="relative mb-6 flex h-48 w-48 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-950/20 backdrop-blur-md shadow-2xl shadow-sky-950/50">
        <div className="text-7xl animate-pulse">🛰️</div>
        <div className="absolute bottom-2 font-mono text-[10px] uppercase tracking-widest text-sky-400">
          {packet.name}
        </div>
      </div>
      <h3 className="font-display text-xl sm:text-2xl font-bold tracking-wide text-regolith-100 mb-2">
        {current.beat.toUpperCase()}
      </h3>
      <p className="max-w-md text-xs sm:text-sm text-regolith-300 leading-relaxed">
        {current.explorer}
      </p>
    </div>
  );
}
