"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Building,
  Calendar,
  Copy,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  User,
} from "lucide-react"

import { useGetUser } from "@/hooks/dashboard/use-get-user"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import PageLoader from "../shared/page-loader"

interface CustomResume {
  id: string
  title: string
  company: string
  position: string
  created_date: string
  status: "draft" | "completed"
}

interface BaseResume {
  id: string
  name: string
  email: string
  last_updated: string
  skills_count: number
  latest_role_title: string
  latest_role_company: string
}

export default function DashboardComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreatingResume, setIsCreatingResume] = useState(false)
  const [jobDescription, setJobDescription] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const { data: user, isLoading, error } = useGetUser()
  const router = useRouter()

  useEffect(() => {
    console.log(user)
    if (!isLoading && user && !user.initial_resume) {
      router.replace("/onboarding")
    }
  }, [user, isLoading, router])

  const handleCreateResume = () => {
    // Handle resume creation logic
    console.log("Creating resume for:", {
      jobTitle,
      companyName,
      jobDescription,
    })
    setIsCreatingResume(false)
    setJobDescription("")
    setJobTitle("")
    setCompanyName("")
  }

  if (isLoading) {
    return <PageLoader />
  }

  if (error) {
    console.error("Error fetching user data:", error)
    // TODO: implement a proper error component
    return <div>Error loading data</div>
  }

  if (!user?.initial_resume) {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Resumind</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h2>
          <p className="text-gray-600">
            Ready to create your next tailored resume?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Base Resume Card */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <FileText className="w-5 h-5" />
                Your Base Resume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Skills:</span>
                  <span className="font-medium text-blue-900">
                    {user.initial_resume.resume.skills.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Latest Role:</span>
                  <span className="font-medium text-blue-900">
                    {user.initial_resume.resume.work_experiences[0].position}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Company:</span>
                  <span className="font-medium text-blue-900">
                    {
                      user.initial_resume.resume.work_experiences[0]
                        .company_name
                    }
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Create New Resume */}
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
              <Dialog
                open={isCreatingResume}
                onOpenChange={setIsCreatingResume}
              >
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Tailored Resume</DialogTitle>
                    <DialogDescription>
                      Provide the job details and description to generate a
                      customized resume
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

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Resumes created:</span>
                  <span className="font-medium text-gray-900">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">This month:</span>
                  <span className="font-medium text-gray-900">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">0</span>
                </div>
              </div>
              <div className="pt-2">
                <div className="text-xs text-gray-500 mb-1">
                  Recent Activity
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Resumes Section */}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
          {/* {filteredResumes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">
                  No custom resumes yet
                </h4>
                <p className="text-gray-600 mb-4">
                  Create your first tailored resume to get started
                </p>
                <Button
                  onClick={() => setIsCreatingResume(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Resume
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => (
                <Card
                  key={resume.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-medium text-gray-900 mb-1">
                          {resume.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="w-4 h-4" />
                          {resume.company}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          resume.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          resume.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {resume.status === "completed" ? "Completed" : "Draft"}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created on{" "}
                      {new Date(resume.created_date).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}
