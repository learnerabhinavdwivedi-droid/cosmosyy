import { z } from "zod/v4";

export const SourceSchema = z.object({
  label: z.string().min(1),
  url: z.url(),
});
export type Source = z.infer<typeof SourceSchema>;

export const HotspotSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  position: z.tuple([z.number(), z.number(), z.number()]),
});
export type Hotspot = z.infer<typeof HotspotSchema>;

export const HeritageObjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  model: z.string().min(1),
  position: z.tuple([z.number(), z.number(), z.number()]),
  rotation: z.tuple([z.number(), z.number(), z.number()]).optional(),
  scale: z.number().positive().optional(),
  story: z.object({
    what: z.string().min(1),
    whyLeft: z.string().min(1),
    whereToday: z.string().min(1),
  }),
  photo: z.string().min(1),
  sources: z.array(SourceSchema).min(1),
  hotspots: z.array(HotspotSchema).min(3).max(5),
});
export type HeritageObject = z.infer<typeof HeritageObjectSchema>;

export const NarrationCueSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  audioFile: z.string().min(1),
  vttFile: z.string().min(1),
  durationMs: z.number().int().positive(),
});
export type NarrationCue = z.infer<typeof NarrationCueSchema>;

export const FlightBeatSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  startSec: z.number().nonnegative(),
  endSec: z.number().positive(),
  narration: NarrationCueSchema,
  gate: z
    .object({
      label: z.string().min(1),
      key: z.string().min(1),
    })
    .optional(),
});
export type FlightBeat = z.infer<typeof FlightBeatSchema>;

export const MissionSpecSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  site: z.string().min(1),
  date: z.string().min(1),
  crew: z.array(z.string().min(1)).min(1),
  cmPilot: z.string().min(1),
  lmName: z.string().min(1),
  cmName: z.string().min(1),
  coords: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  terrain: z.object({
    heightmap: z.string().min(1),
    orthophoto: z.string().min(1),
    meta: z.string().min(1),
  }),
  objects: z.array(HeritageObjectSchema).min(1),
  flightBeats: z.array(FlightBeatSchema).min(1),
  sunDateTime: z.iso.datetime(),
});
export type MissionSpec = z.infer<typeof MissionSpecSchema>;
