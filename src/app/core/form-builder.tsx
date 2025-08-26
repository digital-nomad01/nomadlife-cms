"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Tiptap from "../../components/ui/tiptap";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
// Import amenity helpers
import { getAmenityConfig } from "@/features/spaces/domain/amenity-config";

type FieldType = "input" | "textarea" | "dropdown" | "tagpicker" | "file" | "checkbox" | "radio" | "tiptap" | "date";

export type FormFieldConfig = {
  name: string;
  label: string;
  fieldType: FieldType;
  placeholder?: string;
  description?: string;
  options?: string[];
  tagOptions?: string[];
  inputType?: string; // for input fields (text, number, email, etc.)
  bucket?: string; // storage bucket for file preview
};

export type ReusableFormProps = {
  fields: FormFieldConfig[];
  schema: z.ZodObject<any>;
  onSubmit: (data: any) => void | Promise<void>;
  submitButtonText: string;
  defaultValues: Record<string, any>;
};

export const FormBuilder = ({
  fields,
  schema,
  onSubmit,
  submitButtonText,
  defaultValues,
}: ReusableFormProps) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  // Reset form when defaultValues change
  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  // Helper function to render tag with icon if it's an amenity
  const renderTagWithIcon = (tag: string, field: FormFieldConfig) => {
    // Check if this is an amenities field and has config
    if (field.name === "amenities") {
      const config = getAmenityConfig(tag);
      if (config) {
        const IconComponent = config.icon;
        return (
          <span className="flex items-center gap-1">
            <IconComponent size={12} />
            {config.label}
          </span>
        );
      }
    }
    return tag;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {
                  field.fieldType === "file" ? (
                    <div className="space-y-3">
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files && event.target.files[0];
                          formField.onChange(file);
                        }}
                      />
                      {/* Show existing image preview */}
                      {formField.value && typeof formField.value === 'string' && (
                       <div className="relative aspect-video w-full max-w-sm bg-gray-100 rounded-lg overflow-hidden">
                       <img 
                         src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${field.bucket ?? 'events'}/${formField.value}`}
                         alt="Current uploaded image"
                         className="w-full h-full object-cover transition-transform hover:scale-105"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.style.display = 'none';
                           const parent = target.parentElement;
                           if (parent) {
                             parent.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><p class="text-sm text-red-500">Image not found</p></div>';
                           }
                         }}
                       />
                     </div>
                      )}
                    </div>
                  ) : field.fieldType === "tiptap" ? (
                    <Tiptap value={formField.value} onChange={formField.onChange} />
                  ) :  field.fieldType === "input" ? (
                    <Input
                      placeholder={field.placeholder}
                      {...formField}
                      type={field.inputType || "text"}
                    />
                  ) : field.fieldType === "dropdown" ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          {formField.value || "Select an option"}
                          <ChevronDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {field.options?.map((option) => (
                          <DropdownMenuItem
                            key={option}
                            onSelect={() => formField.onChange(option)}
                          >
                            {option}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : field.fieldType === "tagpicker" ? (
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(true)}
                      >
                        {Array.isArray(formField.value) && formField.value.length > 0
                          ? `Selected: ${formField.value.length} items`
                          : "Select Tags"}
                      </Button>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Select {field.label}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Selected items */}
                            <div>
                              <h4 className="font-medium mb-2">Selected ({(formField.value || []).length})</h4>
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(formField.value) && formField.value.map((tag: string) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-red-100"
                                    onClick={() =>
                                      formField.onChange(
                                        (formField.value || []).filter(
                                          (t: string) => t !== tag
                                        )
                                      )
                                    }
                                  >
                                    {renderTagWithIcon(tag, field)}
                                    <span className="ml-1 text-xs">×</span>
                                  </Badge>
                                ))}
                                {!(Array.isArray(formField.value) && formField.value.length > 0) && (
                                  <p className="text-sm text-gray-500">No items selected</p>
                                )}
                              </div>
                            </div>

                            {/* Add custom tag */}
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add custom tag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  if (
                                    newTag &&
                                    !(formField.value || []).includes(newTag)
                                  ) {
                                    formField.onChange([
                                      ...(formField.value || []),
                                      newTag,
                                    ]);
                                    setNewTag("");
                                  }
                                }}
                              >
                                Add Custom
                              </Button>
                            </div>

                            {/* Available options */}
                            <div>
                              <h4 className="font-medium mb-2">Available Options</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {field.tagOptions?.map((tag) => {
                                  const isSelected = (formField.value || []).includes(tag);
                                  const config = field.name === "amenities" ? getAmenityConfig(tag) : null;
                                  
                                  return (
                                    <div
                                      key={tag}
                                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                        isSelected
                                          ? "bg-red-50 border-red-200 text-red-700"
                                          : "bg-white border-gray-200 hover:bg-gray-50"
                                      }`}
                                      onClick={() => {
                                        const currentValue = formField.value || [];
                                        if (currentValue.includes(tag)) {
                                          formField.onChange(
                                            currentValue.filter((t: string) => t !== tag)
                                          );
                                        } else {
                                          formField.onChange([...currentValue, tag]);
                                        }
                                      }}
                                    >
                                      {config ? (
                                        <div className="flex items-center gap-2">
                                          <config.icon size={16} className="flex-shrink-0" />
                                          <div className="min-w-0">
                                            <div className="font-medium text-sm">{config.label}</div>
                                            <div className="text-xs text-gray-500 truncate">{config.description}</div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="font-medium text-sm">{tag}</div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={() => setDialogOpen(false)}>
                              Done ({(formField.value || []).length} selected)
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : field.fieldType === "checkbox" ? (
                    <div className="flex items-center gap-2">
                    <Checkbox 
                     checked={formField.value}
                     onCheckedChange={formField.onChange}
                    />
                    <Label className="text-sm">{field.label}</Label>
                    </div>
                  ) : field.fieldType === "radio" ? (
                    <RadioGroup>
                      {field.options?.map((option) => (
                        <div key={option} className="flex items-center gap-2">
                          <RadioGroupItem value={option} />
                          <Label className="text-sm">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : field.fieldType === "date" ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          {formField.value ? format(formField.value, "PPP") : "Pick a date"}
                          <ChevronDown />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formField.value}
                          onSelect={formField.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )
                  : (
                    <Textarea placeholder={field.placeholder} {...formField} />
                  )}
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">{submitButtonText}</Button>
      </form>
    </Form>
  );
};
