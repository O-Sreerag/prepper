import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from "uuid";

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