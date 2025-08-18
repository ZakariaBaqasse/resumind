import React from "react"
import { useApplicationStore } from "@/store/job-application-store"
import { Badge, BarChart3, CheckCircle, Loader2, Search } from "lucide-react"

import { cn } from "@/lib/utils"

import { DiscoveryCard } from "./discovery-card"
import { ExecutionCard } from "./execution-card"
import { PlanCard } from "./plan-card"

export default function CompanyResearchTab() {
  // Determine which company research sub-phase is currently active

  const snapshot = useApplicationStore((state) => state.snapshot)
  return (
    <div className="space-y-8">
      <DiscoveryCard />

      <PlanCard />

      <ExecutionCard />
    </div>
  )
}
