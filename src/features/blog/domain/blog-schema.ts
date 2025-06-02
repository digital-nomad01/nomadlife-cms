import { z } from "zod";

export const blogSchema = z.object({
    name: z.string().min(1,{ message:'Name is required'}),
    content: z.string({required_error:'Content is required'})
    .min(1,{message: "Content is requirred"})
    .min(3,{ message:'Content should be atleast 3 characters'}),
    status: z.enum(['Draft', 'Published', 'Archived']),
    tags: z.array(z.string()).min(1,{message: "At least one tag is required"}),
    slug: z.string().optional(),
    image: z.
     instanceof(File, {message: "Image must be a valid file"})
     .refine((file) => file.size <= 5 * 1024 * 1024, {message: `File size must be less than 5MB`})
     .refine((file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type), "Please upload image in jpeg, jpg, png or webp format")
     .refine((file) => file.name !== '', 'Image file is required'),

    video: z.
     instanceof(File, {message: "Video must be a valid file"})
     .refine((file) => file.size <= 50 * 1024 * 1024, {message: `File size must be less than 50MB`})
     .refine(
        (file) => ['video/mp4', 'video/avi', 'video/quicktime'].includes(file.type),
        'Video must be in MP4, AVI, or MOV format',
      )
      .refine((file) => file.name !== '', 'Video file is required'),
    time_to_read: z.string().optional(),
});

