"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useGetUser } from "@/hooks/dashboard/use-get-user"
import ResumeEditForm from "@/components/resume-form"

import EditResumeLoadingSkeleton from "./loading-skeleton"

export default function EditResumeForm() {
  const { data: user, isLoading, error } = useGetUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user?.initial_resume) {
      router.replace("/onboarding")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <EditResumeLoadingSkeleton />
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

  if (!user?.initial_resume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No resume found</p>
          <button
            onClick={() => router.push("/onboarding")}
            className="text-blue-600 hover:underline"
          >
            Create your first resume
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Implement save functionality
      console.log("Saving resume:", data)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving resume:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Edit Resume</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <ResumeEditForm
          resume={user.initial_resume.resume}
          onSubmit={handleSubmit}
          submitButtonText="Save Changes"
          showErrorMessages={true}
        />
      </div>
    </div>
  )
}
