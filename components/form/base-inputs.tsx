"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface BaseTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const BaseTextInput = (props: BaseTextInputProps) => <Input {...props} />;

interface BaseTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export const BaseTextArea = (props: BaseTextAreaProps) => <Textarea {...props} />;

interface BaseSelectProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  options: { value: string; label: string }[];
}
export const BaseSelect = ({ placeholder, value, onChange, options }: BaseSelectProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

interface BaseFileInputProps {
  label?: string;
  file?: File;
  onChange: (file: File | undefined) => void;
  icon?: "upload" | "file";
  optionalText?: string;
}
export const BaseFileInput = ({
  file,
  onChange,
  icon = "upload",
  optionalText,
}: BaseFileInputProps) => {
  const inputId = crypto.randomUUID();

  return (
    <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
      {icon === "upload" ? (
        <Icons.upload className="mx-auto h-8 w-8 mb-2" />
      ) : (
        <Icons.fileText className="mx-auto h-8 w-8 mb-2" />
      )}
      <p className="text-sm mb-2 truncate">{file?.name || optionalText || "Drop or click to select"}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => document.getElementById(inputId)?.click()}
      >
        Choose File
      </Button>
      <Input
        id={inputId}
        type="file"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0])}
      />
    </div>
  );
};
