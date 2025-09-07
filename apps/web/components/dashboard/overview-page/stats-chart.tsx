import { AlertCircle } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface CompletionData {
  name: string
  value: number
  color: string
}

interface StatsChartProps {
  error: any
  isLoading: boolean
  completionData: CompletionData[]
  completionRate: number
  retry: () => void
  className?: string
}

export function StatsChart({
  error,
  isLoading,
  completionData,
  completionRate,
  retry,
  className,
}: StatsChartProps) {
  return (
    <>
      {error ? (
        <Card
          className={cn(
            "animate-in slide-in-from-bottom-4 max-w-md w-full",
            className
          )}
          style={{ animationDelay: "200ms" }}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Completion Rate</CardTitle>
            <CardDescription>Application status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="size-4" />
              Failed to load chart data.
            </div>
            <Button size="sm" variant="outline" onClick={() => retry()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card
          className={cn(
            "animate-in slide-in-from-bottom-4 max-w-md w-full",
            className
          )}
          style={{ animationDelay: "200ms" }}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Completion Rate</CardTitle>
            <CardDescription>Application status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="text-center mt-2 w-full space-y-2">
              <Skeleton className="h-6 w-20 mx-auto" />
              <div className="flex justify-center gap-4 text-xs">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={cn(
            "animate-in slide-in-from-bottom-4 max-w-md w-full",
            className
          )}
          style={{ animationDelay: "200ms" }}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Completion Rate</CardTitle>
            <CardDescription>Application status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer
              config={{
                completed: {
                  label: "Completed",
                  color: "hsl(var(--primary))",
                },
                inProgress: {
                  label: "In Progress",
                  color: "hsl(var(--secondary))",
                },
              }}
              className="h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="text-center mt-4">
              <div className="text-3xl font-bold text-foreground">
                {completionRate}%
              </div>
              <div className="text-sm text-muted-foreground">
                Overall completion rate
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
              {completionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
