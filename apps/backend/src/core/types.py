"""Pydantic models for resume data structures.

This module defines the data models for parsing and validating resume information,
including personal details, work experience, education, skills, projects, certifications,
languages, and awards.
"""

from pydantic import BaseModel, EmailStr, Field


class Link(BaseModel):
    """A contact link with URL and platform information.

    Attributes:
    ----------
    url : str
        The URL to a contact link such as a portfolio, GitHub, LinkedIn, or other relevant site.
    platform : str
        The name of the platform for the contact link (e.g., 'GitHub', 'LinkedIn', 'Portfolio', etc.).
    """

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
    """Personal information section of a resume.

    Attributes:
    ----------
    phone_number : str
        The user's phone number.
    address : str
        The user's address.
    summary : str
        A brief summary or objective statement.
    age : str
        The age if mentioned in the resume.
    professional_title : str
        The specific position name (e.g., Software engineer, UX Designer).
    contact_links : list[Link]
        A list of contact links such as portfolio, GitHub, LinkedIn, or other relevant sites.
    """

    phone_number: str = Field(..., description="The user's phone number.")
    address: str = Field(..., description="The user's address.")
    summary: str = Field(..., description="A brief summary or objective statement.")
    age: str = Field(
        default="Not provided", description="The age if mentioned in the resume"
    )
    professional_title: str = Field(
        ...,
        description=(
            "The specific position name e.g:Software engineer, UX Designer, ..."
        ),
    )
    contact_links: list[Link] = Field(
        None,
        description=(
            "A list of contact links such as portfolio, GitHub, LinkedIn, or other "
            "relevant sites."
        ),
    )


class WorkExperience(BaseModel):
    """Work experience information.

    Attributes:
    ----------
    company_name : str
        Name of the company.
    position : str
        Job position or title.
    start_date : str
        Start date of employment (YYYY-MM-DD).
    end_date : str
        End date of employment (YYYY-MM-DD). Defaults to "Present" if current.
    responsibilities : str
        List of responsibilities or achievements.
    """

    company_name: str = Field(..., description="Name of the company.")
    position: str = Field(..., description="Job position or title.")
    start_date: str = Field(..., description="Start date of employment (YYYY-MM-DD).")
    end_date: str = Field(
        default="Present",
        description="End date of employment (YYYY-MM-DD). Optional, null if current.",
    )
    responsibilities: str = Field(
        ..., description="List of responsibilities or achievements."
    )


class Education(BaseModel):
    """Educational qualification information.

    Attributes:
    ----------
    institution : str
        Name of the educational institution.
    degree : str
        Degree obtained.
    field_of_study : str
        Field of study.
    start_date : str
        Start date of education (YYYY-MM-DD).
    end_date : str
        End date of education (YYYY-MM-DD). Defaults to "Present" if ongoing.
    grade : str
        Grade or GPA. Optional.
    """

    institution: str = Field(..., description="Name of the educational institution.")
    degree: str = Field(..., description="Degree obtained.")
    field_of_study: str = Field(..., description="Field of study.")
    start_date: str = Field(..., description="Start date of education (YYYY-MM-DD).")
    end_date: str = Field(
        default="Present",
        description="End date of education (YYYY-MM-DD). Optional, null if ongoing.",
    )
    grade: str = Field(None, description="Grade or GPA. Optional.")


class Skill(BaseModel):
    """A skill with proficiency level information.

    Attributes:
    ----------
    name : str
        Name of the skill.
    proficiency_level : str
        Proficiency level (e.g., Beginner, Intermediate, Expert).
    """

    name: str = Field(..., description="Name of the skill.")
    proficiency_level: str = Field(
        default="Not provided",
        description="Proficiency level (e.g., Beginner, Intermediate, Expert).",
    )


class Project(BaseModel):
    """Project information.

    Attributes:
    ----------
    title : str
        Project title.
    description : str
        Brief description of the project.
    technologies : list[str]
        Technologies used in the project.
    url : str
        URL to the project. Optional.
    """

    title: str = Field(..., description="Project title.")
    description: str = Field(..., description="Brief description of the project.")
    technologies: list[str] = Field(
        ..., description="Technologies used in the project."
    )
    url: str = Field(None, description="URL to the project. Optional.")


class Certification(BaseModel):
    """Certification information.

    Attributes:
    ----------
    name : str
        Certification name.
    issuer : str
        Certification issuer.
    issue_date : str
        Date the certification was issued (YYYY-MM-DD).
    """

    name: str = Field(..., description="Certification name.")
    issuer: str = Field(..., description="Certification issuer.")
    issue_date: str = Field(
        default="Not provided",
        description="Date the certification was issued (YYYY-MM-DD).",
    )


class Language(BaseModel):
    """Language proficiency information.

    Attributes:
    ----------
    name : str
        Language name.
    proficiency : str
        Proficiency level (e.g., Native, Fluent, Intermediate, Basic).
    """

    name: str = Field(..., description="Language name.")
    proficiency: str = Field(
        default="Not provided",
        description="Proficiency level (e.g., Native, Fluent, Intermediate, Basic).",
    )


class Award(BaseModel):
    """Award information.

    Attributes:
    ----------
    title : str
        Award title.
    issuer : str
        Award issuer.
    date : str
        Date the award was received (YYYY-MM-DD). Optional.
    description : str
        Description of the award. Optional.
    """

    title: str = Field(..., description="Award title.")
    issuer: str = Field(..., description="Award issuer.")
    date: str = Field(
        default="Not provided",
        description="Date the award was received (YYYY-MM-DD). Optional.",
    )
    description: str = Field(None, description="Description of the award. Optional.")


class Resume(BaseModel):
    """Complete resume information.

    Attributes:
    ----------
    name : str
        Full name of the user.
    email : EmailStr
        Email address of the user.
    personal_info : PersonalInfo
        Personal information section.
    work_experiences : list[WorkExperience]
        List of work experiences.
    educations : list[Education]
        List of educational qualifications.
    skills : list[Skill]
        List of skills.
    projects : list[Project]
        List of projects. Optional.
    certifications : list[Certification]
        List of certifications. Optional.
    hobbies : list[str]
        List of hobbies. Optional.
    languages : list[Language]
        List of languages. Optional.
    awards : list[Award]
        List of awards. Optional.
    """

    name: str = Field(..., description="Full name of the user.")
    email: EmailStr = Field(..., description="Email address of the user.")
    personal_info: PersonalInfo = Field(
        ..., description="Personal information section."
    )
    work_experiences: list[WorkExperience] = Field(
        ..., description="List of work experiences."
    )
    educations: list[Education] = Field(
        ..., description="List of educational qualifications."
    )
    skills: list[Skill] = Field(..., description="List of skills.")
    projects: list[Project] = Field(
        default_factory=list, description="List of projects. Optional"
    )
    certifications: list[Certification] = Field(
        default_factory=list, description="List of certifications.Optional"
    )
    hobbies: list[str] = Field(
        default_factory=list,
        description="List of hobbies. Optional, defaults to empty list.",
    )
    languages: list[Language] = Field(
        default_factory=list,
        description="List of languages. Optional, defaults to empty list.",
    )
    awards: list[Award] = Field(
        default_factory=list,
        description="List of awards. Optional, defaults to empty list.",
    )
