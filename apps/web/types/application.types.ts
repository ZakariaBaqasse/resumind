import { Resume } from "./resume.types"

export type EventStatus = "started" | "succeeded" | "failed"
export type EventName =
  | "pipeline.update"
  | "pipeline.step"
  | "research.category"
  | "tool.execution"
  | "artifact.generated"
  | "pipeline.completed"
  | "pipeline.failed"

export type PipelineStep =
  | "company_discovery"
  | "research"
  | "resume_generation"
  | "resume_drafting"
  | "resume_evaluation"
  | "cover_letter_generation"
  | "cover_letter_drafting"
  | "cover_letter_evaluation"

export type DiscoveredCompanyProfile = {
  company_name: string
  official_website?: string | null
  discovery_confidence: "high" | "medium" | "low"
  key_properties?: {
    careers_page?: string | null
    engineering_blog?: string | null
    about_page?: string | null
    contact_page?: string | null
  } | null
  company_characteristics?: {
    company_size_estimate:
      | "startup"
      | "small"
      | "medium"
      | "large"
      | "enterprise"
      | "unknown"
    company_type:
      | "public"
      | "private"
      | "startup"
      | "nonprofit"
      | "government"
      | "unknown"
  } | null
  research_context?: {
    information_availability: "high" | "medium" | "low"
    web_presence_quality: "professional" | "basic" | "minimal" | "poor"
    research_difficulty: "easy" | "moderate" | "challenging" | "very_difficult"
  } | null
  linkedin_company_page?: string | null
  additional_verified_urls?: string[]
  discovery_notes: string
  sources_consulted?: string[]
}

export type ResearchCategory = {
  category_name: string
  description: string
  priority: number
  data_points: string[]
}

export type ResearchPlan = {
  target_role: string
  research_categories: ResearchCategory[]
  rationale: string
}

export type CompanyProfile = {
  company_discovery_results?: DiscoveredCompanyProfile | null
  research_plan?: ResearchPlan | null
  // Per-category results; values are dynamic (strings, arrays, objects)
  research_results?: Record<string, string>
}

export type ResumeGenerationStatus =
  | "started"
  | "processing_company_profile"
  | "processing_resume_generation"
  | "processing_cover_letter"
  | "completed"
  | "failed"

export type ApplicationEvent = {
  id: string
  job_application_id: string
  event_name: EventName
  status?: EventStatus | null
  step?: PipelineStep | string | null
  category_name?: string | null
  tool_name?: string | null
  iteration?: number | null
  message?: string | null
  data?: Record<string, unknown> | null
  error?: Record<string, unknown> | null
  created_at?: string | null
}

export type JobApplicationSnapshot = {
  id: string
  job_title: string
  company_name: string
  job_description: string
  background_task_id?: string | null
  resume_generation_status?: ResumeGenerationStatus | null
  company_profile?: CompanyProfile | null
  generated_resume?: Resume
  original_resume_snapshot?: Resume
  generated_cover_letter?: string
  created_at?: string | null
  updated_at?: string | null
  events: ApplicationEvent[]
}

export type JobApplicationPreview = {
  id: string
  job_title: string
  company_name: string
  resume_generation_status?: ResumeGenerationStatus | null
  created_at: string
}

export type PaginatedJobApplicationsPreviews = {
  items: JobApplicationPreview[]
  total: number
  has_next: boolean
}
