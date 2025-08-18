"use client"

import type React from "react"
import { useState } from "react"
import { useApplicationStore } from "@/store/job-application-store"

import { ActivitySidebar } from "./activity-sidebar"
import CompanyResearchTab from "./company-research"
import { ApplicationHeader } from "./header"
import { PhaseSidebar } from "./phase-sidebar"

export default function ApplicationStatus() {
  const [activePhase, setActivePhase] = useState("company-research")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activitySidebarOpen, setActivitySidebarOpen] = useState(false)

  // Get data from Zustand store using selectors
  const snapshot = useApplicationStore((state) => state.snapshot)

  if (!snapshot) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ApplicationHeader
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
        onToggleActivity={() => setActivitySidebarOpen(true)}
      />

      <div className="flex max-w-7xl mx-auto">
        <PhaseSidebar
          onChange={(id) => setActivePhase(id)}
          open={sidebarOpen}
        />

        <div className="flex-1 p-8 overflow-auto">
          {activePhase === "company-research" && <CompanyResearchTab />}

          {/* ... rest of the phases remain the same ... */}
        </div>

        {activitySidebarOpen && (
          <ActivitySidebar
            events={snapshot.events}
            onClose={() => setActivitySidebarOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
