import { TestPaperType, UploadFileType } from './index';

export interface ParsedQuestionType {
  parsed_questions_id: string;
  test_paper_id: string;
  upload_file_id: string;
  page_number: number | null;
  sequence_in_doc: number | null;
  question_text: string;
  options: { options: string[] } | null;
  detected_answer: string | null;
  detected_answer_confidence: number | null;
  ocr_text: string | null;
  parse_confidence: number | null;
  need_review: boolean;
  review_status: 'pending' | 'approved' | 'rejected' | 'needs_changes';
  reviewer_id: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface QuestionReviewStatus {
  questionId: string;
  status: 'approved' | 'rejected' | 'needs_changes';
  notes?: string;
  correctedAnswer?: string;
  correctedOptions?: string[];
}

export interface TestPaperDetailsType extends TestPaperType {
  upload_files: UploadFileType[];
  parsed_questions: ParsedQuestionType[];
  upload_progress?: {
    total_files: number;
    total_pages: number;
    pages_processed: number;
    questions_found: number;
    questions_parsed: number;
    questions_confirmed: number;
    failed_count: number;
  };
}
