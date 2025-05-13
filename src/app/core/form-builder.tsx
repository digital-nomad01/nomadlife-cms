import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {z} from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type FieldType = "input" | "textarea" | "dropdown";

export type FormFieldConfig = {
    name: string;
    label: string;
    type?: string; // Optional, defaults to 'text' for inputs
    fieldType: FieldType;
    placeholder: string;
    description?: string;
    options?: string[]; // For dropdowns
  };
  
  export type ReusableFormProps = {
    fields: FormFieldConfig[];
    schema: z.ZodObject<any>; // Accept any Zod object schema
    onSubmit: (data: any) => void | Promise<void>;
    submitButtonText: string;
    defaultValues: Record<string, any>;
  };



export const FormBuilder = ({ fields, schema, onSubmit, submitButtonText, defaultValues }: ReusableFormProps) => {
    const form = useForm({
      resolver: zodResolver(schema),
      defaultValues,
    });
  
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
                    {field.fieldType === "input" ? (
                      <Input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        {...formField}
                      />
                    ) : field.fieldType === "dropdown" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            {formField.value || "Select an option"}
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
                    ) : (
                      <Textarea
                        placeholder={field.placeholder}
                        {...formField}
                      />
                    )}
                  </FormControl>
                  {field.description && (
                    <FormDescription>{field.description}</FormDescription>
                  )}
                </FormItem>
              )}
            />
          ))}
          <Button type="submit">{submitButtonText}</Button>
        </form>
      </Form>
    );
  };