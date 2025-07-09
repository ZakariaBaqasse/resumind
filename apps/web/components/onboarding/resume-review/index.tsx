"use client"

import { useEffect, useState } from "react"
import { ResumeFormType, resumeSchema } from "@/schema/resume.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Code,
  GraduationCap,
  Loader2,
  Plus,
  User,
  X,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { PersonalInfo, Resume } from "@/types/resume.types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { AwardsForm } from "./awards-form"
import { CertificationsForm } from "./certifications-form"
import { EducationForm } from "./education-form"
import HobbiesForm from "./hobbies-form"
import { LanguagesForm } from "./languages-form"
import { PersonalInfoForm } from "./personal-info-form"
import { ProjectsForm } from "./projects-form"
import { SkillsForm } from "./skills-form"
import { WorkExperienceForm } from "./work-experience-form"

export default function ResumeReview() {
  const [isLoading, setIsLoading] = useState(true)
  const [resume, setResume] = useState<Resume | null>(null)
  const [loadingMessage, setLoadingMessage] = useState(
    "Analyzing your resume..."
  )
  const { data: session } = useSession()

  // Simulate SSE connection and data reception
  useEffect(() => {
    const messages = [
      "Analyzing your resume...",
      "Extracting personal information...",
      "Processing work experience...",
      "Identifying skills and qualifications...",
      "Almost done...",
    ]

    let messageIndex = 0
    const messageInterval = setInterval(() => {
      if (messageIndex < messages.length - 1) {
        messageIndex++
        setLoadingMessage(messages[messageIndex])
      }
    }, 1500)

    const url = new URL(process.env.NEXT_PUBLIC_API_URL!)
    url.pathname = `/user/resume-status/${session?.token}`
    const eventSource = new EventSource(url.toString())
    eventSource.onmessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data)
      console.log("DATA", data)
      // You may want to do something with 'data' here
      if (data.status === "complete") {
        setIsLoading(false)
        setResume(data.resume)
      }
    }
    return () => {
      clearInterval(messageInterval)
      eventSource.close()
    }
  }, [])

  // RHF setup
  const form = useForm<ResumeFormType>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resume || undefined,
    mode: "onBlur",
  })
  const { control, reset, handleSubmit } = form
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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Processing your resume
          </h2>
          <p className="text-gray-600 mb-4">{loadingMessage}</p>
          <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div
              className="bg-blue-600 h-2 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>
    )
  }

  if (!resume) return null

  return (
    <div>
      {/* Success Message */}
      <div className="bg-green-50 border-b border-green-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Resume processed successfully! Review and edit the information
            below.
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Review your information
            </h2>
            <p className="text-gray-600">
              Make any necessary edits before we create your tailored resumes
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={handleSubmit((data) => {
                /* TODO: handle submit */
              })}
              className="space-y-6"
            >
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

              <ProjectsForm
                control={control}
                projectFields={projectsField}
                appendProject={appendProject}
                removeProject={removeProject}
              />

              <CertificationsForm
                control={control}
                certificationFields={certificationFields}
                appendCertification={appendCertification}
                removeCertification={removeCertification}
              />

              <AwardsForm
                control={control}
                awardFields={awardsFields}
                appendAward={appendAward}
                removeAward={removeAward}
              />

              <LanguagesForm
                control={control}
                languageFields={languagesFields}
                appendLanguage={appendLanguage}
                removeLanguage={removeLanguage}
              />

              <HobbiesForm control={control} />

              {/* Continue Button */}
              <div className="flex justify-center pt-6">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                  type="submit"
                >
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
