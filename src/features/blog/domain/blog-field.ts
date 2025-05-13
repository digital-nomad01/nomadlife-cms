import { FormFieldConfig } from "@/app/core/form-builder";

export const blogFields: FormFieldConfig[] = [
    {
        name: "name",
        label: "Name",
        type: "text",
        fieldType: "input",
        placeholder: "Enter Blog",
        description: "This field will be publicly displayed.",
    },
    {
        name: "content",
        label: "Content",
        type: "text",
        fieldType: "textarea",
        placeholder: "Enter the content",
        description: "This field will be publicly displayed.",
    },
    {
        name: "status",
        label: "Status",
        type: "text",
        fieldType: "dropdown",
        placeholder: "Enter the content",
        description: "This field will be publicly displayed.",
    },
]
