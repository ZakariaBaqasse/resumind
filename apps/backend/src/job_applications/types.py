"""Type definitions and models for job application processing.

This module contains:
- Enums for tracking pipeline status, events, steps, and discovery confidence
- Data models for company profiles, research plans, and company characteristics
- Request/response models for job application workflows
- Evaluation models for generated resumes and cover letters
"""

import ast
import json
import re
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, field_validator

from src.core.types import Resume


class ResumeGenerationStatus(Enum):
    """Enum representing the status of resume generation."""

    STARTED = "started"
    PROCESSING_COMPANY_PROFILE = "processing_company_profile"
    PROCESSING_RESUME_GENERATION = "processing_resume_generation"
    PROCESSING_COVER_LETTER = "processing_cover_letter"
    COMPLETED = "completed"
    FAILED = "failed"


class EventStatus(Enum):
    """Enum representing the status of an event."""

    STARTED = "started"
    SUCCEEDED = "succeeded"
    FAILED = "failed"


class EventName(Enum):
    """Enum representing the name of an event."""

    PIPELINE_UPDATE = "pipeline.update"
    PIPELINE_STEP = "pipeline.step"
    RESEARCH_CATEGORY = "research.category"
    TOOL_EXECUTION = "tool.execution"
    ARTIFACT_GENERATED = "artifact.generated"
    PIPELINE_COMPLETED = "pipeline.completed"
    PIPELINE_FAILED = "pipeline.failed"


class PipelineStep(Enum):
    """Enum representing the steps in the job application processing pipeline."""

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
    """Model representing a research category within a research plan."""

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
    data_points: list[str] = Field(
        ...,
        description="Specific data points or aspects to look for within this category.",
    )


class ResearchPlan(BaseModel):
    """Model representing a research plan for a specific job role."""

    target_role: str = Field(
        ...,
        description="The job role or position that this research plan is targeting.",
    )
    research_categories: list[ResearchCategory] = Field(
        ...,
        description="A list of research categories to investigate for the target role.",
    )
    rationale: str = Field(
        ..., description="Explanation of why these research categories were chosen."
    )


class CompanyProfile(BaseModel):
    """Model representing a company profile."""

    company_discovery_results: "DiscoveredCompanyProfile" = Field(
        ...,
        description="The raw, unstructured information gathered during the initial discovery phase of the company profile.",
    )
    research_plan: ResearchPlan = Field(
        ..., description="The research plan used to guide company research."
    )
    research_results: dict[str, Any] = Field(
        ...,
        description="Dynamic key-value pairs containing the results of the research for each category.",
    )


class DiscoveryConfidence(str, Enum):
    """Enum representing the confidence level in the discovered company information."""

    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class CompanySizeEstimate(str, Enum):
    """Enum representing the estimated size of a company."""

    STARTUP = "startup"
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    ENTERPRISE = "enterprise"
    UNKNOWN = "unknown"


class CompanyType(str, Enum):
    """Enum representing the type of a company."""

    PUBLIC = "public"
    PRIVATE = "private"
    STARTUP = "startup"
    NONPROFIT = "nonprofit"
    GOVERNMENT = "government"
    UNKNOWN = "unknown"


class InformationAvailability(str, Enum):
    """Enum representing the availability of information about a company."""

    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class WebPresenceQuality(str, Enum):
    """Enum representing the quality of a company's web presence."""

    PROFESSIONAL = "professional"
    BASIC = "basic"
    MINIMAL = "minimal"
    POOR = "poor"


class ResearchDifficulty(str, Enum):
    """Enum representing the difficulty of researching a company."""

    EASY = "easy"
    MODERATE = "moderate"
    CHALLENGING = "challenging"
    VERY_DIFFICULT = "very_difficult"


class KeyProperties(BaseModel):
    """Model representing key web properties of a company."""

    careers_page: str | None = Field(
        None, description="URL of the company's careers page."
    )
    engineering_blog: str | None = Field(
        None, description="URL of the company's engineering blog."
    )
    about_page: str | None = Field(None, description="URL of the company's about page.")
    contact_page: str | None = Field(
        None, description="URL of the company's contact page."
    )


class CompanyCharacteristics(BaseModel):
    """Model representing characteristics of a company."""

    industry_sector: str | None = Field(
        None, description="The industry sector the company operates in."
    )
    company_size_estimate: CompanySizeEstimate = Field(
        ..., description="Estimated size of the company."
    )
    company_type: CompanyType = Field(..., description="Type of the company.")


