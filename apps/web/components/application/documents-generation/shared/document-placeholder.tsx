import { FileText } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DocumentPlaceholderProps = {
  documentName: "Resume" | "Cover letter"
}

export default function DocumentPlaceholder({
  documentName,
}: DocumentPlaceholderProps) {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          {documentName} Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {documentName} Being Generated
          </h3>
          <p className="text-gray-500">
            Your tailored {documentName} will appear here once generation is
            complete
          </p>
          <div className="mt-4">
            <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto">
              <div className="w-16 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
