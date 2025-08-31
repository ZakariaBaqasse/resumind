from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class ResumeGenerationStatus(Enum):
    STARTED = "started"
    PROCESSING_COMPANY_PROFILE = "processing_company_profile"
    PROCESSING_RESUME_GENERATION = "processing_resume_generation"
    PROCESSING_COVER_LETTER = "processing_cover_letter"
    COMPLETED = "completed"
    FAILED = "failed"


class EventStatus(str, Enum):
    STARTED = "started"
    SUCCEEDED = "succeeded"
    FAILED = "failed"


class EventName(str, Enum):
    PIPELINE_UPDATE = "pipeline.update"
    PIPELINE_STEP = "pipeline.step"
    RESEARCH_CATEGORY = "research.category"
    TOOL_EXECUTION = "tool.execution"
    ARTIFACT_GENERATED = "artifact.generated"
    PIPELINE_COMPLETED = "pipeline.completed"
    PIPELINE_FAILED = "pipeline.failed"


class PipelineStep(str, Enum):
    RESUME_GENERATION = "resume_generation"
    COMPANY_DISCOVERY = "company_discovery"
    RESEARCH_PLANNING = "research_planning"
    RESEARCH = "research"
    RESUME_DRAFTING = "resume_drafting"
    RESUME_EVALUATION = "resume_evaluation"
    COVER_LETTER_GENERATION = "cover_letter_generation"
    COVER_LETTER_DRAFTING = "cover_letter_drafting"
    COVER_LETTER_EVALUATION = "cover_letter_evaluation"


class ResearchCategory(BaseModel):
    category_name: str = Field(
        ...,
        description="The name of the research category (e.g., 'Company Mission', 'Tech Stack').",
    )
    description: str = Field(
        ..., description="A description of what this research category covers."
    )
    priority: int = Field(
        ..., description="Priority of the category (1-5, higher means more important)."
    )
    data_points: List[str] = Field(
        ...,
        description="Specific data points or aspects to look for within this category.",
    )


class ResearchPlan(BaseModel):
    target_role: str = Field(
        ...,
        description="The job role or position that this research plan is targeting.",
    )
    research_categories: List[ResearchCategory] = Field(
        ...,
        description="A list of research categories to investigate for the target role.",
    )
    rationale: str = Field(
        ..., description="Explanation of why these research categories were chosen."
    )


class CompanyProfile(BaseModel):
    company_discovery_results: "DiscoveredCompanyProfile" = Field(
        ...,
        description="The raw, unstructured information gathered during the initial discovery phase of the company profile.",
    )
    research_plan: ResearchPlan = Field(
        ..., description="The research plan used to guide company research."
    )
    research_results: Dict[str, Any] = Field(
        ...,
        description="Dynamic key-value pairs containing the results of the research for each category.",
    )


class DiscoveryConfidence(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class CompanySizeEstimate(str, Enum):
    STARTUP = "startup"
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    ENTERPRISE = "enterprise"
    UNKNOWN = "unknown"


class CompanyType(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    STARTUP = "startup"
    NONPROFIT = "nonprofit"
    GOVERNMENT = "government"
    UNKNOWN = "unknown"


class InformationAvailability(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class WebPresenceQuality(str, Enum):
    PROFESSIONAL = "professional"
    BASIC = "basic"
    MINIMAL = "minimal"
    POOR = "poor"


class ResearchDifficulty(str, Enum):
    EASY = "easy"
    MODERATE = "moderate"
    CHALLENGING = "challenging"
    VERY_DIFFICULT = "very_difficult"


class KeyProperties(BaseModel):
    careers_page: Optional[str] = Field(
        None, description="URL of the company's careers page."
    )
    engineering_blog: Optional[str] = Field(
        None, description="URL of the company's engineering blog."
    )
    about_page: Optional[str] = Field(
        None, description="URL of the company's about page."
    )
    contact_page: Optional[str] = Field(
        None, description="URL of the company's contact page."
    )


class CompanyCharacteristics(BaseModel):
    industry_sector: Optional[str] = Field(
        None, description="The industry sector the company operates in."
    )
    company_size_estimate: CompanySizeEstimate = Field(
        ..., description="Estimated size of the company."
    )
    company_type: CompanyType = Field(..., description="Type of the company.")


class ResearchContext(BaseModel):
    information_availability: InformationAvailability = Field(
        ..., description="Availability of information about the company."
    )
    web_presence_quality: WebPresenceQuality = Field(
        ..., description="Quality of the company's web presence."
    )
    research_difficulty: ResearchDifficulty = Field(
        ..., description="Difficulty of researching the company."
    )


class DiscoveredCompanyProfile(BaseModel):
    company_name: str = Field(..., description="The name of the company.")
    official_website: Optional[str] = Field(
        None, description="The official website of the company."
    )
    discovery_confidence: DiscoveryConfidence = Field(
        ..., description="Confidence level in the discovered information."
    )
    key_properties: KeyProperties = Field(
        ..., description="Key web properties of the company."
    )
    company_characteristics: CompanyCharacteristics = Field(
        ..., description="Characteristics of the company."
    )
    research_context: ResearchContext = Field(
        ..., description="Context about the research process."
    )
    linkedin_company_page: Optional[str] = Field(
        None, description="URL of the company's LinkedIn page."
    )
    additional_verified_urls: List[str] = Field(
        [], description="Additional verified URLs related to the company."
    )
    discovery_notes: str = Field(..., description="Notes from the discovery process.")
    sources_consulted: List[str] = Field(
        [], description="List of sources consulted during the discovery."
    )


class CreateJobApplicationRequest(BaseModel):
    job_role: str
    job_description: str
    company: str


class GeneratedResumeEvaluation(BaseModel):
    grade: int = Field(
        ...,
        description=(
            "A numerical score (0-100) representing the overall quality of the generated resume. "
            "Higher values indicate a better match to the job requirements and resume best practices."
        ),
    )
    changes: Dict[str, str] = Field(
        ...,
        description=(
            "A dictionary mapping each resume field (e.g., 'summary', 'experience', 'skills') to a suggested enhancement. "
            "The key is the field name, and the value is a detailed recommendation or edit to improve that section."
        ),
    )
    summary: str = Field(
        ...,
        description=(
            "A comprehensive narrative summarizing the evaluation of the resume, including strengths, weaknesses, "
            "and overall fit for the target job. This should provide actionable feedback and context for the assigned grade."
        ),
    )


class GeneratedCoverLetterEvaluation(BaseModel):
    grade: int = Field(
        ...,
        description=(
            "A numerical score (0-100) representing the overall quality of the generated cover letter. "
            "Higher values indicate a better match to the job requirements and cover letter best practices."
        ),
    )
    changes: List[str] = Field(
        ...,
        description=(
            "A list of suggested improvements or edits to the cover letter. "
            "Each item should be a detailed recommendation to enhance the content, structure, or alignment with the job requirements."
        ),
    )
    summary: str = Field(
        ...,
        description=(
            "A comprehensive narrative summarizing the evaluation of the cover letter, including strengths, weaknesses, "
            "and overall fit for the target job. This should provide actionable feedback and context for the assigned grade."
        ),
    )


class CoverLetterResponse(BaseModel):
    content: str = Field(
        ..., description="The full text content of the generated cover letter."
    )


class JobApplicationPreview(BaseModel):
    id: str
    job_title: str
    company_name: str
    created_at: datetime
    resume_generation_status: Optional[str]


class ResumesCreationStats(BaseModel):
    total_created: int
    created_this_month: int
    completed: int
