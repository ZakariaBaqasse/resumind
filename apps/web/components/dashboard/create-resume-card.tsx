"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CreateResumeCardProps {
  onCreateResume: (data: {
    jobTitle: string
    companyName: string
    jobDescription: string
  }) => void
}

export function CreateResumeCard({ onCreateResume }: CreateResumeCardProps) {
  const [isCreatingResume, setIsCreatingResume] = useState(false)
  const [jobDescription, setJobDescription] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")

  const handleCreateResume = () => {
    onCreateResume({
      jobTitle,
      companyName,
      jobDescription,
    })
    setIsCreatingResume(false)
    setJobDescription("")
    setJobTitle("")
    setCompanyName("")
  }

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-blue-300 transition-colors">
      <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Plus className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">
          Create Tailored Resume
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Paste a job description to generate a customized resume
        </p>
        <Dialog open={isCreatingResume} onOpenChange={setIsCreatingResume}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Tailored Resume</DialogTitle>
              <DialogDescription>
                Provide the job details and description to generate a customized
                resume
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Job Title
                  </label>
                  <Input
                    placeholder="e.g. Senior Frontend Developer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Company Name
                  </label>
                  <Input
                    placeholder="e.g. Google"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Job Description
                </label>
                <Textarea
                  placeholder="Paste the complete job description here..."
                  rows={8}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingResume(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateResume}
                  disabled={!jobTitle || !companyName || !jobDescription}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Generate Resume
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
