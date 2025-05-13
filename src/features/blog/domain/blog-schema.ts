import { z } from "zod";

export const blogSchema = z.object({
    name: z.string().min(3, 'Name is required'),
    content: z.string().min(3, 'Content is required'),
    // status: z.enum(['draft', 'published', 'archived']),
    // tags: z.string().optional(),
    // slug: z.string().optional(),
    // image: z.string().optional(),
    // video: z.string().optional(),
    // time_to_read: z.coerce.number().min(0, 'Must be 0 or more')
});

