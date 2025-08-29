import { FormFieldConfig } from "@/app/core/form-builder";
import { getAvailableAmenities } from "./amenity-config";

export const spaceFields: FormFieldConfig[] = [
  { name: "name", label: "Name *", fieldType: "input", placeholder: "Nomad Hub Ubud" },
  { name: "space_type", label: "Type *", fieldType: "dropdown", options: ["coworking_space","coworking_cafe","coliving_space"] },

  { name: "short_description", label: "Short Description *", fieldType: "textarea", placeholder: "One-liner highlights" },
  { name: "content", label: "Detailed Content", fieldType: "tiptap" },

  { name: "location", label: "Location *", fieldType: "input", placeholder: "Ubud, Bali" },
  { name: "address", label: "Address", fieldType: "input", placeholder: "Jl. Raya Ubud No. 10" },
  { name: "latitude", label: "Latitude", fieldType: "input", inputType: "number", placeholder: "-8.5069" },
  { name: "longitude", label: "Longitude", fieldType: "input", inputType: "number", placeholder: "115.2625" },

  { 
    name: "amenities", 
    label: "Amenities", 
    fieldType: "tagpicker", 
    tagOptions: getAvailableAmenities()
  },
  { name: "options", label: "Space Options", fieldType: "tagpicker", tagOptions: [
    "den","hot_desk","meeting_room","private_office","dedicated_desk"
  ] },

  { name: "opening_time", label: "Opening Time", fieldType: "input", inputType: "time" },
  { name: "closing_time", label: "Closing Time", fieldType: "input", inputType: "time" },
  { name: "capacity", label: "Capacity", fieldType: "input", inputType: "number", placeholder: "100" },
  { name: "price_from", label: "Starting Price (USD)", fieldType: "input", inputType: "number", placeholder: "10" },
  { name: "allow_booking", label: "Allow Booking", fieldType: "checkbox" },

  { name: "wifi_speed_mbps", label: "WiFi Speed (Mbps)", fieldType: "input", inputType: "number", placeholder: "200" },
  { name: "weather_condition", label: "Weather Notes", fieldType: "input", placeholder: "Sunny, humid" },

  { name: "contact_email", label: "Contact Email", fieldType: "input", inputType: "email", placeholder: "hello@nomadhub.com" },
  { name: "contact_phone", label: "Contact Phone", fieldType: "input", placeholder: "+62 812 345 678" },
  { name: "website", label: "Website", fieldType: "input", inputType: "url", placeholder: "https://nomadhub.com" },
  { name: "instagram", label: "Instagram", fieldType: "input", inputType: "url", placeholder: "https://instagram.com/nomadhub" },
  { name: "facebook", label: "Facebook", fieldType: "input", inputType: "url", placeholder: "https://facebook.com/nomadhub" },
  { name: "whatsapp", label: "WhatsApp", fieldType: "input", placeholder: "+62 812 345 678" },

  { name: "status", label: "Status *", fieldType: "dropdown", options: ["draft","published","archived"] },
  { name: "tags", label: "Tags", fieldType: "tagpicker", tagOptions: ["coworking","cafe","coliving","quiet","central","beach","mountain"] },
  { name: "image", label: "Cover Image", fieldType: "file", bucket: "spaces" },
];

export type SpaceField = typeof spaceFields[number];


