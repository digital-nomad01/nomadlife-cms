import { z } from "zod";

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "File size must be less than 5MB",
  })
  .refine(
    (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
    "Please upload image in jpeg, jpg, png or webp format",
  );

// Allow both File (new upload) and string (existing path) for images
const imageSchema = z.union([
  imageFileSchema,           // New file upload
  z.string(),               // Existing image path
  z.undefined(),            // No image
  z.null()                  // Explicit null
]).optional();

export const spaceSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  space_type: z.enum(["coworking_space","coworking_cafe","coliving_space"]),

  short_description: z.string().min(1, { message: "Short description is required" }),
  content: z.string().optional(),

  location: z.string().min(1, { message: "Location is required" }),
  address: z.string().optional(),
  latitude: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val || 0) : val))
    .pipe(z.number().nullable().optional()),
  longitude: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val || 0) : val))
    .pipe(z.number().nullable().optional()),

  amenities: z.array(z.string()).optional().default([]),
  options: z.array(z.string()).optional().default([]),

  opening_time: z.string().optional(),
  closing_time: z.string().optional(),
  capacity: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val || 0) : val))
    .pipe(z.number().nonnegative())
    .optional(),
  price_from: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val || 0) : val))
    .pipe(z.number().nonnegative())
    .optional(),
  allow_booking: z.boolean().optional().default(true),

  wifi_speed_mbps: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val || 0) : val))
    .pipe(z.number().nonnegative())
    .optional(),
  weather_condition: z.string().optional(),

  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  website: z.string().url().optional(),
  instagram: z.string().url().optional(),
  facebook: z.string().url().optional(),
  whatsapp: z.string().optional(),
 
  status: z.enum(["draft", "published", "archived"]),
  tags: z.array(z.string()).optional().default([]),
  image: imageSchema, // Updated to accept both File and string
});

export type SpaceInput = z.infer<typeof spaceSchema>;


