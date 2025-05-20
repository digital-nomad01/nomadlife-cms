import { FormFieldConfig } from "@/app/core/form-builder";

export const blogFields: FormFieldConfig[] = [
    {
        name: "name",
        label: "Name",
        fieldType: "input",
        placeholder: "Enter Blog",
        description: "This field will be publicly displayed.",
    },
    {
        name: "content",
        label: "Content",
        fieldType: "textarea",
        placeholder: "Enter the content",
    },
    {
        name: "status",
        label: "Status",
        fieldType: "dropdown",
        options: ["Draft","Published", "Archived"],
        placeholder: "Enter the content",
    },
    {
        name: "tags",
        label: "Tags",
        fieldType: "tagpicker",
        // placeholder: "",
    },
    {
        name: "slug",
        label: "Slug",
        fieldType: "input",
        placeholder: "Enter the slug",
    },
]
