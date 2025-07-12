"use client"

import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CustomResumesSectionProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function CustomResumesSection({
  searchQuery,
  onSearchChange,
}: CustomResumesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Your Custom Resumes
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      <p>You didn't create any custom resumes yet</p>
      {/* TODO: Add resume list component when data is available */}
    </div>
  )
}
