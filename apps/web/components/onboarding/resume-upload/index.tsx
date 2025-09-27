"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { create } from "lodash"
import {
  ArrowRight,
  CheckCircle,
  FileText,
  Loader2,
  Upload,
} from "lucide-react"

import { createQueryStringFunc } from "@/lib/utils"
import { useUploadResume } from "@/hooks/onboarding/use-upload-resume"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ResumeUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const { trigger, data, isMutating, error } = useUploadResume()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const createQueryString = useCallback(createQueryStringFunc, [searchParams])

  useEffect(() => {
    if (data) {
      router.push(pathname + "?" + createQueryString("step", "2", searchParams))
    }
  }, [data, router, pathname, createQueryString])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setUploadedFile(file)
      simulateUpload()
    }
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const uploadResumeToBackend = async (file: File) => {
    await trigger(file)
    if (error) {
      console.error("ERROR", error)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Upload your resume
          </h2>
          <p className="text-gray-600">
            We'll use this as your base resume to create tailored versions for
            different jobs.
          </p>
        </div>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-8">
            {!uploadedFile ? (
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                <div className="space-y-2 mb-6">
                  <p className="font-medium text-gray-900">
                    Drag and drop your resume here
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to browse files
                  </p>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileInput}
                  aria-label="Upload resume file"
                />
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Choose File
                </Button>
                <p className="text-xs text-gray-500 mt-4">
                  PDF, DOC, or DOCX • Max 10MB
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="h-8 w-8 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-green-900 truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-green-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {uploadProgress === 100 && (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  )}
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Processing...</span>
                      <span className="text-gray-600">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {uploadProgress === 100 && (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUploadedFile(null)
                        setUploadProgress(0)
                      }}
                      className="flex-1"
                    >
                      Change File
                    </Button>
                    <Button
                      disabled={isMutating}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => uploadResumeToBackend(uploadedFile)}
                    >
                      {isMutating ? (
                        <div className="flex justify-center items-center gap-3">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          Uploading
                        </div>
                      ) : (
                        "Continue"
                      )}
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Your data is secure and encrypted. We never share your information.
          </p>
        </div>
      </div>
    </div>
  )
}
