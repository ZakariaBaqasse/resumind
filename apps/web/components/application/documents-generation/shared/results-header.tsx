import { memo } from "react"
import { CheckCircle } from "lucide-react"

import { ApplicationEvent } from "@/types/application.types"
import { Badge } from "@/components/ui/badge"

type ResultsHeaderProps = {
  latestEvaluatorEvent: ApplicationEvent
  title: string
}

const ResultsHeader = memo(
  ({ latestEvaluatorEvent, title }: ResultsHeaderProps) => {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/30 border border-green-200 rounded-2xl p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/3 via-emerald-500/3 to-teal-500/3"></div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100/60 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 hover:bg-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Grade: {(latestEvaluatorEvent?.data as any).evaluation_grade}
                /100
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 hover:bg-blue-200">
                Iterations: {(latestEvaluatorEvent?.data as any).iteration + 1}
              </Badge>
            </div>
          </div>
          <p className="text-gray-700 font-medium">
            {(latestEvaluatorEvent?.data as any).evaluation_summary}
          </p>
        </div>
      </div>
    )
  }
)

export default ResultsHeader
