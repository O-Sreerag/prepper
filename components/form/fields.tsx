"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { BaseTextInput, BaseTextArea, BaseSelect, BaseFileInput } from "./base-inputs";

// 📝 Text Input
interface TextInputFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
}
export function TextInputFormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: TextInputFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <BaseTextInput {...field} placeholder={placeholder} type={type} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// 📝 TextArea
interface TextAreaFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}
export function TextAreaFormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: TextAreaFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <BaseTextArea {...field} placeholder={placeholder} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// 📝 Select
interface SelectFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}
export function SelectFormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
}: SelectFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <BaseSelect
              placeholder={placeholder}
              value={field.value}
              onChange={field.onChange}
              options={options}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// 📝 File Upload
interface FileUploadFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  icon?: "upload" | "file";
  optionalText?: string;
}
export function FileUploadFormField<T extends FieldValues>({
  control,
  name,
  label,
  icon = "upload",
  optionalText,
}: FileUploadFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <BaseFileInput
              icon={icon}
              file={field.value as File}
              onChange={(file) => field.onChange(file)}
              optionalText={optionalText}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
