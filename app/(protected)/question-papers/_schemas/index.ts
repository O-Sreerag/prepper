import { z } from "zod";

export const uploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  duration: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  description: z.string().optional(),
  tags: z.string().optional(),
});

export const DifficultyEnum = z.enum(["easy", "medium", "hard"]);
export const SubjectEnum = z.enum(["physics", "chemistry", "biology", "mathematics"]);

export const UploadPaperSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: SubjectEnum,
  duration: z.union([z.string(), z.number()]).optional(),
  difficulty: DifficultyEnum.optional(),
  description: z.string().optional(),
  tags: z.string().optional(),
  questionFile: z.instanceof(File),
  answerFile: z.instanceof(File).optional(),
});

export type UploadPaperInput = z.infer<typeof UploadPaperSchema>;