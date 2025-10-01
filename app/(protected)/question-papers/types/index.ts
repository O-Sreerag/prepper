export type DifficultyLevelType = "easy" | "medium" | "hard";

export type UploadStatusType = "queued" | "processing" | "failed" | "review" | "completed";

export type FileRoleType = "questions" | "answers";

export interface UploadJobType {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  duration_minutes: number | null;
  difficulty: DifficultyLevelType | null;
  description: string | null;
  tags: string[];
  status: UploadStatusType;
  created_at: string;
  updated_at: string;
}

export interface UploadFileType {
  id: string;
  upload_job_id: string;
  user_id: string;
  storage_url: string;
  filename: string;
  mime_type: string;
  pages_count: number | null;
  file_role: FileRoleType;
  created_at: string;
}
