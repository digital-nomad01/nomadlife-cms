import { FormFieldConfig } from "@/app/core/form-builder";

export const attractionFields: FormFieldConfig[] = [
  { 
    name: "name", 
    label: "Attraction Name *", 
    fieldType: "input", 
    placeholder: "Phewa Lake, Peace Pagoda" 
  },
  { 
    name: "description", 
    label: "Description", 
    fieldType: "textarea", 
    placeholder: "Brief description of the attraction" 
  },
  { 
    name: "distance_km", 
    label: "Distance (km) *", 
    fieldType: "input", 
    inputType: "number", 
    placeholder: "0.5" 
  },
  { 
    name: "category", 
    label: "Category", 
    fieldType: "dropdown", 
    options: ["lake", "temple", "viewpoint", "museum", "cafe", "restaurant", "beach", "mountain", "park", "other"] 
  },
  { 
    name: "latitude", 
    label: "Latitude", 
    fieldType: "input", 
    inputType: "number", 
    placeholder: "28.2096" 
  },
  { 
    name: "longitude", 
    label: "Longitude", 
    fieldType: "input", 
    inputType: "number", 
    placeholder: "83.9856" 
  },
  { 
    name: "website", 
    label: "Website", 
    fieldType: "input", 
    inputType: "url", 
    placeholder: "https://example.com" 
  },
];

export type AttractionField = typeof attractionFields[number];
