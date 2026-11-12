import { z } from "zod";

export const SourceAssetSchema = z.object({
  asset: z.string().optional(),
  credit: z.string().optional(),
  url: z.string().url().optional(),
  licence: z.string().optional(),
  label: z.string().optional(),
});
export type SourceAsset = z.infer<typeof SourceAssetSchema>;

export const CrewSchema = z.object({
  commander: z.string().min(1),
  lmp: z.string().min(1),
  cmp: z.string().min(1),
});
export type Crew = z.infer<typeof CrewSchema>;

export const LandingSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  label: z.string().min(1),
});
export type Landing = z.infer<typeof LandingSchema>;

export const TerrainSchema = z.object({
  model: z.string().nullable(),
  ortho: z.string().nullable(),
  metersPerUnit: z.number().positive().optional(),
  note: z.string().optional(),
});
export type TerrainSpec = z.infer<typeof TerrainSchema>;

export const HeritageObjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  position: z.tuple([z.number(), z.number(), z.number()]),
  description: z.string().min(1),
  xp: z.number().int().nonnegative().default(50),
  source: z.string().optional(),
});
export type HeritageObject = z.infer<typeof HeritageObjectSchema>;

export const MissionSpecSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  site: z.string().min(1),
  date: z.string().min(1),
  evaSunTime: z.string().min(1),
  crew: CrewSchema,
  lm: z.string().optional(),
  cm: z.string().optional(),
  landing: LandingSchema,
  terrain: TerrainSchema,
  objects: z.array(HeritageObjectSchema).min(1),
  models: z.record(z.string(), z.string()).optional(),
  textures: z.record(z.string(), z.string()).optional(),
  sources: z.array(SourceAssetSchema).optional(),
  _note: z.string().optional(),
});
export type MissionSpec = z.infer<typeof MissionSpecSchema>;
