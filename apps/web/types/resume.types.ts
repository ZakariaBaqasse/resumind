// Types based on your Pydantic models

interface Skill {
  name: string
  proficiency_level: string
}

interface Project {
  title: string
  description: string
  technologies: string[]
  url?: string | null
}

interface Certification {
  name: string
  issuer: string
  issue_date: string
}

interface Language {
  name: string
  proficiency: string
}

interface Link {
  url: string
  platform: string
}
export interface PersonalInfo {
  phone_number: string
  address: string
  summary: string
  contact_links?: Link[] | null
  age?: number | null
  professional_title: string
}

interface WorkExperience {
  company_name: string
  position: string
  start_date: string
  end_date?: string | null
  responsibilities: string
}

interface Education {
  institution: string
  degree: string
  field_of_study: string
  start_date: string
  end_date?: string | null
  grade?: string | null
}

interface Award {
  title: string
  issuer: string
  date?: string | null
  description?: string | null
}

export interface Resume {
  name: string
  email: string
  personal_info: PersonalInfo
  work_experiences: WorkExperience[]
  educations: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  hobbies?: string[] | null
  languages?: Language[] | null
  awards?: Award[] | null
}
