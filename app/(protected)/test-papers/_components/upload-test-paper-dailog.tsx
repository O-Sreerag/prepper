import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { GenericDialog } from "@/components/dailogs/generic";
import { TextInputFormField, TextAreaFormField, SelectFormField, FileUploadFormField } from "@/components/form/fields";
import { ToastVariant, toastWithTimeout } from "@/hooks/use-toast";
import { UploadPaperInput, UploadPaperSchema } from "@/app/(protected)/test-papers/_schemas";
import { TEST_PAPER_SUBJECT_OPTIONS, TEST_PAPER_DIFFICULTY_OPTIONS } from "@/app/(protected)/test-papers/_constants";
import { showErrorMessage } from "@/lib/utils";

interface UploadPaperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadPaperDialog({ open, onOpenChange }: UploadPaperDialogProps) {
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<UploadPaperInput>({
    resolver: zodResolver(UploadPaperSchema),
    defaultValues: {
      title: "",
      subject: "physics",
      duration: undefined,
      difficulty: "easy",
      description: "",
      tags: "",
      questionFile: undefined,
      answerFile: undefined,
    },
  });

  const handleSubmit: SubmitHandler<UploadPaperInput> = async (data) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value as any);
      });

      const res = await fetch("/api/test-paper/upload-files", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Upload failed");

      toastWithTimeout(ToastVariant.Success, "Upload successful!");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      showErrorMessage({ error, fallbackMessage: "An unknown error occurred" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <GenericDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Upload Question Paper"
      description="Upload a question paper and its answer sheet to begin processing."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-1">
          <FileUploadFormField control={form.control} name="questionFile" label="Question Paper" icon="upload" />
          <FileUploadFormField control={form.control} name="answerFile" label="Answer Sheet (Optional)" icon="file" optionalText="Optional" />
          <TextInputFormField control={form.control} name="title" label="Title" placeholder="Enter paper title" />
          <SelectFormField control={form.control} name="subject" label="Subject" options={TEST_PAPER_SUBJECT_OPTIONS} />
          <TextInputFormField control={form.control} name="duration" label="Duration (min)" type="number" />
          <SelectFormField control={form.control} name="difficulty" label="Difficulty" options={TEST_PAPER_DIFFICULTY_OPTIONS} />
          <TextAreaFormField control={form.control} name="description" label="Description" placeholder="Enter a description" />
          <TextInputFormField control={form.control} name="tags" label="Tags (comma-separated)" placeholder="e.g., kinematics, thermodynamics" />

          {form.formState.errors.root && (
            <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Upload & Process
            </Button>
          </div>
        </form>
      </Form>
    </GenericDialog>
  );
}
