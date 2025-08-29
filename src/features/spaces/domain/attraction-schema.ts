import { z } from "zod";

export const attractionSchema = z.object({
  name: z.string().min(1, { message: "Attraction name is required" }),
  description: z.string().optional(),
  distance_km: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val || 0) : val))
    .pipe(z.number().nonnegative()),
  category: z.string().optional(),
  latitude: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val || 0) : val))
    .pipe(z.number())
    .optional(),
  longitude: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val || 0) : val))
    .pipe(z.number())
    .optional(),
  website: z.string().url().optional(),
});

export type AttractionInput = z.infer<typeof attractionSchema>;
