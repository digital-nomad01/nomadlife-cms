import { z } from "zod";

export const offerSchema = z.object({
  name: z.string().min(1, { message: "Offer name is required" }),
  description: z.string().optional(),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val || 0) : val))
    .pipe(z.number().nonnegative()),
  currency: z.string().default("USD"),
  capacity: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val || 0) : val))
    .pipe(z.number().nonnegative())
    .optional(),
  available: z.boolean().default(true),
});

export type OfferInput = z.infer<typeof offerSchema>;
