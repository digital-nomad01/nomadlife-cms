import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_DIMENSIONS = { width: 200, height: 200 };
const MAX_DIMENSIONS = { width: 4096, height: 4096 };
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

export const blogSchema = z.object({
    name: z.string().min(1,{ message:'Name is required'}),
    content: z.string({required_error:'Content is required'})
    .min(1,{message: "Content is requirred"})
    .min(3,{ message:'Content should be atleast 3 characters'}),
    status: z.enum(['Draft', 'Published', 'Archived']),
    tags: z.array(z.string()).min(1,{message: "At least one tag is required"}),
    slug: z.string().optional(),
    image: z.
     instanceof(File, {message: "Please select an image file"})
     .refine((file) => file.size <= MAX_FILE_SIZE, {message: `File size must be less than ${formatBytes(MAX_FILE_SIZE)}`})
     .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {message: "Please upload image in jpeg, jpg, png or webp format"})
     .refine((file) => 
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const meetsDimensions =
                img.width >= MIN_DIMENSIONS.width &&
                img.height >= MIN_DIMENSIONS.height &&
                img.width <= MAX_DIMENSIONS.width &&
                img.height <= MAX_DIMENSIONS.height;
              resolve(meetsDimensions);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }),
      {message: `The image dimensions are invalid. Please upload an image between ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} and ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels.`}
    ),
    // time_to_read: z.coerce.number().min(0, 'Must be 0 or more')
});

