import { useApplicationStore } from "@/store/job-application-store"
import { FileText, XCircle } from "lucide-react"

import { ApplicationEvent } from "@/types/application.types"

import DocumentPlaceholder from "../shared/document-placeholder"
import GenerationHeader from "../shared/generation-header"
import ResultsHeader from "../shared/results-header"
import CoverLetterDisplay from "./cover-letter-display"

const EMPTY_EVENTS: ApplicationEvent[] = []

export default function CoverLetterGenerationTab() {
  const snapshot = useApplicationStore((state) => state.snapshot)
  const events = useApplicationStore(
    (state) => state.snapshot?.events || EMPTY_EVENTS
  )

  const latestEvaluatorEvent = events.findLast(
    (e) =>
      e.event_name === "pipeline.step" && e.step === "cover_letter_evaluation"
  )

  const latestEvent = events.findLast(
    (e) =>
      e.event_name === "pipeline.step" &&
      (e.step === "cover_letter_evaluation" ||
        e.step === "cover_letter_drafting")
  )

  const currentIteration = (latestEvent?.data as any)?.iteration

  const coverLetterGenerationEvent = events.findLast(
    (e) =>
      e.event_name === "pipeline.step" && e.step === "cover_letter_generation"
  )

  const isGenerating = coverLetterGenerationEvent?.status === "started"
  const isError = coverLetterGenerationEvent?.status === "failed"
  const errorMessage = (coverLetterGenerationEvent?.error as any)?.message

  console.log(snapshot)

  if (snapshot?.generated_cover_letter && snapshot.generated_resume) {
    return (
      <div className="space-y-8">
        {/* Completed Header */}
        <ResultsHeader
          latestEvaluatorEvent={latestEvaluatorEvent!}
          title="Cover letter Generation Complete"
        />
        {/* Resume Display */}
        <CoverLetterDisplay
          generatedResume={snapshot.generated_resume}
          coverLetter={snapshot.generated_cover_letter}
          company={snapshot.company_name}
          jobTitle={snapshot.job_title}
        />
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
              Cover Letter Generation Failed
            </h2>
            <p className="text-gray-600">
              An error occurred during the cover letter generation process.
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
          title="Cover Letter Generation"
          currentIteration={currentIteration}
        />
        {/* Resume Placeholder */}
        <DocumentPlaceholder documentName="Cover letter" />
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
              Cover Letter Generation
            </h2>
          </div>
          <p className="text-gray-600 font-semibold text-lg">
            Waiting for resume generation to complete...
          </p>
        </div>
      </div>

      <div className="text-center py-20">
        <div className="p-6 bg-gray-100 rounded-2xl w-fit mx-auto mb-8">
          <FileText className="w-20 h-20 text-gray-400 mx-auto" />
        </div>
        <p className="text-gray-500 font-semibold text-lg">
          Cover letter generation will begin once the resume is complete
        </p>
      </div>
    </div>
  )
}
