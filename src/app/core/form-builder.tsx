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
                  {field.fieldType === "file" ? (
                    <Input type="file" 
                    onChange={(event) =>
                      formField.onChange(event.target.files && event.target.files[0])
                    }
                    />
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
                        {formField.value.length > 0
                          ? `Selected: ${formField.value.join(",")}`
                          : "Select Tags"}
                      </Button>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Select or Add Tags</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {formField.value.map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="cursor-pointer"
                                  onClick={() =>
                                    formField.onChange(
                                      formField.value.filter(
                                        (t: string) => t !== tag
                                      )
                                    )
                                  }
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add new tag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  if (
                                    newTag &&
                                    !formField.value.includes(newTag)
                                  ) {
                                    formField.onChange([
                                      ...(formField.value || []),
                                      newTag,
                                    ]);
                                    setNewTag("");
                                  }
                                }}
                              >
                                Add Tag
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {field.tagOptions?.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant={
                                    formField.value.includes(tag)
                                      ? "default"
                                      : "outline"
                                  }
                                  className="cursor-pointer"
                                  onClick={() => {
                                    if (formField.value?.includes(tag)) {
                                      formField.onChange(
                                        formField.value.filter(
                                          (t: string) => t !== tag
                                        )
                                      );
                                    } else {
                                      formField.onChange([
                                        ...(formField.value || []),
                                        tag,
                                      ]);
                                    }
                                  }}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={() => setDialogOpen(false)}>
                              Done
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
