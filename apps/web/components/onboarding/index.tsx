"use client"

import Image from "next/image"
import { useSearchParams } from "next/navigation"

import ResumeReview from "./resume-review"
import ResumeUpload from "./resume-upload"

export default function Onboarding() {
  const searchParams = useSearchParams()
  const step = searchParams.get("step")
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple App Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Resumind logo"
              className="w-44 h-auto"
              width={80}
              height={40}
            />
          </div>
          <div className="text-sm text-gray-500">{`Step ${step || "1"} of 3`}</div>
        </div>
      </div>
      {(!step || parseInt(step!) === 1) && <ResumeUpload />}
      {step && parseInt(step) === 2 && <ResumeReview />}
    </div>
  )
}
