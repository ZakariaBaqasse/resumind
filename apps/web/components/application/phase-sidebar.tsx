"use client"

import type React from "react"
import { useEffect, useMemo } from "react"
import { useApplicationStore } from "@/store/job-application-store"
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  LetterText,
  Paperclip,
} from "lucide-react"

type PhaseStatus = "completed" | "active" | "pending" | "failed"
type Phase = {
  id: string
  name: string
  icon: React.ReactNode
  status: PhaseStatus
}

function StatusIcon({ status }: { status: PhaseStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-emerald-500" />
    case "active":
      return <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
    case "failed":
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    default:
      return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
  }
}

export function PhaseSidebar({
  onChange,
  open,
  autoAdvance = true,
}: {
  onChange: (id: string) => void
  open: boolean
  autoAdvance?: boolean
}) {
  // Use the store's computed selectors directly
  const activePhase = useApplicationStore((state) => state.getCurrentPhase())

  // Get the raw data and compute phases locally with useMemo
  const snapshot = useApplicationStore((state) => state.snapshot)

  // Memoize the phases computation to prevent infinite loops
  const phases = useMemo(() => {
    if (!snapshot) return []

    const hasDiscovery = !!snapshot.company_profile?.company_discovery_results
    const plan = snapshot.company_profile?.research_plan
    const results = snapshot.company_profile?.research_results || {}

    const completedCategories =
      plan?.research_categories.filter(
        (c) => (results as any)[c.category_name]
      ) || []

    let companyResearchStatus: "completed" | "active" | "pending" | "failed" =
      "pending"
    if (
      plan &&
      completedCategories.length === (plan?.research_categories.length || 0) &&
      plan?.research_categories.length
    ) {
      companyResearchStatus = "completed"
    } else if (hasDiscovery || plan || completedCategories.length > 0) {
      companyResearchStatus = "active"
    }

    return [
      {
        id: "company-research",
        name: "Company Research",
        icon: <Building2 className="h-4 w-4" />,
        status: companyResearchStatus,
      },
      {
        id: "resume-generation",
        name: "Resume Generation",
        icon: <Paperclip className="h-4 w-4" />,
        status: snapshot.generated_resume ? "completed" : "pending",
      },
      {
        id: "cover-letter",
        name: "Cover Letter Generation",
        icon: <LetterText className="h-4 w-4" />,
        status: "pending",
      },
    ] as Phase[]
  }, [
    snapshot?.id,
    snapshot?.company_profile?.company_discovery_results,
    snapshot?.company_profile?.research_plan,
    snapshot?.company_profile?.research_results,
    snapshot?.generated_resume,
  ])

  return (
    <div
      className={`${
        open ? "w-64" : "w-0"
      } transition-all duration-300 overflow-hidden lg:w-64 border-r border-gray-200/50 bg-white/60 backdrop-blur-sm`}
    >
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Progress Timeline
        </h3>
        <div className="space-y-4">
          {phases.map((phase, i) => (
            <div key={phase.id}>
              <button
                onClick={() => onChange(phase.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                  activePhase === phase.id
                    ? "bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200/50 shadow-sm"
                    : "hover:bg-white/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <StatusIcon status={phase.status} />
                  <div className="flex items-center gap-2">
                    {phase.icon}
                    <span className="font-bold text-gray-900">
                      {phase.name}
                    </span>
                  </div>
                </div>
              </button>
              {i < phases.length - 1 && (
                <div className="ml-6 mt-3 w-0.5 h-6 bg-gray-200/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
