"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ResumeFormType } from "@/schema/resume.schema"
import { has } from "lodash"
import { CheckCircle, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

import { Resume } from "@/types/resume.types"
import { USER_BACKEND_ROUTES } from "@/lib/routes"
import { useSaveResume } from "@/hooks/onboarding/use-save-resume"
import { ResumeForm } from "@/components/resume-form"

// Helper function to normalize resume data
const normalizeResumeData = (resume: Resume): Resume => {
  return {
    ...resume,
    personal_info: {
      ...resume.personal_info,
      age: resume.personal_info.age || "",
      contact_links: resume.personal_info.contact_links || [],
    },
    work_experiences: resume.work_experiences.map((exp) => ({
      ...exp,
      end_date: exp.end_date || "Present",
    })),
    educations: resume.educations.map((edu) => ({
      ...edu,
      end_date: edu.end_date || "Present",
      grade: edu.grade || "",
    })),
    projects: resume.projects?.map((project) => ({
      ...project,
      url: project.url || "",
    })),
    awards: resume.awards?.map((award) => ({
      ...award,
      date: award.date || "",
      description: award.description || "",
    })),
  }
}

export default function ResumeReview() {
  const [isLoading, setIsLoading] = useState(true)
  const [resume, setResume] = useState<Resume | null>(null)
  const [loadingMessage, setLoadingMessage] = useState(
    "Analyzing your resume..."
  )
  const { data: session, update } = useSession()
  const router = useRouter()
  const [saveSuccess, setSaveSuccess] = useState(false)

  const sseRef = useRef<EventSource | null>(null)
  const tickerRef = useRef<number | null>(null)
  const connectedRef = useRef(false)

  // Simulate SSE connection and data reception
  useEffect(() => {
    if (!session?.token || connectedRef.current) return
    connectedRef.current = true

    const messages = [
      "Analyzing your resume...",
      "Extracting personal information...",
      "Processing work experience...",
      "Identifying skills and qualifications...",
      "Almost done...",
    ]

    let messageIndex = 0
    tickerRef.current = window.setInterval(() => {
      if (messageIndex < messages.length - 1) {
        messageIndex++
        setLoadingMessage(messages[messageIndex])
      }
    }, 1500)

    const url = new URL(process.env.NEXT_PUBLIC_API_URL!)
    url.pathname = `${USER_BACKEND_ROUTES.getResumeStatus}/${session.token}`

    const es = new EventSource(url.toString())
    sseRef.current = es

    const cleanup = () => {
      if (tickerRef.current) {
        clearInterval(tickerRef.current)
        tickerRef.current = null
      }
      if (sseRef.current) {
        sseRef.current.close()
        sseRef.current = null
      }
      connectedRef.current = false
    }

    es.onmessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data)

      if (data.status === "complete") {
        setIsLoading(false)
        // Normalize the resume data before setting it
        setResume(normalizeResumeData(data.resume))
        cleanup()
      }
    }

    es.onerror = (err) => {
      console.error("SSE error", err)
      cleanup()
    }

    return cleanup
  }, [session?.token])

  const { isMutating, trigger, error, data } = useSaveResume()

  const handleSubmit = async (data: ResumeFormType) => {
    try {
      // Normalize the form data before sending
      const normalizedData = normalizeResumeData(data)
      await trigger({ resume: normalizedData })
      setSaveSuccess(true)
      update({
        ...session,
        user: { ...session?.user, initialResume: normalizedData },
        hasInitialResume: true,
      })
      // Redirect to dashboard after a short delay to show success message
      setTimeout(() => {
        router.replace("/dashboard")
      }, 1800)
    } catch (error) {
      console.error(error)
    }
  }

  // New: allow saving directly from the review (preview) state
  const handleQuickSave = async () => {
    if (!resume) return
    try {
      // The resume is already normalized when set in the SSE handler
      await trigger({ resume: resume })
      setSaveSuccess(true)
      await update({
        ...session,
        user: { ...session?.user, initialResume: resume },
      })
      setTimeout(() => {
        router.replace("/dashboard")
      }, 800)
    } catch (err) {
      console.error(err)
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

          {/* New: Primary CTA to avoid forcing users into edit mode */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleQuickSave}
              disabled={isMutating}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMutating ? "Saving..." : "Save & Continue"}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <div className="font-semibold text-red-700 mb-2">{error}</div>
            </div>
          )}

          <ResumeForm
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
