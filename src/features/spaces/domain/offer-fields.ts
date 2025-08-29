import { FormFieldConfig } from "@/app/core/form-builder";

export const offerFields: FormFieldConfig[] = [
  { 
    name: "name", 
    label: "Offer Name *", 
    fieldType: "input", 
    placeholder: "Hot Desk, Meeting Room, Private Office" 
  },
  { 
    name: "description", 
    label: "Description", 
    fieldType: "textarea", 
    placeholder: "Brief description of the offer" 
  },
  { 
    name: "price", 
    label: "Price (USD) *", 
    fieldType: "input", 
    inputType: "number", 
    placeholder: "25" 
  },
  { 
    name: "currency", 
    label: "Currency", 
    fieldType: "dropdown", 
    options: ["USD", "EUR", "GBP", "IDR", "THB", "VND"] 
  },
  { 
    name: "capacity", 
    label: "Capacity", 
    fieldType: "input", 
    inputType: "number", 
    placeholder: "1" 
  },
  { 
    name: "available", 
    label: "Available", 
    fieldType: "checkbox" 
  },
];

export type OfferField = typeof offerFields[number];
