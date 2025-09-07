"use client"

import { useMemo } from "react"
import { Briefcase, Calendar, CheckCircle } from "lucide-react"

import { useGetStats } from "@/hooks/dashboard/use-get-stats"

import { RecentActivity } from "./recent-activity"
import { StartGenerationButton } from "./start-generation-button"
import StatsCards from "./stats-cards"
import { StatsChart } from "./stats-chart"

export function OverviewPage() {
  const { data, isLoading, error, mutate } = useGetStats()
  const completionData = useMemo(
    () => [
      {
        name: "Completed",
        value: data?.completed || 0,
        color: "hsl(var(--primary))",
      },
      {
        name: "In Progress",
        value:
          data?.total_created && data?.completed
            ? data?.total_created - data?.completed
            : 0,
        color: "hsl(var(--secondary))",
      },
    ],
    [data]
  )

  const completionRate = useMemo(
    () =>
      data?.total_created && data?.completed
        ? Math.round((data?.completed / data?.total_created) * 100)
        : 0,
    [data]
  )
  const statsData = useMemo(
    () => [
      {
        title: "Total Job Applications",
        value: data?.total_created || 0,
        icon: Briefcase,
      },
      {
        title: "Applications This Month",
        value: data?.created_this_month || 0,
        icon: Calendar,
      },
      {
        title: "Total Completed",
        value: data?.completed || 0,
        icon: CheckCircle,
      },
    ],
    [data]
  )

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            Welcome back to ResumAI
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Manage your AI-powered resume optimization workflow
          </p>
        </div>
      </div>

      {/* Start AI Generation */}
      <div className="flex justify-center gap-10">
        {/* Completion Rate */}
        <StartGenerationButton />
      </div>

      {/* Stats */}
      <div className="flex flex-col lg:flex-row justify-center gap-20 items-start">
        {/* Completion Rate Chart - Takes 1 column */}
        <div className="lg:col-span-1">
          <StatsChart
            error={error}
            isLoading={isLoading}
            completionData={completionData}
            completionRate={completionRate}
            retry={() => mutate()}
            className="col-span-1"
          />
        </div>
        <div className="flex-1">
          <StatsCards
            error={error}
            isLoading={isLoading}
            statsData={statsData}
            retry={() => mutate()}
            className="col-span-2"
          />
        </div>
      </div>
      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
