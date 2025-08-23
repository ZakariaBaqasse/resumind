"use client"

import { useState } from "react"
import { useApplicationStore } from "@/store/job-application-store"
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  History,
  Loader2,
} from "lucide-react"

import { ApplicationEvent } from "@/types/application.types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { AnimatedCounter } from "../common"

const EMPTY_EVENTS: ApplicationEvent[] = []

export function ExecutionCard() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  )

  const plan = useApplicationStore(
    (state) => state.getCompanyProfile()?.research_plan
  )
  const results = useApplicationStore(
    (state) => state.getCompanyProfile()?.research_results
  )
  const events = useApplicationStore(
    (state) => state.snapshot?.events || EMPTY_EVENTS
  )

  const total = plan?.research_categories.length || 0

  // Create a map to track the latest status of each category
  const categoryStatusMap = new Map<
    string,
    "pending" | "started" | "succeeded" | "failed"
  >()

  // Initialize all categories as pending
  plan?.research_categories.forEach((cat) => {
    categoryStatusMap.set(cat.category_name, "pending")
  })

  // Analyze events to determine current status of each category
  events.forEach((e) => {
    if (e.event_name === "research.category" && e.category_name) {
      const currentStatus = categoryStatusMap.get(e.category_name)

      if (e.status === "started") {
        categoryStatusMap.set(e.category_name, "started")
      } else if (e.status === "failed") {
        categoryStatusMap.set(e.category_name, "failed")
      } else if (e.status === "succeeded") {
        categoryStatusMap.set(e.category_name, "succeeded")
      }
    }
  })

  // Count categories by status
  const pending = Array.from(categoryStatusMap.values()).filter(
    (status) => status === "pending"
  ).length
  const inProgress = Array.from(categoryStatusMap.values()).filter(
    (status) => status === "started"
  ).length
  const completed = Array.from(categoryStatusMap.values()).filter(
    (status) => status === "succeeded"
  ).length
  const failed = Array.from(categoryStatusMap.values()).filter(
    (status) => status === "failed"
  ).length

  // Calculate progress percentage - only count completed categories
  const progressPercentage = total ? Math.round((completed / total) * 100) : 0

  // Get status for the overall research phase
  const getOverallStatus = () => {
    const lastResearchEvent = events.findLast(
      (event) =>
        event.event_name == "pipeline.step" && event.step === "research"
    )
    if (lastResearchEvent && lastResearchEvent.status)
      return lastResearchEvent.status
    return "pending"
  }

  const overallStatus = getOverallStatus()

  const getStatusBadge = () => {
    switch (overallStatus) {
      case "succeeded":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </Badge>
        )
      case "started":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> In Progress
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 px-3 py-1">
            <AlertTriangle className="w-3 h-3 mr-1" /> Failed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200 px-3 py-1">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        )
    }
  }

  const getProgressColor = () => {
    switch (overallStatus) {
      case "succeeded":
        return "from-green-500 to-emerald-500"
      case "started":
        return "from-blue-500 to-indigo-500"
      case "failed":
        return "from-red-500 to-pink-500"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName)
      } else {
        newSet.add(categoryName)
      }
      return newSet
    })
  }

  const getCategoryResults = (categoryName: string) => {
    const categoryResults = (results || {})[categoryName]
    if (!categoryResults) return null
    return categoryResults as string
  }

  const getCategoryStatus = (categoryName: string) => {
    return categoryStatusMap.get(categoryName) || "pending"
  }

  if (overallStatus === "pending") {
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
                  Research Execution
                </CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-4">{getStatusBadge()}</div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "border-0 bg-gradient-to-br  backdrop-blur-sm shadow-lg border-l-4",
        {
          "from-blue-50/40 via-indigo-50/40 to-purple-50/40 border-l-blue-400":
            overallStatus === "started",
          "bg-white/80 hover:shadow-green-100/50 border-l-green-500":
            overallStatus === "succeeded",
          "border-l-red-400 from-red-50/40 via-rose-50/40 to-pink-50/40":
            overallStatus === "failed",
        }
      )}
    >
      <CardHeader className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-orange-100 rounded-xl">
              <BarChart3
                className={cn("w-5 h-5", {
                  "text-blue-600": overallStatus === "started",
                  "text-green-600": overallStatus === "succeeded",
                  "text-red-600": overallStatus === "failed",
                })}
              />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                Research Execution
              </CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p
                className={cn("text-2xl font-bold", {
                  "text-blue-600": overallStatus === "started",
                  "text-green-600": overallStatus === "succeeded",
                  "text-red-600": overallStatus === "failed",
                })}
              >
                <AnimatedCounter value={completed} /> of{" "}
                <AnimatedCounter value={total} />
              </p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                COMPLETED
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        {/* Progress bar */}
        <div className="ml-12 mt-4">
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${getProgressColor()} h-2 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{progressPercentage}% complete</span>
            <span>
              {completed}/{total} categories
            </span>
          </div>
        </div>
      </CardHeader>
      <div className="px-8 -mt-3 mb-2">
        <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto">
          This phase runs the research plan across categories using web search
          and scraping. We collect verified signals and summarize findings to
          guide resume tailoring.
        </p>
      </div>
      <CardContent className="px-8">
        <div className="space-y-4">
          {plan?.research_categories.map((category) => {
            const cat = category.category_name
            const catResults = getCategoryResults(cat)
            const catStatus = getCategoryStatus(cat)
            const isCompleted = catStatus === "succeeded"
            const isRunning = catStatus === "started"
            const hasFailed = catStatus === "failed"
            const isPending = catStatus === "pending"
            const isExpanded = expandedCategories.has(cat)

            const getCategoryStatusIcon = () => {
              if (hasFailed) {
                return <AlertTriangle className="w-5 h-5 text-red-500" />
              }
              if (isCompleted) {
                return <CheckCircle className="w-5 h-5 text-green-500" />
              }
              if (isRunning) {
                return (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                )
              }
              return <Clock className="w-5 h-5 text-gray-400" />
            }

            const getCategoryStatusBadge = () => {
              if (hasFailed) {
                return (
                  <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">
                    Failed
                  </Badge>
                )
              }
              if (isCompleted) {
                return (
                  <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                    Complete
                  </Badge>
                )
              }
              if (isRunning) {
                return (
                  <Badge className="bg-orange-50 text-blue-700 border-orange-200 text-xs">
                    Researching
                  </Badge>
                )
              }
              return (
                <Badge className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                  Pending
                </Badge>
              )
            }

            if (isCompleted) {
              // Render completed categories as collapsible
              return (
                <Collapsible
                  key={cat}
                  open={isExpanded}
                  onOpenChange={() => toggleCategory(cat)}
                >
                  <CollapsibleTrigger asChild>
                    <div
                      className={`flex items-center justify-between p-5 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isExpanded
                          ? "bg-green-100/70 border-green-300 shadow-sm"
                          : "bg-green-50/50 border-green-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {getCategoryStatusIcon()}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-base">
                            {cat.split("_").join(" ")}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-green-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {getCategoryStatusBadge()}
                        <span className="text-sm text-gray-600 font-semibold">
                          Click to expand
                        </span>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="mt-2 ml-9 p-4 bg-white/80 rounded-lg border border-green-200/50">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Research Findings:
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {catResults}
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            }

            // Render non-completed categories normally
            return (
              <div
                key={cat}
                className={cn(
                  `flex items-center justify-between p-5 rounded-xl border transition-all duration-200`,
                  {
                    "bg-blue-50/50 border-blue-200": isRunning,
                    "bg-red-50/50 border-red-200": hasFailed,
                    "bg-gray-50/50 border-gray-200": pending,
                  }
                )}
              >
                <div className="flex items-center gap-4">
                  {getCategoryStatusIcon()}
                  <div>
                    <span className="font-bold text-gray-900 text-base">
                      {cat.split("_").join(" ")}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {getCategoryStatusBadge()}
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary stats */}
        {total > 0 && (
          <div className="mt-6 pt-6 border-t border-orange-200/50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white/60 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  <AnimatedCounter value={completed} />
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">
                  Completed
                </div>
              </div>
              <div className="p-3 bg-white/60 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  <AnimatedCounter value={inProgress} />
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">
                  In Progress
                </div>
              </div>
              <div className="p-3 bg-white/60 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  <AnimatedCounter value={failed} />
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">
                  Failed
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
