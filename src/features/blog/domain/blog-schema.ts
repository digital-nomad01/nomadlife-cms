import { z } from "zod";

export const blogSchema = z.object({
    name: z.string().min(1,{ message:'Name is required'}),
    content: z.string({required_error:'Content is required'})
    .min(1,{message: "Content is requirred"})
    .min(3,{ message:'Content should be atleast 3 characters'}),
    status: z.enum(['Draft', 'Published', 'Archived']),
    tags: z.string(),
    slug: z.string().optional(),
    // image: z.string().optional(),
    // video: z.string().optional(),
    // time_to_read: z.coerce.number().min(0, 'Must be 0 or more')
});