class ResearchContext(BaseModel):
    """Model representing the context of research for a company."""

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
    """Model representing a company profile."""

    company_name: str = Field(..., description="The name of the company.")
    official_website: str | None = Field(
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
    linkedin_company_page: str | None = Field(
        None, description="URL of the company's LinkedIn page."
    )
    additional_verified_urls: list[str] = Field(
        [], description="Additional verified URLs related to the company."
    )
    discovery_notes: str = Field(..., description="Notes from the discovery process.")
    sources_consulted: list[str] = Field(
        [], description="List of sources consulted during the discovery."
    )


class CreateJobApplicationRequest(BaseModel):
    """Request model for creating a job application."""

    job_role: str
    job_description: str
    company: str


class GeneratedResumeEvaluation(BaseModel):
    """Model representing the evaluation of a generated resume."""

    grade: int = Field(
        ...,
        description=(
            "A numerical score (0-100) representing the overall quality of the generated resume. Higher values indicate a better match to the job requirements and resume best practices."
        ),
    )
    changes: dict[str, str] = Field(
        ...,
        description=(
            "A dictionary mapping each resume field (e.g., 'summary', 'experience', 'skills') to a suggested enhancement. The key is the field name, and the value is a detailed recommendation or edit to improve that section."
        ),
    )
    summary: str = Field(
        ...,
        description=(
            "A comprehensive narrative summarizing the evaluation of the resume, including strengths, weaknesses, and overall fit for the target job. This should provide actionable feedback and context for the assigned grade."
        ),
    )

    @field_validator("grade", mode="before")
    def _coerce_grade(cls, v):
        if isinstance(v, str):
            # Extract first integer-like token, clamp to [0, 100] if needed
            m = re.search(r"\d{1,3}", v)
            if m:
                n = int(m.group(0))
                return max(0, min(100, n))
        return v

    @field_validator("changes", mode="before")
    def _parse_changes(cls, v):
        # If already a dict, ensure all values are strings
        if isinstance(v, dict):
            return {
                str(k): (val if isinstance(val, str) else json.dumps(val))
                for k, val in v.items()
            }

        # If it's a string, try to parse JSON (handle code fences)
        if isinstance(v, str):
            s = v.strip()

            # Strip ```json ... ``` fences if present
            if s.startswith("```"):
                s = re.sub(r"^```(?:json|JSON)?\s*", "", s).strip()
                s = re.sub(r"\s*```$", "", s).strip()

            # Try JSON first
            try:
                parsed = json.loads(s)
                if isinstance(parsed, dict):
                    return {
                        str(k): (val if isinstance(val, str) else json.dumps(val))
                        for k, val in parsed.items()
                    }
            except Exception:
                pass

            # Try Python literal dict (sometimes models return single quotes)
            try:
                parsed = ast.literal_eval(s)
                if isinstance(parsed, dict):
                    return {
                        str(k): (val if isinstance(val, str) else json.dumps(val))
                        for k, val in parsed.items()
                    }
            except Exception:
                pass

            # Fallback: put the entire text under a generic key to avoid hard failure
            return {"overall_structure": s}

        return v


class GeneratedCoverLetterEvaluation(BaseModel):
    """Model representing the evaluation of a generated cover letter."""

    grade: int = Field(
        ...,
        description=(
            "A numerical score (0-100) representing the overall quality of the generated cover letter. Higher values indicate a better match to the job requirements and cover letter best practices."
        ),
    )
    changes: list[str] = Field(
        ...,
        description=(
            "A list of suggested improvements or edits to the cover letter. Each item should be a detailed recommendation to enhance the content, structure, or alignment with the job requirements."
        ),
    )
    summary: str = Field(
        ...,
        description=(
            "A comprehensive narrative summarizing the evaluation of the cover letter, including strengths, weaknesses, and overall fit for the target job. This should provide actionable feedback and context for the assigned grade."
        ),
    )

    @field_validator("grade", mode="before")
    def _coerce_grade(cls, v):
        if isinstance(v, str):
            m = re.search(r"\d{1,3}", v)
            if m:
                n = int(m.group(0))
                return max(0, min(100, n))
        return v

    @field_validator("changes", mode="before")
    def _parse_changes(cls, v):
        if isinstance(v, list):
            return [item if isinstance(item, str) else json.dumps(item) for item in v]

        if isinstance(v, str):
            s = v.strip()
            if s.startswith("```"):
                s = re.sub(r"^```(?:json|JSON)?\s*", "", s).strip()
                s = re.sub(r"\s*```$", "", s).strip()

            # Try parse JSON array
            try:
                parsed = json.loads(s)
                if isinstance(parsed, list):
                    return [
                        item if isinstance(item, str) else json.dumps(item)
                        for item in parsed
                    ]
            except Exception:
                pass

            # Fallback: wrap as a single-item list
            return [s]

        return v


class CoverLetterResponse(BaseModel):
    """Model representing the response containing the generated cover letter."""

    content: str = Field(
        ..., description="The full text content of the generated cover letter."
    )


class JobApplicationPreview(BaseModel):
    """Model representing a preview of a job application."""

    id: str
    job_title: str
    company_name: str
    created_at: datetime
    resume_generation_status: str | None


class ResumesCreationStats(BaseModel):
    """Model representing statistics about resume creation."""

    total_created: int
    created_this_month: int
    completed: int


class ResumeStrategyBrief(BaseModel):
    """Model representing a brief summary of the resume generation strategy."""

    top_keywords: list[str] = Field(
        ...,
        description="Exactly 5 keywords extracted from the job description and woven into the resume.",
    )
    narrative_changes: list[str] = Field(
        ...,
        description="2–3 major narrative changes made to align the resume with the target role.",
    )


class ResumeGenerationOutput(BaseModel):
    """Model representing the output of the resume generation process."""

    resume: Resume = Field(..., description="The tailored resume structured output.")
    strategy_brief: ResumeStrategyBrief = Field(
        ...,
        description="The strategy brief summarising top keywords and key narrative changes.",
    )
