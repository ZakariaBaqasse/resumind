import * as z from "zod"

// Zod schema for validation
const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  proficiency_level: z.string(),
})
const personalInfoSchema = z.object({
  phone_number: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  summary: z.string().min(1, "Summary is required"),
  age: z.number().min(2, "Please enter a valid age").optional().nullable(),
  professional_title: z
    .string()
    .min(5, "Please enter a valid professional title"),
  contact_links: z
    .array(
      z.object({
        url: z
          .string()
          .url("Invalid URL example valid url: https://example.com"),
        platform: z.string().min(1, "Platform is required"),
      })
    )
    .nullable()
    .optional(),
})
const workExperienceSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().nullable().optional(),
  responsibilities: z.string().min(1, "Responsibilities are required"),
})
const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field_of_study: z.string().min(1, "Field of study is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().nullable().optional(),
  grade: z.string().nullable().optional(),
})
const awardSchema = z.object({
  title: z.string().min(1, "Award title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
})
const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issue_date: z.string().min(1, "Issue date is required"),
})
const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Description is required"),
  technologies: z
    .array(z.string())
    .min(1, "At least one technology is required"),
  url: z
    .string()
    .url("Invalid URL example valid url: https://example.com")
    .nullable()
    .optional(),
})

const languageSchema = z.object({
  name: z.string().min(1, "Language name is required"),
  proficiency: z.string().min(1, "Proficiency level is required"),
})

export const resumeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  personal_info: personalInfoSchema,
  work_experiences: z
    .array(workExperienceSchema)
    .min(1, "Add at least one work experience"),
  educations: z.array(educationSchema).min(1, "Add at least one education"),
  skills: z.array(skillSchema).min(1, "Add at least one skill"),
  awards: z.array(awardSchema).nullable().optional(),
  certifications: z.array(certificationSchema),
  projects: z.array(projectSchema),
  hobbies: z
    .array(z.string().min(1, "Hobby is required"))
    .nullable()
    .optional(),
  languages: z.array(languageSchema).nullable().optional(),
})

export type ResumeFormType = z.infer<typeof resumeSchema>
