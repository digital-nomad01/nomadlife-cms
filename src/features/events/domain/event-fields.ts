import { FormFieldConfig } from "@/app/core/form-builder";

export const eventFields: FormFieldConfig[] = [
  { name: "title", label: "Event Title *", fieldType: "input", placeholder: "Digital Nomad Meetup" },
  { name: "description", label: "Description *", fieldType: "textarea", placeholder: "Short summary" },
  { name: "content", label: "Detailed Content", fieldType: "tiptap" },
  { name: "start_date", label: "Start Date *", fieldType: "date" },
  { name: "end_date", label: "End Date", fieldType: "date" },
  { name: "location", label: "Location *", fieldType: "input", placeholder: "Ubud, Bali" },
  { name: "venue", label: "Venue", fieldType: "input", placeholder: "Hub Bali" },
  { name: "capacity", label: "Capacity", fieldType: "input", inputType: "number", placeholder: "50" },
  { name: "price", label: "Price (USD)", fieldType: "input", inputType: "number", placeholder: "0" },
  { name: "status", label: "Status *", fieldType: "dropdown", options: ["draft","published","archived"] },
  { name: "tags", label: "Tags", fieldType: "tagpicker", tagOptions: ["networking","coworking","wellness","workshop","meetup"] },
  { name: "image", label: "Cover Image", fieldType: "file" },
  { name: "is_online", label: "Online Event", fieldType: "checkbox" },
];


