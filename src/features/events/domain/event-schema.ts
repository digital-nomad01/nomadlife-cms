import { z } from "zod";

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "File size must be less than 5MB",
  })
  .refine(
    (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
    "Please upload image in jpeg, jpg, png or webp format",
  )
  .optional();

export const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  content: z.string().optional(),
  start_date: z.date({ required_error: "Start date is required" }),
  end_date: z.date().optional(),
  location: z.string().min(1, { message: "Location is required" }),
  venue: z.string().optional(),
  capacity: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val || 0) : val))
    .pipe(z.number().nonnegative())
    .optional(),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val || 0) : val))
    .pipe(z.number().nonnegative())
    .optional(),
  status: z.enum(["draft", "published", "archived"]),
  tags: z.array(z.string()).optional().default([]),
  image: imageFileSchema,
  is_online: z.boolean().optional().default(false),
});

export type EventInput = z.infer<typeof eventSchema>;


