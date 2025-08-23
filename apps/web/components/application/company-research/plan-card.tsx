"use client"

import { useMemo } from "react"
import { useApplicationStore } from "@/store/job-application-store"
import {
  AlertTriangle,
  CheckCircle,
  History,
  Loader2,
  Search,
  Target,
} from "lucide-react"

import { ApplicationEvent } from "@/types/application.types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { AnimatedCounter } from "../common"

const EMPTY_EVENTS: ApplicationEvent[] = []

export function PlanCard() {
  const companyProfile = useApplicationStore((state) =>
    state.getCompanyProfile()
  )
  const events = useApplicationStore(
    (state) => state.snapshot?.events || EMPTY_EVENTS
  )

  const plan = companyProfile?.research_plan

  const planningStatus = useMemo(() => {
    if (plan) return "succeeded"

    const planningEvents = events.filter(
      (e) => e.event_name === "pipeline.step" && e.step === "research_planning"
    )

    if (planningEvents.length === 0) return "pending"

    const latest = planningEvents.reduce((latest, current) => {
      const latestTime = latest.created_at ? Date.parse(latest.created_at) : 0
      const currentTime = current.created_at
        ? Date.parse(current.created_at)
        : 0
      return currentTime > latestTime ? current : latest
    })

    return latest.status || "started"
  }, [events])

  const getStatusBadge = () => {
    switch (planningStatus) {
      case "succeeded":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 px-3 py-1 hover:bg-green-100 transition-colors">
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </Badge>
        )
      case "started":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 hover:bg-blue-100 transition-colors">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> In Progress
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-gray-50 text-gray-700 border-gray-200 px-3 py-1 hover:bg-gray-100 transition-colors">
            <History className="w-3 h-3 mr-1" /> Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 px-3 py-1 hover:bg-red-100 transition-colors">
            <AlertTriangle className="w-3 h-3 mr-1" /> Failed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-50 text-gray-700 border-gray-200 px-3 py-1">
            <Search className="w-3 h-3 mr-1" /> Unknown
          </Badge>
        )
    }
  }

  if (!plan && planningStatus === "pending") {
    return (
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-gray-50/40 via-slate-50/40 to-zinc-50/40 backdrop-blur-sm shadow-lg border-l-4 border-l-gray-400">
        <CardHeader className="pb-4 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-xl">
                <History className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                  Research Plan
                </CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-4">{getStatusBadge()}</div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  if (!plan && planningStatus === "started") {
    return (
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-purple-50/40 backdrop-blur-sm shadow-lg border-l-4 border-l-blue-400">
        <CardHeader className="pb-4 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                  Research Plan
                </CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-4">{getStatusBadge()}</div>
          </div>
        </CardHeader>
        <div className="px-8 -mt-3 mb-2">
          <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto">
            This phase defines what to research and why. We select categories
            and outline a rationale to focus company profiling and ensure
            outputs align with the job.
          </p>
        </div>
        <CardContent>
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50/60 via-indigo-50/60 to-purple-50/60 rounded-xl border border-blue-200/50">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-blue-800 mb-1">
                Generating research plan
              </h4>
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>
                  {" "}
                  Laying the foundation for a targeted research strategy...
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!plan && planningStatus === "failed") {
    return (
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-red-50/40 via-rose-50/40 to-pink-50/40 backdrop-blur-sm shadow-lg border-l-4 border-l-red-400">
        <CardHeader className="pb-4 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                  Research Plan
                </CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-4">{getStatusBadge()}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="px-8 -mt-3 mb-2">
            <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto">
              This phase defines what to research and why. We select categories
              and outline a rationale to focus company profiling and ensure
              outputs align with the job.
            </p>
          </div>
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-red-50/60 via-rose-50/60 to-pink-50/60 rounded-xl border border-red-200/50">
            <div className="p-3 bg-red-100/80 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-red-800 mb-1">
                Research Planning Failed
              </h4>
              <p className="text-red-700 text-sm leading-relaxed mb-3">
                We encountered an issue while creating the research plan . This
                could be due to network issues, API limitations, or insufficient
                company information.
              </p>
              <div className="flex items-center gap-2 text-xs text-red-600">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Planning process encountered an error</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-green-100/50 border-l-4 border-l-green-500">
          <CardHeader className="pb-4 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                    Research Plan
                  </CardTitle>
                  <p className="text-sm text-gray-600 font-medium italic">
                    Planned categories and rationale
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    <AnimatedCounter
                      value={plan?.research_categories.length!}
                    />
                  </p>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    CATEGORIES
                  </p>
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                  <Target className="w-3 h-3 mr-1" /> Plan Ready
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Card className="mt-4 border-0 bg-white/80 backdrop-blur-sm shadow-sm">
          <CardContent className="pt-8 px-8 space-y-6">
            <div className="px-8 -mt-3 mb-2">
              <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto">
                This phase defines what to research and why. We select
                categories and outline a rationale to focus company profiling
                and ensure outputs align with the job.
              </p>
            </div>
            <div>
              <span className="text-base font-bold text-gray-800 block mb-4">
                Research Categories:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan?.research_categories.map((category) => (
                  <div
                    key={category.category_name}
                    className="p-5 rounded-xl border bg-gray-50/50 border-gray-200"
                  >
                    <h4 className="font-bold text-gray-900 text-base mb-2">
                      {category.category_name.split("_").join(" ")}
                    </h4>
                    <p className="text-sm text-gray-600 font-medium">
                      {category.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <span className="text-base font-bold text-gray-800 block mb-3">
                Strategy:
              </span>
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                {plan?.rationale}
              </p>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
