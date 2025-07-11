from typing import List

from pydantic import BaseModel, EmailStr, Field


class Link(BaseModel):
    url: str = Field(
        ...,
        description=(
            "The URL to a contact link such as a portfolio, GitHub,"
            "LinkedIn, or other relevant site."
        ),
    )
    platform: str = Field(
        ...,
        description=(
            "The name of the platform for the contact link"
            ""
            "(e.g., 'GitHub', 'LinkedIn', 'Portfolio', etc.)."
        ),
    )


class PersonalInfo(BaseModel):
    phone_number: str = Field(..., description="The user's phone number.")
    address: str = Field(..., description="The user's address.")
    summary: str = Field(..., description="A brief summary or objective statement.")
    age: str = Field(None, description="The age if mentioned in the resume")
    professional_title: str = Field(
        ...,
        description=(
            "The specific position name e.g:Software engineer, UX Designer, ..."
        ),
    )
    contact_links: List[Link] = Field(
        None,
        description=(
            "A list of contact links such as portfolio, GitHub, LinkedIn, or other "
            "relevant sites."
        ),
    )


class WorkExperience(BaseModel):
    company_name: str = Field(..., description="Name of the company.")
    position: str = Field(..., description="Job position or title.")
    start_date: str = Field(..., description="Start date of employment (YYYY-MM-DD).")
    end_date: str = Field(
        None,
        description="End date of employment (YYYY-MM-DD). Optional, null if current.",
    )
    responsibilities: str = Field(
        ..., description="List of responsibilities or achievements."
    )


class Education(BaseModel):
    institution: str = Field(..., description="Name of the educational institution.")
    degree: str = Field(..., description="Degree obtained.")
    field_of_study: str = Field(..., description="Field of study.")
    start_date: str = Field(..., description="Start date of education (YYYY-MM-DD).")
    end_date: str = Field(
        None,
        description="End date of education (YYYY-MM-DD). Optional, null if ongoing.",
    )
    grade: str = Field(None, description="Grade or GPA. Optional.")


class Skill(BaseModel):
    name: str = Field(..., description="Name of the skill.")
    proficiency_level: str = Field(
        ..., description="Proficiency level (e.g., Beginner, Intermediate, Expert)."
    )


class Project(BaseModel):
    title: str = Field(..., description="Project title.")
    description: str = Field(..., description="Brief description of the project.")
    technologies: List[str] = Field(
        ..., description="Technologies used in the project."
    )
    url: str = Field(None, description="URL to the project. Optional.")


class Certification(BaseModel):
    name: str = Field(..., description="Certification name.")
    issuer: str = Field(..., description="Certification issuer.")
    issue_date: str = Field(
        ..., description="Date the certification was issued (YYYY-MM-DD)."
    )


class Language(BaseModel):
    name: str = Field(..., description="Language name.")
    proficiency: str = Field(
        ...,
        description="Proficiency level (e.g., Native, Fluent, Intermediate, Basic).",
    )


class Award(BaseModel):
    title: str = Field(..., description="Award title.")
    issuer: str = Field(..., description="Award issuer.")
    date: str = Field(
        None, description="Date the award was received (YYYY-MM-DD). Optional."
    )
    description: str = Field(None, description="Description of the award. Optional.")


class Resume(BaseModel):
    name: str = Field(..., description="Full name of the user.")
    email: EmailStr = Field(..., description="Email address of the user.")
    personal_info: PersonalInfo = Field(
        ..., description="Personal information section."
    )
    work_experiences: List[WorkExperience] = Field(
        ..., description="List of work experiences."
    )
    educations: List[Education] = Field(
        ..., description="List of educational qualifications."
    )
    skills: List[Skill] = Field(..., description="List of skills.")
    projects: List[Project] = Field(
        default_factory=list, description="List of projects. Optional"
    )
    certifications: List[Certification] = Field(
        default_factory=list, description="List of certifications.Optional"
    )
    hobbies: List[str] = Field(
        default_factory=list,
        description="List of hobbies. Optional, defaults to empty list.",
    )
    languages: List[Language] = Field(
        default_factory=list,
        description="List of languages. Optional, defaults to empty list.",
    )
    awards: List[Award] = Field(
        default_factory=list,
        description="List of awards. Optional, defaults to empty list.",
    )
