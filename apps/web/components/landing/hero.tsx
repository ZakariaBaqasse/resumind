"use client"

import { useRouter } from "next/navigation"
import { Play, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

import { FadeIn } from "../shared/fade-in"

export function Hero() {
  const router = useRouter()
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-gradient-via to-gradient-to">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <FadeIn delay={200}>
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                  Tailored Resumes.{" "}
                  <span className="text-primary">10x Faster.</span> Powered by
                  AI.
                </h1>
                <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
                  ResumAI transforms your experience into targeted, job-winning
                  resumes — in minutes, not hours.
                </p>
              </div>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => router.push("/auth/signup")}
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate My Resume
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Visual */}
          <FadeIn delay={300} direction="left">
            <div className="relative">
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full animate-ping"></div>
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full animate-ping"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/15 rounded-full animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              <div className="bg-white border border-border rounded-xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 relative z-10">
                {/* Resume Header */}
                <div className="space-y-6">
                  <div className="text-center border-b pb-4">
                    <h2 className="text-lg font-bold text-slate-800 mb-1">
                      Sarah Chen
                    </h2>
                    <p className="text-sm text-slate-600">
                      sarah.chen@email.com • (555) 123-4567
                    </p>
                    <p className="text-sm text-slate-600">
                      San Francisco, CA • linkedin.com/in/sarahchen
                    </p>
                  </div>

                  {/* Professional Summary - Completed */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                      Professional Summary
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Senior Software Engineer with 6+ years of experience
                      building scalable web applications. Expertise in React,
                      Node.js, and cloud architecture with a proven track record
                      of...
                    </p>
                    <div className="h-2 bg-slate-300 rounded w-3/4 animate-pulse"></div>
                  </div>

                  {/* Experience Section - Half Generated */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                      Experience
                    </h3>
                    <div className="space-y-3">
                      {/* First Job - Completed */}
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="text-sm font-medium text-slate-800">
                              Senior Software Engineer
                            </h4>
                            <p className="text-xs text-slate-600">
                              TechCorp Inc.
                            </p>
                          </div>
                          <span className="text-xs text-slate-500">
                            2021 - Present
                          </span>
                        </div>
                        <ul className="text-xs text-slate-700 space-y-1 pl-4">
                          <li>
                            • Led development of microservices architecture
                            serving 2M+ users
                          </li>
                          <li>
                            • Improved application performance by 40% through
                            code optimization
                          </li>
                          <div className="h-2 bg-green-200 rounded w-5/6 animate-pulse"></div>
                        </ul>
                      </div>

                      {/* Second Job - Being Generated */}
                      <div className="opacity-60">
                        <div className="flex justify-between items-start mb-1">
                          <div className="space-y-1">
                            <div className="h-3 bg-slate-400 rounded w-32 animate-pulse"></div>
                            <div className="h-3 bg-slate-300 rounded w-24 animate-pulse"></div>
                          </div>
                          <div className="h-3 bg-slate-300 rounded w-16 animate-pulse"></div>
                        </div>
                        <div className="space-y-1 pl-4">
                          <div className="h-2 bg-slate-200 rounded w-full animate-pulse"></div>
                          <div className="h-2 bg-slate-200 rounded w-4/5 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section - Mix of completed and generating */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        React
                      </span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        Node.js
                      </span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        TypeScript
                      </span>
                      <div className="h-6 bg-primary/20 rounded-full w-16 animate-pulse"></div>
                      <div className="h-6 bg-primary/20 rounded-full w-12 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Education - Skeleton */}
                  <div className="space-y-2 opacity-50">
                    <div className="h-3 bg-primary/40 rounded w-20 animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-2 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border">
                  <div className="relative">
                    {/* Robot Head */}
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center relative">
                      {/* Robot Eyes */}
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <div
                          className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                      </div>
                      {/* Robot Antenna */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-primary/80 rounded-full"></div>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    {/* Robot Body */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-3 bg-primary/60 rounded-b-md"></div>
                    {/* Status Indicator */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-600 font-medium">
                    AI Writing...
                  </span>
                </div>

                <div className="text-xs text-muted-foreground bg-primary/10 p-3 rounded mt-6 border-l-4 border-primary flex items-center gap-2">
                  ✨ AI is optimizing your resume for: "Senior Software
                  Engineer"
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
