"use client"

import { useRouter } from "next/navigation"
import { useApplicationStore } from "@/store/job-application-store"
import { ArrowLeft, Settings, Sparkles, WifiOff } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ApplicationHeader({
  onToggleSidebar,
  sidebarOpen,
}: {
  onToggleSidebar: () => void
  sidebarOpen: boolean
}) {
  const snapshot = useApplicationStore((state) => state.snapshot)
  const currentStep = useApplicationStore((state) => state.getCurrentPhase())
  const router = useRouter()

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center h-16">
        <div className="flex-1 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {snapshot?.job_title} at {snapshot?.company_name}
          </h2>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
              <span className="text-blue-600">{currentStep || ""}</span>
            </div>
          </div>
        </div>
        <div className="flex-1" />
      </div>
    </div>
  )
}
