"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useGetUser } from "@/hooks/dashboard/use-get-user"

import JobApplicationsList from "./job-applications-list"
import { DashboardLoadingSkeleton } from "./loading-skeleton"
import { QuickActions } from "./quick-actions"
import ViewResumeDialog from "./view-resume-dialog"
import { WelcomeSection } from "./welcome-section"

export default function DashboardComponent() {
  const [isViewingResume, setIsViewingResume] = useState(false)
  const { data: user, isLoading, error } = useGetUser()
  const router = useRouter()

  useEffect(() => {
    console.log(user)
    if (!isLoading && user && !user.initial_resume) {
      router.replace("/onboarding")
    }
  }, [user, isLoading, router])

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
        />

        <JobApplicationsList />
      </div>
      <ViewResumeDialog
        isViewingResume={isViewingResume}
        setIsViewingResume={setIsViewingResume}
        detailedResume={user.initial_resume.resume}
      />
    </>
  )
}
