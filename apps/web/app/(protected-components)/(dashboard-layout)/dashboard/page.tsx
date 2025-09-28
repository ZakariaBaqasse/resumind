"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

import { useGetUser } from "@/hooks/dashboard/use-get-user"
import { OverviewPage } from "@/components/dashboard/overview-page"

export default function Dashboard() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [hasCheckedBackend, setHasCheckedBackend] = useState(false)
  const { data, isLoading, error } = useGetUser()
  useEffect(() => {
    if (data && !data.initial_resume) {
      router.replace("/onboarding")
    }
    if (error) {
      router.replace("/onboarding")
    }
    setHasCheckedBackend(true)
  }, [session?.token, hasCheckedBackend, router, update])

  if (!hasCheckedBackend || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></Loader2>
      </div>
    )
  }

  return <OverviewPage />
}
