import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ResumeFormType } from "@/schema/resume.schema"

import { useGetUser } from "@/hooks/dashboard/use-get-user"
import { useSaveResume } from "@/hooks/onboarding/use-save-resume"
import { ResumeForm } from "@/components/resume-form"

import EditResumeLoadingSkeleton from "./loading-skeleton"

export default function BaseResume() {
  const { data: user, isLoading, error, mutate } = useGetUser()
  const router = useRouter()
  const { trigger, data, error: saveError, isMutating } = useSaveResume()
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!isLoading && !user?.initial_resume) {
      router.replace("/onboarding")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <EditResumeLoadingSkeleton />
  }

  const handleSubmit = async (data: ResumeFormType) => {
    try {
      console.log("Saving resume:", data)
      await trigger({ resume: data })
      setSaveSuccess(true)
      mutate()
      setTimeout(() => {
        setSaveSuccess(false)
      }, 1000)
    } catch (error) {
      console.error("Error saving resume:", error)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading resume data</p>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }
  return (
    <ResumeForm
      resume={user?.initial_resume.resume}
      onSubmit={handleSubmit}
      submitButtonText="Save Changes"
      isSubmitting={isMutating}
      showErrorMessages={true}
      submitError={saveError}
      saveSuccess={saveSuccess}
    />
  )
}
