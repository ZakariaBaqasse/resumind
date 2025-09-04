import {
  Building,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  XCircle,
  Zap,
} from "lucide-react"

export const getStatusInfo = (status: string) => {
  switch (status) {
    case "processing_company_profile":
      return {
        label: "Company Research",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <Building className="w-3 h-3" />,
      }
    case "processing_resume_generation":
      return {
        label: "Resume Generation",
        color: "bg-orange-100 text-orange-700 border-orange-200",
        icon: <FileText className="w-3 h-3" />,
      }
    case "processing_cover_letter":
      return {
        label: "Cover Letter Generation",
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: <Mail className="w-3 h-3" />,
      }
    case "started":
      return {
        label: " Started",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <Zap className="w-3 h-3" />,
      }
    case "completed":
      return {
        label: "Completed",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: <CheckCircle className="w-3 h-3" />,
      }
    case "failed":
      return {
        label: "Failed",
        color: "bg-red-100 text-red-700 border-red-200",
        icon: <XCircle className="w-3 h-3" />,
      }
    default:
      return {
        label: "Unknown",
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: <Clock className="w-3 h-3" />,
      }
  }
}
