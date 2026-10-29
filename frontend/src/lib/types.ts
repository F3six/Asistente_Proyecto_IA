export interface Project {
  id: number;
  name: string;
  path: string;
  framework: string | null;
  architecture_type: string | null;
  alignment_score: number;
  total_files: number;
  misplaced_files_count: number;
  created_at: string;
  updated_at: string;
}

export interface ErrorLog {
  id: number;
  project_id?: number | null;
  title: string;
  category: "Database" | "Routing" | "Views" | "Security" | string;
  layer?: string | null;
  symptom: string;
  root_cause?: string | null;
  solution: string;
  status: "open" | "resolved" | "verified" | string;
  resolved_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MisplacedFileDetail {
  file_name: string;
  current_path: string;
  suggested_path: string;
  reason: string;
  severity: string;
}

export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[];
  layer?: string;
  is_misplaced?: boolean;
  warning_reason?: string;
  annotation?: string;
  metadata?: Record<string, any>;
}

export interface AnalysisResponse {
  project_id?: number;
  project_name: string;
  framework: string;
  version?: string;
  architecture_type: string;
  alignment_score: number;
  total_files: number;
  misplaced_count: number;
  active_layers: string[];
  misplaced_files: MisplacedFileDetail[];
  structure: TreeNode[];
}

export interface FolderExplanation {
  folder_name: string;
  layer_name: string;
  description_simple: string;
  expected_contents: string;
  architecture_role: string;
  naming_conventions: string[];
  anti_patterns: string[];
  key_annotations_or_keywords: Array<{ name: string; description: string }>;
  educational_tip?: string;
}

export interface ComplementaryFile {
  name: string;
  path: string;
  annotation: string;
  layer: string;
  responsibility: string;
}

export interface FileSuggestion {
  framework: string;
  detected_intent: string;
  primary_file: string;
  primary_path: string;
  annotation_or_pattern: string;
  layer: string;
  architectural_responsibility: string;
  naming_convention: string;
  complementary_files: ComplementaryFile[];
  checklist: Array<{ step: string; title: string; detail: string }>;
  educational_tip: string;
}

export interface ProjectReport {
  project_id: number;
  project_name: string;
  framework: string;
  architecture_type: string;
  alignment_score: number;
  total_files: number;
  misplaced_files_count: number;
  misplaced_files: MisplacedFileDetail[];
  structure_summary: TreeNode[];
  errors_summary: {
    total_errors: number;
    by_category: Record<string, number>;
  };
  academic_evaluation: {
    health_status: string;
    conclusion: string;
    standards_evaluated: string;
    verification_hash: string;
  };
}
