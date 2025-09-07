"use client"

import { useCallback, useEffect, useState } from "react"
import { ResumeFormType, resumeSchema } from "@/schema/resume.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { CheckCircle, Download, Edit2, Eye } from "lucide-react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"

import { Resume } from "@/types/resume.types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import AwardsForm from "./awards-form"
import { CertificationsForm } from "./certifications-form"
import { EducationForm } from "./education-form"
import { HobbiesForm } from "./hobbies-form"
import { LanguagesForm } from "./languages-form"
import PersonalInfoForm from "./personal-info-form"
import { ProjectsForm } from "./projects-form"
import ResumePDF from "./resume-pdf"
import ResumePreview from "./resume-preview"
import { SkillsForm } from "./skills-form"
import WorkExperienceForm from "./work-experience-form"

interface ResumeEditFormProps {
  resume?: Resume | null
  onSubmit: (data: ResumeFormType) => Promise<void>
  isSubmitting?: boolean
  submitError: any
  submitButtonText?: string
  showErrorMessages?: boolean
  saveSuccess?: boolean
}

export function ResumeForm({
  resume,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Save Resume",
  showErrorMessages = true,
  submitError,
  saveSuccess = false,
}: ResumeEditFormProps) {
  const [editMode, setEditMode] = useState(false)
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

  // const {} = useFieldArray({control,name:""})

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

  if (editMode) {
    return (
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Resume Editor
            </h1>
            <p className="text-muted-foreground text-pretty">
              Edit your resume
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditMode(false)}>
              <Eye className="mr-2 size-4" />
              Preview
            </Button>
          </div>
        </div>

        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <div className="font-semibold text-red-700 mb-2">
              Error while saving your changes please try again
            </div>
          </div>
        )}

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
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="flex gap-2 justify-end">
              <Button
                type="submit"
                className={`px-8 py-2 rounded-md text-white text-lg font-semibold transition-colors duration-500
                ${saveSuccess ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}
                ${isSubmitting || !isValid ? "opacity-60 cursor-not-allowed" : ""}
              `}
                disabled={isSubmitting || !isValid || saveSuccess}
              >
                {saveSuccess ? (
                  <span className="flex items-center gap-2 transition-opacity duration-500">
                    <CheckCircle className="w-5 h-5" />
                    Saved!
                  </span>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}

                <PersonalInfoForm control={control} />

                {/* Work Experience */}
                <WorkExperienceForm
                  control={control}
                  appendWork={appendWork}
                  removeWork={removeWork}
                  workFields={workFields}
                />
                {/* Education */}
                <EducationForm
                  control={control}
                  educationFields={educationFields}
                  appendEducation={appendEducation}
                  removeEducation={removeEducation}
                />
                <ProjectsForm
                  control={control}
                  projectFields={projectsField}
                  appendProject={appendProject}
                  removeProject={removeProject}
                />
                <AwardsForm
                  control={control}
                  awardsFields={awardsFields}
                  appendAward={appendAward}
                  removeAward={removeAward}
                />
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Skills */}
                <SkillsForm
                  skillFields={skillFields}
                  appendSkill={appendSkill}
                  removeSkill={removeSkill}
                  control={control}
                />
                <LanguagesForm
                  languagesFields={languagesFields}
                  control={control}
                  appendLanguage={appendLanguage}
                  removeLanguage={removeLanguage}
                />
                {/* Certifications */}
                <CertificationsForm
                  control={control}
                  certificationFields={certificationFields}
                  appendCertification={appendCertification}
                  removeCertification={removeCertification}
                />
                <HobbiesForm control={control} />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Resume Preview
          </h1>
          <p className="text-muted-foreground">
            Preview your resume as it will appear
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditMode(true)}>
            <Edit2 className="mr-2 size-4" />
            Edit
          </Button>
          <PDFDownloadLink
            document={<ResumePDF resume={resume!} />}
            fileName={`${resume?.name?.replace(/\s/g, "_")}_Resume.pdf`}
          >
            {({ loading }) => (
              <Button disabled={loading}>
                <Download className="mr-2 size-4" />
                {loading ? "Generating PDF..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <ResumePreview detailedResume={resume!} />
      </Card>
    </div>
  )
}
