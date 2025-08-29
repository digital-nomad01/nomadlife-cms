import { FormFieldConfig } from "@/app/core/form-builder";

export const blogFields: FormFieldConfig[] = [
    {
        name: "name",
        label: "Name *",
        fieldType: "input",
        placeholder: "Enter Blog",
        description: "This field will be publicly displayed.",
    },
    {
        name: "content",
        label: "Content *",
        fieldType: "tiptap",
        placeholder: "Enter the content",
        // description: "This input can be resized just by dragging from the bottom right corner.",
    },
    {
        name: "status",
        label: "Status *",
        fieldType: "dropdown",
        options: ["draft","published", "archived"],
        placeholder: "Enter the content",
    },
    {
        name: "tags",
        label: "Tags *",
        fieldType: "tagpicker",
        placeholder: "Select or add tags",
        tagOptions: ["Technology", "Lifestyle", "Travel", "Food"],
    },
    {
        name: "slug",
        label: "Slug",
        fieldType: "input",
        placeholder: "Enter the slug",
    },
    {
        name: "image",
        label: "Image *",
        fieldType: "file",
        placeholder: "Enter the image",
    },
    {
        name: "video",
        label: "Video *",
        fieldType: "file",
        placeholder: "Enter the video",
    },
    {
        name: "time_to_read",
        label: "Time to read",
        fieldType: "input",
        placeholder: "Enter the time to read",
    }
]
