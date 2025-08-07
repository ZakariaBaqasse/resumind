"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useGetUser } from "@/hooks/dashboard/use-get-user"

import { CustomResumesSection } from "./custom-resumes-section"
import { DashboardHeader } from "./header"
import { DashboardLoadingSkeleton } from "./loading-skeleton"
import { QuickActions } from "./quick-actions"
import ViewResumeDialog from "./view-resume-dialog"
import { WelcomeSection } from "./welcome-section"

export default function DashboardComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isViewingResume, setIsViewingResume] = useState(false)
  const { data: user, isLoading, error } = useGetUser()
  const router = useRouter()

  useEffect(() => {
    console.log(user)
    if (!isLoading && user && !user.initial_resume) {
      router.replace("/onboarding")
    }
  }, [user, isLoading, router])

  const handleCreateResume = (data: {
    jobTitle: string
    companyName: string
    jobDescription: string
  }) => {
    // Handle resume creation logic
    console.log("Creating resume for:", data)
  }

  const handleViewResume = () => {
    setIsViewingResume(true)
  }

  const handleEditResume = () => {
    router.push("/dashboard/edit")
  }

  if (isLoading) {
    return <DashboardLoadingSkeleton />
  }

  if (error) {
    console.error("Error fetching user data:", error)
    // TODO: implement a proper error component
    return <div>Error loading data</div>
  }

  if (!user?.initial_resume) {
    return <DashboardLoadingSkeleton />
  }

  return (
    <>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <WelcomeSection userName={user?.name!} />

        <QuickActions
          resume={user.initial_resume.resume}
          onViewResume={handleViewResume}
          onEditResume={handleEditResume}
          onCreateResume={handleCreateResume}
        />

        <CustomResumesSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <ViewResumeDialog
        isViewingResume={isViewingResume}
        setIsViewingResume={setIsViewingResume}
        detailedResume={user.initial_resume.resume}
      />
    </>
  )
}
