import { useApplicationStore } from "@/store/job-application-store"
import { FileText, XCircle } from "lucide-react"

import { ApplicationEvent } from "@/types/application.types"

import DocumentPlaceholder from "../shared/document-placeholder"
import GenerationHeader from "../shared/generation-header"
import ResultsHeader from "../shared/results-header"
import ResumeDisplay from "./resume-display"

const EMPTY_EVENTS: ApplicationEvent[] = []

export default function ResumeGenerationTab() {
  const snapshot = useApplicationStore((state) => state.snapshot)
  const events = useApplicationStore(
    (state) => state.snapshot?.events || EMPTY_EVENTS
  )

  const latestEvaluatorEvent = events.findLast(
    (e) => e.event_name === "pipeline.step" && e.step === "resume_evaluation"
  )

  const latestEvent = events.findLast(
    (e) =>
      e.event_name === "pipeline.step" &&
      (e.step === "resume_evaluation" || e.step === "resume_drafting")
  )

  const currentIteration = (latestEvent?.data as any)?.iteration

  const resumeGenerationEvent = events.findLast(
    (e) => e.event_name === "pipeline.step" && e.step === "resume_generation"
  )

  const isGenerating = resumeGenerationEvent?.status === "started"
  const isError = resumeGenerationEvent?.status === "failed"
  const errorMessage = (resumeGenerationEvent?.error as any)?.message

  if (snapshot?.generated_resume) {
    return (
      <div className="space-y-8">
        {/* Completed Header */}
        <ResultsHeader
          latestEvaluatorEvent={latestEvaluatorEvent!}
          title="Resume Generation Complete"
        />
        {/* Resume Display */}
        <ResumeDisplay resume={snapshot.generated_resume} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center text-center py-20">
          <div className="space-y-4">
            <div className="p-4 bg-red-100 rounded-full w-fit mx-auto">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Resume Generation Failed
            </h2>
            <p className="text-gray-600">
              An error occurred during the resume generation process.
            </p>
            {errorMessage && (
              <div className="p-4 bg-gray-100 border border-gray-200 rounded-md text-left">
                <p className="font-semibold text-gray-700">Error Details:</p>
                <p className="text-sm text-gray-500 break-words">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="space-y-8">
        {/* Generation Header */}
        <GenerationHeader
          latestEvent={latestEvent!}
          title="Resume Generation"
          currentIteration={currentIteration}
        />
        {/* Resume Placeholder */}
        <DocumentPlaceholder documentName="Resume" />
      </div>
    )
  }

  // Waiting state
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 border border-gray-200/50 rounded-2xl p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-slate-500/5 to-gray-500/5"></div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gray-500/10 rounded-xl">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Resume Generation
            </h2>
          </div>
          <p className="text-gray-600 font-semibold text-lg">
            Waiting for company research to complete...
          </p>
        </div>
      </div>

      <div className="text-center py-20">
        <div className="p-6 bg-gray-100 rounded-2xl w-fit mx-auto mb-8">
          <FileText className="w-20 h-20 text-gray-400 mx-auto" />
        </div>
        <p className="text-gray-500 font-semibold text-lg">
          Resume generation will begin once research is complete
        </p>
      </div>
    </div>
  )
}
