"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ResumeFormType } from "@/schema/resume.schema"
import { CheckCircle, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

import { Resume } from "@/types/resume.types"
import { USER_BACKEND_ROUTES } from "@/lib/routes"
import { useSaveResume } from "@/hooks/onboarding/use-save-resume"
import ResumeEditForm from "@/components/resume-form"

export default function ResumeReview() {
  const [isLoading, setIsLoading] = useState(true)
  const [resume, setResume] = useState<Resume | null>(null)
  const [loadingMessage, setLoadingMessage] = useState(
    "Analyzing your resume..."
  )
  const { data: session } = useSession()
  const router = useRouter()
  const [saveSuccess, setSaveSuccess] = useState(false)

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
    url.pathname = `${USER_BACKEND_ROUTES.getResumeStatus}/${session?.token}`
    const eventSource = new EventSource(url.toString())
    eventSource.onmessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data)
      console.log("DATA", data)
      // You may want to do something with 'data' here
      if (data.status === "complete") {
        setIsLoading(false)
        setResume(data.resume)
        eventSource.close()
      }
    }
    return () => {
      clearInterval(messageInterval)
      eventSource.close()
    }
  }, [])

  const { isMutating, trigger, error } = useSaveResume()

  const handleSubmit = async (data: ResumeFormType) => {
    try {
      await trigger({ resume: data })
      setSaveSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1800)
    } catch (error) {
      console.error(error)
    }
  }

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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <div className="font-semibold text-red-700 mb-2">{error}</div>
            </div>
          )}

          <ResumeEditForm
            resume={resume}
            onSubmit={handleSubmit}
            isSubmitting={isMutating}
            submitButtonText="Save Resume"
            showErrorMessages={true}
            submitError={error}
            saveSuccess={saveSuccess}
          />
        </div>
      </div>
    </div>
  )
}
