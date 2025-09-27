import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatsData {
  title: string
  value: number
  icon: React.ElementType
}

interface StatsCardsProps {
  error: any
  isLoading: boolean
  statsData: StatsData[]
  retry: () => void
  className?: string
}
export default function StatsCards({
  error,
  isLoading,
  statsData,
  retry,
  className,
}: StatsCardsProps) {
  return (
    <>
      {error ? (
        <div className="col-span-3">
          <Card
            className="animate-in slide-in-from-bottom-4"
            style={{ animationDelay: "300ms" }}
          >
            <CardHeader>
              <CardTitle className="text-lg">Stats</CardTitle>
              <CardDescription>Overview of your applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="size-4" />
                Failed to load stats.
              </div>
              <Button size="sm" variant="outline" onClick={() => retry()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="group relative overflow-hidden animate-in slide-in-from-bottom-4"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <Skeleton className="size-40" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {statsData.map((stat, index) => (
            <Card
              key={stat.title}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-md animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground leading-relaxed">
                  {stat.title}
                </CardTitle>
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted/50 transition-colors duration-200 group-hover:bg-primary/10">
                  <stat.icon className="size-4 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
