"use client"

import { useApplicationStore } from "@/store/job-application-store"
import { Settings, Sparkles, WifiOff } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ApplicationHeader({
  onToggleSidebar,
  sidebarOpen,
  onToggleActivity,
}: {
  onToggleSidebar: () => void
  sidebarOpen: boolean
  onToggleActivity: () => void
}) {
  const snapshot = useApplicationStore((state) => state.snapshot)
  const isConnected = useApplicationStore((state) => state.isConnected)
  const currentStep = useApplicationStore((state) =>
    state.getCurrentStepLabel()
  )
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onToggleSidebar}
            >
              {sidebarOpen ? "×" : "≡"}
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Resumind
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hover:bg-blue-50">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {snapshot?.job_title} at {snapshot?.company_name}
          </h2>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
              <span>Company Research</span>
              <span className="text-blue-600">{currentStep || ""}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleActivity}
              className="ml-2 hover:bg-blue-50 p-2"
            >
              Activity
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
