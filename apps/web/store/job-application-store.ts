import { useMemo } from "react"
import { create } from "zustand"

import type {
  ApplicationEvent,
  JobApplicationSnapshot,
} from "@/types/application.types"

// Define the store's state structure
interface ApplicationState {
  // Core state
  snapshot: JobApplicationSnapshot | null
  isConnected: boolean
  error: Error | null

  // Actions
  updateSnapshot: (snapshot: JobApplicationSnapshot) => void
  setConnectionStatus: (connected: boolean) => void
  setError: (error: Error | null) => void
  clearError: () => void

  // Computed selectors (for performance)
  getCompanyProfile: () => JobApplicationSnapshot["company_profile"] | null
  getEvents: () => ApplicationEvent[]
  getCurrentPhase: () => string
  getCurrentStepLabel: () => string
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  // Initial state
  snapshot: null,
  isConnected: false,
  error: null,

  // Actions
  updateSnapshot: (snapshot) => set({ snapshot }),
  setConnectionStatus: (connected) => set({ isConnected: connected }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Computed selectors - these need to be stable references
  getCompanyProfile: () => {
    const state = get()
    return state.snapshot?.company_profile || null
  },

  getEvents: () => {
    const state = get()
    return state.snapshot?.events || []
  },

  getCurrentPhase: () => {
    const state = get()
    const snapshot = state.snapshot
    if (!snapshot) return "Starting…"

    switch (snapshot.resume_generation_status) {
      case "processing_company_profile":
        return "Company Research"
      case "processing_resume_generation":
        return "Resume Generation"
      case "processing_cover_letter":
        return "Cover Letter Generation"
      case "completed":
        return "completed"
      case "failed":
        return "failed"
      case "started":
      default:
        return "starting"
    }
  },

  getCurrentStepLabel: () => {
    const state = get()
    const snapshot = state.snapshot
    if (!snapshot?.events?.length) {
      // Fallback using app status if no events yet
      switch (snapshot?.resume_generation_status) {
        case "processing_company_profile":
          return "Company Discovery"
        case "processing_resume_generation":
          return "Resume Drafting"
        case "completed":
          return "Completed"
        case "failed":
          return "Failed"
        case "started":
        default:
          return "Starting…"
      }
    }

    // Use events to determine current step
    for (let i = snapshot.events.length - 1; i >= 0; i--) {
      const e = snapshot.events[i]
      if (e.event_name === "pipeline.failed") return "Failed"

      if (e.event_name === "research.category") {
        const formattedCategoryName = e.category_name?.split("_").join(" ")
        if (e.status === "succeeded")
          return `Research: ${formattedCategoryName} done`
        if (e.status === "started") return `Research: ${formattedCategoryName}`
      }

      if (e.event_name === "pipeline.step") {
        if (e.step === "company_discovery") {
          return e.status === "succeeded"
            ? "Company Discovery Completed"
            : "Company Discovery"
        }
        if (e.step === "research") {
          return e.status === "succeeded"
            ? "Research Completed"
            : "Research Execution"
        }
        if (e.step === "resume_draft") {
          return e.status === "succeeded"
            ? "Resume Draft Completed"
            : "Resume Drafting"
        }
        if (e.step === "cover_letter") {
          return e.status === "succeeded"
            ? "Cover Letter Completed"
            : "Cover Letter Drafting"
        }
      }
    }

    return "In progress"
  },
}))
