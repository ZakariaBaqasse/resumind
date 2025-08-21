import { BarChart3, Bot, FileText } from "lucide-react"

import { ApplicationEvent } from "@/types/application.types"
import { Badge } from "@/components/ui/badge"

import { PulsingDot, ShimmerLoader } from "../../common"

type GenerationHeaderProps = {
  title: string
  currentIteration: number
  latestEvent: ApplicationEvent
}

export default function GenerationHeader({
  title,
  currentIteration,
  latestEvent,
}: GenerationHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/30 border border-blue-200 rounded-2xl p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-indigo-500/3 to-purple-500/3"></div>
      <div className="relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-100/60 rounded-xl">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <PulsingDot />
          <span className="text-xl font-bold text-gray-800">
            Iteration {currentIteration + 1}
          </span>
        </div>

        {/* Latest Event */}
        <ShimmerLoader>
          <div className="p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200">
            <div className="flex items-start gap-4">
              <div
                className={`p-2 rounded-lg ${
                  latestEvent?.step?.includes("drafting")
                    ? "bg-blue-100/60"
                    : "bg-green-100/60"
                }`}
              >
                {latestEvent?.step?.includes("drafting") ? (
                  <Bot className="w-5 h-5 text-blue-600" />
                ) : (
                  <BarChart3 className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900 capitalize">
                    {latestEvent?.step?.includes("drafting")
                      ? "Generator"
                      : "Evaluator"}{" "}
                    Agent
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Iteration {currentIteration}
                  </Badge>
                </div>
                <p className="text-gray-700 font-medium mb-3">
                  {latestEvent?.message}
                </p>

                {/* Show feedback and grade for evaluator events */}
                {latestEvent?.step?.includes("evaluator") && (
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 block mb-1">
                        Feedback Summary:
                      </span>
                      <p className="text-sm text-gray-600">
                        {(latestEvent?.data as any).evaluation_summary}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Grade:
                      </span>
                      <Badge
                        className={`${
                          (latestEvent?.data as any).grade >= 70
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-orange-100 text-orange-700 border-orange-200"
                        }`}
                      >
                        {(latestEvent?.data as any).evaluation_grade}/100
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ShimmerLoader>
      </div>
    </div>
  )
}
