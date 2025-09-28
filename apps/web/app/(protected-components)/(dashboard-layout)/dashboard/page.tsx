"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useGetUser } from "@/hooks/dashboard/use-get-user"
import { OverviewPage } from "@/components/dashboard/overview-page"

export default function Dashboard() {
  const router = useRouter()
  const { data: userData, isLoading, error } = useGetUser()

  useEffect(() => {
    // Only redirect after we have definitive data (not loading)
    if (!isLoading && userData && !userData.initial_resume) {
      router.replace("/onboarding")
    }
    if (!isLoading && error) {
      router.replace("/onboarding")
    }
  }, [userData, isLoading, error, router])

  // Show loading while fetching user data
  if (isLoading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></Loader2>
      </div>
    )
  }

  // If user has no initial resume, the useEffect will handle redirect
  // This return won't flash because we're showing loading above
  if (!userData.initial_resume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></Loader2>
      </div>
    )
  }

  return <OverviewPage />
}
