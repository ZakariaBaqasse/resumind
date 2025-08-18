import { useApplicationStore } from "@/store/job-application-store"
import {
  AlertTriangle,
  BarChart3,
  Bot,
  Building,
  CheckCircle,
  FileText,
  Globe,
  Loader2,
  Search,
  Target,
} from "lucide-react"

import type { ApplicationEvent } from "@/types/application.types"

const ShimmerLoader = ({ children }: { children: React.ReactNode }) => (
  <div className="relative overflow-hidden">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    {children}
  </div>
)

// Tool icon mapping based on your tools.py
const getToolIcon = (toolName: string | null) => {
  if (!toolName) return <Bot className="w-5 h-5 text-blue-600" />

  switch (toolName) {
    case "company_discovery_tool":
      return <Building className="w-5 h-5 text-blue-600" />
    case "tavily_tool":
      return <Search className="w-5 h-5 text-green-600" />
    case "scraping_tool":
      return <Globe className="w-5 h-5 text-purple-600" />
    default:
      return <Bot className="w-5 h-5 text-blue-600" />
  }
}

// State icon mapping
const getStateIcon = (status: string) => {
  switch (status) {
    case "started":
      return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
    case "succeeded":
      return <CheckCircle className="w-5 h-5 text-green-600" />
    case "failed":
      return <AlertTriangle className="w-5 h-5 text-red-600" />
    default:
      return <Loader2 className="w-5 h-5 text-gray-600" />
  }
}

// Get tool display name
const getToolDisplayName = (toolName: string | null) => {
  if (!toolName) return "Tool execution"

  switch (toolName) {
    case "company_discovery_tool":
      return "Company Discovery"
    case "tavily_tool":
      return "Web Search"
    case "scraping_tool":
      return "Content Scraping"
    default:
      return toolName
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
  }
}

export default function AnimatedEvent({ event }: { event: ApplicationEvent }) {
  const toolIcon = getToolIcon(event.tool_name!)
  const stateIcon = getStateIcon(event.status!)
  const toolDisplayName = getToolDisplayName(event.tool_name!)

  // Get a friendly message or fallback
  const getActivityMessage = () => {
    if (event.message) return event.message

    const status = event.status
    const tool = toolDisplayName

    switch (status) {
      case "started":
        return `Starting ${tool}...`
      case "succeeded":
        return `${tool} completed successfully`
      case "failed":
        return `${tool} failed to complete`
      default:
        return `${tool} execution`
    }
  }

  // Get background color based on status
  const getStatusBackground = () => {
    switch (event.status) {
      case "started":
        return "bg-blue-100/60"
      case "succeeded":
        return "bg-green-100/60"
      case "failed":
        return "bg-red-100/60"
      default:
        return "bg-gray-100/60"
    }
  }

  return (
    <ShimmerLoader>
      <div className="flex items-center gap-3 p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200">
        <div className={`p-2 rounded-lg ${getStatusBackground()}`}>
          {stateIcon}
        </div>

        <div className="flex items-center gap-2">
          {toolIcon}
          <span className="text-base text-gray-700 font-semibold">
            {getActivityMessage()}
          </span>
        </div>
      </div>
    </ShimmerLoader>
  )
}
