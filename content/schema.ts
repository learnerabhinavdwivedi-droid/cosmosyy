import { z } from "zod/v4";

export const HeritageObjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  position: z.tuple([z.number(), z.number(), z.number()]),
  description: z.string().min(1),
  xp: z.number().int().positive(),
  source: z.string().optional(),
  hidden: z.boolean().optional(),
  scienceDiscovery: z.string().optional(),
  legacy: z.string().optional(),
  status: z.enum(["operational", "dormant", "defunct", "cruising", "preserved", "intact"]).optional(),
  whySent: z.string().optional(),
  ongoingScience: z.string().optional(),
  hardwareType: z.string().optional(),
  firstPerson: z.string().optional(),
  yearDeployed: z.number().int().optional(),
  yearLastContact: z.number().int().optional(),
  nasaImageId: z.string().optional(),
});
export type HeritageObject = z.infer<typeof HeritageObjectSchema>;

export const MissionCrewSchema = z.object({
  commander: z.string(),
  lmp: z.string(),
  cmp: z.string(),
});
export type MissionCrew = z.infer<typeof MissionCrewSchema>;

export const MissionTimelineSchema = z.object({
  launch: z.string(),
  landing: z.string(),
  lastContact: z.string().optional(),
  endOfMission: z.string().optional(),
});
export type MissionTimeline = z.infer<typeof MissionTimelineSchema>;

export const MissionSpecSchema = z.object({
  id: z.string().min(1),
  planet: z.enum(["moon", "mars", "deep-space"]).optional(),
  name: z.string().min(1),
  site: z.string().min(1),
  date: z.string().min(1),
  evaSunTime: z.string().min(1),
  crew: MissionCrewSchema,
  missionType: z.enum(["crewed", "robotic"]).optional(),
  operator: z.string().optional(),
  lm: z.string().optional(),
  cm: z.string().optional(),
  landing: z.object({
    lat: z.number(),
    lon: z.number(),
    label: z.string(),
  }),
  terrain: z.object({
    model: z.string().nullable().optional(),
    ortho: z.string().nullable().optional(),
    metersPerUnit: z.number().optional(),
    note: z.string().optional(),
  }),
  keyDiscovery: z.string().optional(),
  missionLegacy: z.string().optional(),
  funFact: z.string().optional(),
  heritageNote: z.string().optional(),
  timeline: MissionTimelineSchema.optional(),
  objects: z.array(HeritageObjectSchema).min(1),
});
export type MissionSpec = z.infer<typeof MissionSpecSchema>;
