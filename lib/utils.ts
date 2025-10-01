import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from "uuid";
import { Part } from "@google/generative-ai"

import { ERROR_CONSTRAINT_MESSAGES } from "@/constants";
import { ToastVariant, toastWithTimeout } from '@/hooks/use-toast';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// generate unique filename for uploaded files
export function generateUniqueFilename(originalName: string): string {
  const ext = originalName.split(".").pop(); // get file extension
  const base = originalName
    .replace(/\.[^/.]+$/, "") // remove extension
    .replace(/[^a-zA-Z0-9_-]/g, "_") // sanitize
    .slice(0, 50); // limit length

  return `${base}_${uuidv4()}.${ext}`;
}

// convert file to Generative AI part
export function fileToGenerativePart(buffer: Buffer, mimeType: string): Part {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  }
}

// convert FormData to object
export function formDataToObject(formData: FormData) {
  const obj: Record<string, any> = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

// get friendly error message from database error
export function getFriendlyDbErrorMessage({
  error,
  fallbackMessage,
}: {
  error: any;
  fallbackMessage?: string;
}): string {
  const rawMessage = error?.message || fallbackMessage || "Something went wrong";

  if (ERROR_CONSTRAINT_MESSAGES) {
    for (const constraint in ERROR_CONSTRAINT_MESSAGES) {
      if (rawMessage.includes(constraint)) {
        return ERROR_CONSTRAINT_MESSAGES[constraint as keyof typeof ERROR_CONSTRAINT_MESSAGES];
      }
    }
  }

  return rawMessage; // fallback if no mapping found
}

export function showErrorMessage({
  error,
  fallbackMessage,
}: {
  error: any;
  fallbackMessage?: string;
}): void {
  const errorMessage = getFriendlyDbErrorMessage({ error, fallbackMessage });
  console.error(errorMessage, error);
  toastWithTimeout(ToastVariant.Error, errorMessage);
}