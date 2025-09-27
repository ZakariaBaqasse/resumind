"use client"

import type React from "react"
import { useEffect, useMemo, useRef } from "react"
import { useApplicationStore } from "@/store/job-application-store"
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  LetterText,
  Paperclip,
} from "lucide-react"

import { ApplicationEvent, EventStatus } from "@/types/application.types"
import { cn } from "@/lib/utils"

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

const EMPTY_EVENTS: ApplicationEvent[] = []
export function PhaseSidebar({
  onChange,
  open,
  activePhase,
  autoAdvance = true,
}: {
  onChange: (id: string) => void
  open: boolean
  activePhase: string
  autoAdvance?: boolean
}) {
  // Use the store's computed selectors directly

  // Get the raw data and compute phases locally with useMemo
  const snapshot = useApplicationStore((state) => state.snapshot)
  const events = useApplicationStore(
    (state) => state.snapshot?.events || EMPTY_EVENTS
  )

  // Memoize the phases computation to prevent infinite loops
  const phases = useMemo(() => {
    if (!snapshot) return []

    const getPhaseStatus = (
      phaseId: "company-research" | "resume-generation" | "cover-letter"
    ): PhaseStatus => {
      switch (phaseId) {
        case "company-research": {
          const hasFailed = events.some(
            (event) =>
              event.event_name === "pipeline.step" &&
              event.step === "research" &&
              event.status === "failed"
          )
          if (hasFailed) return "failed"

          if (
            snapshot.resume_generation_status === "processing_company_profile"
          ) {
            return "active"
          }

          if (
            snapshot.resume_generation_status ===
              "processing_resume_generation" ||
            snapshot.generated_resume
          ) {
            return "completed"
          }
          return "pending"
        }
        case "resume-generation": {
          const hasFailed = events.some(
            (event) =>
              event.event_name === "pipeline.step" &&
              event.step?.includes("resume") &&
              event.status === "failed"
          )
          if (hasFailed) return "failed"

          if (
            snapshot.resume_generation_status === "processing_resume_generation"
          ) {
            return "active"
          }
          if (snapshot.generated_resume) {
            return "completed"
          }
          return "pending"
        }
        case "cover-letter": {
          const hasFailed = events.some(
            (event) =>
              event.event_name === "pipeline.step" &&
              event.step?.includes("cover_letter") &&
              event.status === "failed"
          )
          if (hasFailed) return "failed"

          if (snapshot.resume_generation_status === "processing_cover_letter") {
            return "active"
          }
          if (snapshot.generated_resume) {
            return "completed"
          }
          return "pending"
        }
        default:
          return "pending"
      }
    }

    return [
      {
        id: "company-research",
        name: "Company Research",
        icon: <Building2 className="size-4" />,
        status: getPhaseStatus("company-research"),
      },
      {
        id: "resume-generation",
        name: "Resume Generation",
        icon: <Paperclip className="size-4" />,
        status: getPhaseStatus("resume-generation"),
      },
      {
        id: "cover-letter",
        name: "Cover Letter Generation",
        icon: <LetterText className="size-4" />,
        status: getPhaseStatus("cover-letter"),
      },
    ] as Phase[]
  }, [snapshot, events])

  const prevPhasesRef = useRef<Phase[]>([])

  useEffect(() => {
    if (!autoAdvance || !prevPhasesRef.current) {
      prevPhasesRef.current = phases
      return
    }

    const prevPhases = prevPhasesRef.current

    const completedPhaseIndex = phases.findIndex((phase) => {
      const prevPhase = prevPhases.find((p) => p.id === phase.id)
      return prevPhase?.status === "active" && phase.status === "completed"
    })

    if (completedPhaseIndex !== -1) {
      const nextPhaseIndex = completedPhaseIndex + 1
      if (nextPhaseIndex < phases.length) {
        const nextPhase = phases[nextPhaseIndex]
        // 1s delay to allow user to see the completed status before navigating
        setTimeout(() => {
          onChange(nextPhase.id)
        }, 1000)
      }
    }

    prevPhasesRef.current = phases
  }, [phases, autoAdvance, onChange])

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
                disabled={phase.status === "pending"}
                onClick={() => onChange(phase.id)}
                className={cn(
                  `w-full text-left p-4 rounded-xl transition-all duration-200`,
                  {
                    "bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200/50 shadow-sm":
                      activePhase === phase.id,
                    "hover:bg-white/60": activePhase !== phase.id,
                    "text-gray-400": phase.status === "pending",
                  }
                )}
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
