"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { EditCoverLetterSchema } from "@/schema/edit-cover-letter.schema"
import { ResumeFormType } from "@/schema/resume.schema"
import { FileText, Loader2, Mail } from "lucide-react"

import { useGetJobApplication } from "@/hooks/dashboard/use-get-job-application"
import { useUpdateGeneratedCoverLetter } from "@/hooks/dashboard/use-update-generated-cover-letter"
import { useUpdateGeneratedResume } from "@/hooks/dashboard/use-update-generated-resume"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumeForm } from "@/components/resume-form"
import PageLoader from "@/components/shared/page-loader"

import CoverLetterEditForm from "./cover-letter-edit-form"

interface ApplicationEditProps {
  applicationId: string
}

export default function ApplicationEdit({
  applicationId,
}: ApplicationEditProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("resume")
  const [resumeSaveSuccess, setResumeSaveSuccess] = useState(false)
  const [coverLetterSaveSuccess, setCoverLetterSaveSuccess] = useState(false)
  const {
    data: resumeData,
    trigger: updateResume,
    isMutating: isUpdatingResume,
    error: resumeUpdateError,
  } = useUpdateGeneratedResume(applicationId)

  const {
    data: coverLetterData,
    trigger: updateCoverLetter,
    isMutating: isUpdatingCoverLetter,
    error: coverLetterUpdateError,
  } = useUpdateGeneratedCoverLetter(applicationId)

  const {
    data: application,
    isLoading,
    error,
    mutate,
  } = useGetJobApplication(applicationId)

  useEffect(() => {
    if (resumeData) {
      mutate()
      setResumeSaveSuccess(false)
    }
    if (coverLetterData) {
      mutate()
      setCoverLetterSaveSuccess(false)
    }
  }, [resumeData, coverLetterData])

  const handleSaveResume = async (data: ResumeFormType) => {
    try {
      await updateResume({ resume: data })
      setResumeSaveSuccess(true)
    } catch (error) {
      console.log("ERROR saving resume")
    }
  }

  const handleSaveCoverLetter = async (data: EditCoverLetterSchema) => {
    try {
      await updateCoverLetter(data)
      setCoverLetterSaveSuccess(true)
    } catch (error) {
      console.log("ERROR saving cover letter")
    }
  }

  // Helper: is it the initial load?
  const isInitialLoading = isLoading && !application

  if (isInitialLoading) {
    return <PageLoader />
  }
  if (error) {
    return <div>Error</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header */}

      {/* Application Info Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center h-16">
          {/* Left: Back Button */}
          <div className="flex-1 flex items-center"></div>
          {/* Center: Title and Icon */}

          <div className="flex gap-2 flex-col items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {application?.job_title}
            </h2>
            <p className="text-gray-600">{application?.company_name}</p>
          </div>
          {/* Right: Empty for spacing (or add actions/settings here) */}
          <div className="flex-1" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 relative">
        {/* Spinner overlay for refetching */}
        {isLoading && application && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 pointer-events-none">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Resume
            </TabsTrigger>
            <TabsTrigger
              value="cover-letter"
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Cover Letter
            </TabsTrigger>
          </TabsList>

          {/* Resume Tab */}
          <TabsContent value="resume" className="space-y-8">
            {/* Personal Information */}
            <ResumeForm
              resume={application?.generated_resume}
              onSubmit={handleSaveResume}
              submitButtonText="Save changes"
              isSubmitting={isUpdatingResume}
              showErrorMessages={true}
              submitError={resumeUpdateError}
              saveSuccess={resumeSaveSuccess}
            />
          </TabsContent>

          {/* Cover Letter Tab */}
          <TabsContent value="cover-letter" className="space-y-8">
            {/* Cover Letter Settings */}
            <CoverLetterEditForm
              generatedResume={application?.generated_resume!}
              company={application?.company_name!}
              jobTitle={application?.job_title!}
              onSubmit={handleSaveCoverLetter}
              isSubmitting={isUpdatingCoverLetter}
              submitError={coverLetterUpdateError}
              saveSuccess={coverLetterSaveSuccess}
              coverLetterContent={application?.generated_cover_letter!}
            />
            {/* Cover Letter Preview */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
