import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar, CheckCircle2, FileText, RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import { useGetStats } from "@/hooks/dashboard/use-get-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { Button } from "../ui/button"

// import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip" // Uncomment if you have a Tooltip

export function ProgressCard() {
  const { data, isLoading, error, mutate } = useGetStats()

  // Animated numbers state
  const [animated, setAnimated] = useState({
    resumesCreated: 0,
    resumesThisMonth: 0,
    completedResumes: 0,
  })

  // Animate numbers when data is loaded
  useEffect(() => {
    if (data && !isLoading && !error) {
      const duration = 0.8
      let start = { ...animated }
      let end = {
        resumesCreated: data.total_created ?? 0,
        resumesThisMonth: data.created_this_month ?? 0,
        completedResumes: data.completed ?? 0,
      }
      let startTime: number | null = null

      function animateNumbers(timestamp: number) {
        if (!startTime) startTime = timestamp
        const progress = Math.min(
          (timestamp - startTime) / (duration * 1000),
          1
        )
        setAnimated({
          resumesCreated: Math.floor(
            start.resumesCreated +
              (end.resumesCreated - start.resumesCreated) * progress
          ),
          resumesThisMonth: Math.floor(
            start.resumesThisMonth +
              (end.resumesThisMonth - start.resumesThisMonth) * progress
          ),
          completedResumes: Math.floor(
            start.completedResumes +
              (end.completedResumes - start.completedResumes) * progress
          ),
        })
        if (progress < 1) {
          requestAnimationFrame(animateNumbers)
        }
      }
      requestAnimationFrame(animateNumbers)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, error])

  // Calculate progress percentage
  const progressPercent =
    animated.resumesCreated > 0
      ? Math.round((animated.completedResumes / animated.resumesCreated) * 100)
      : 0

  return (
    <Card
      className={cn("relative overflow-hidden shadow-lg rounded-xl border-0", {
        "bg-gradient-to-br from-primary/10 via-ghost-white/80 to-primary/5":
          !error,
        "bg-red-200": error,
      })}
    >
      {/* Gradient accent background */}

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-foreground text-lg font-semibold">
          <Calendar className="w-5 h-5 text-primary" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-7 w-2/3 rounded-lg" />
            <Skeleton className="h-7 w-1/2 rounded-lg" />
            <Skeleton className="h-7 w-1/3 rounded-lg" />
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        ) : error ? (
          <div className="text-destructive text-sm text-center flex flex-col items-center gap-3">
            <span>Failed to load progress. Please try again.</span>
            <Button
              variant={"outline"}
              onClick={() => mutate()}
              className="border-2 border-destructive hover:bg-ghost-white hover:text-destructive"
            >
              <RotateCcw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              key="progress-data"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Resumes created</span>
                </span>
                <span className="font-bold text-xl text-primary">
                  {animated.resumesCreated}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <span>This month</span>
                </span>
                <span className="font-bold text-xl text-secondary">
                  {animated.resumesThisMonth}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Completed</span>
                </span>
                <span className="font-bold text-xl text-green-400">
                  {animated.completedResumes}
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium text-primary">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-primary h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${progressPercent}%`,
                    }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}
