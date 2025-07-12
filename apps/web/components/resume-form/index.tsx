"use client"

import { useCallback, useEffect } from "react"
import { ResumeFormType, resumeSchema } from "@/schema/resume.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"

import { Resume } from "@/types/resume.types"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import { AwardsForm } from "./awards-form"
import { CertificationsForm } from "./certifications-form"
import { EducationForm } from "./education-form"
import HobbiesForm from "./hobbies-form"
import { LanguagesForm } from "./languages-form"
import { PersonalInfoForm } from "./personal-info-form"
import { ProjectsForm } from "./projects-form"
import { SkillsForm } from "./skills-form"
import { WorkExperienceForm } from "./work-experience-form"

interface ResumeEditFormProps {
  resume?: Resume | null
  onSubmit: (data: ResumeFormType) => Promise<void>
  isSubmitting?: boolean
  submitButtonText?: string
  showErrorMessages?: boolean
}

export default function ResumeEditForm({
  resume,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Save Resume",
  showErrorMessages = true,
}: ResumeEditFormProps) {
  // RHF setup
  const form = useForm<ResumeFormType>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resume || undefined,
    mode: "onChange",
  })

  const { control, reset, handleSubmit, formState } = form
  const { isValid, errors } = formState

  // Field arrays for dynamic form sections
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  })

  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({
    control,
    name: "work_experiences",
  })

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "educations",
  })

  const {
    fields: projectsField,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  })

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control,
    name: "certifications",
  })

  const {
    fields: awardsFields,
    append: appendAward,
    remove: removeAward,
  } = useFieldArray({
    control,
    name: "awards",
  })

  const {
    fields: languagesFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  })

  // Reset form when resume data changes
  useEffect(() => {
    if (resume) {
      reset({
        ...resume,
        languages: resume.languages ?? [],
        skills: resume.skills ?? [],
        work_experiences: resume.work_experiences ?? [],
        educations: resume.educations ?? [],
        hobbies: resume.hobbies ?? [],
        awards: resume.awards ?? [],
        certifications: resume.certifications ?? [],
        projects: resume.projects ?? [],
      })
    }
  }, [resume, reset])

  // Helper to recursively extract error messages
  const getErrorMessages = useCallback((errors: any, prefix = ""): string[] => {
    if (!errors) return []
    let messages: string[] = []
    for (const key in errors) {
      if (errors[key]?.message) {
        messages.push(`${prefix}${key}: ${errors[key].message}`)
      }
      // For nested errors (arrays/objects)
      if (
        typeof errors[key] === "object" &&
        !Array.isArray(errors[key]) &&
        errors[key] !== null
      ) {
        messages = messages.concat(
          getErrorMessages(errors[key], `${prefix}${key}.`)
        )
      }
      // For arrays
      if (Array.isArray(errors[key])) {
        errors[key].forEach((item: any, idx: number) => {
          messages = messages.concat(
            getErrorMessages(item, `${prefix}${key}[${idx}].`)
          )
        })
      }
    }
    return messages
  }, [])

  const errorMessages = getErrorMessages(errors)

  const handleFormSubmit = async (data: ResumeFormType) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return (
    <div className="space-y-6">
      {showErrorMessages && errorMessages.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <div className="font-semibold text-red-700 mb-2">
            Please fix the following errors:
          </div>
          <ul className="list-disc list-inside text-red-600 text-sm">
            {errorMessages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Personal Information */}
          <PersonalInfoForm control={control} />

          {/* Work Experience */}
          <WorkExperienceForm
            control={control}
            workFields={workFields}
            appendWork={appendWork}
            removeWork={removeWork}
          />

          {/* Education */}
          <EducationForm
            control={control}
            educationFields={educationFields}
            appendEducation={appendEducation}
            removeEducation={removeEducation}
          />

          {/* Skills */}
          <SkillsForm
            control={control}
            skillFields={skillFields}
            appendSkill={appendSkill}
            removeSkill={removeSkill}
          />

          {/* Projects */}
          <ProjectsForm
            control={control}
            projectFields={projectsField}
            appendProject={appendProject}
            removeProject={removeProject}
          />

          {/* Certifications */}
          <CertificationsForm
            control={control}
            certificationFields={certificationFields}
            appendCertification={appendCertification}
            removeCertification={removeCertification}
          />

          {/* Awards */}
          <AwardsForm
            control={control}
            awardFields={awardsFields}
            appendAward={appendAward}
            removeAward={removeAward}
          />

          {/* Languages */}
          <LanguagesForm
            control={control}
            languageFields={languagesFields}
            appendLanguage={appendLanguage}
            removeLanguage={removeLanguage}
          />

          {/* Hobbies */}
          <HobbiesForm control={control} />

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              disabled={isSubmitting || !isValid}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 px-8"
              type="submit"
            >
              {submitButtonText}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
