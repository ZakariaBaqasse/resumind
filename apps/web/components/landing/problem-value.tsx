import { BarChart3, Clock, Shield, Target, TrendingUp, Zap } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

import { FadeIn } from "../shared/fade-in"

export function ProblemValue() {
  const items = [
    {
      problem: {
        icon: Clock,
        title: "Manual tailoring is time-consuming",
        description:
          "Hours spent customizing each resume for different job applications",
      },
      value: {
        icon: Zap,
        title: "AI-driven customization per job description",
        description:
          "Instant resume optimization tailored to each specific role",
      },
    },
    {
      problem: {
        icon: Target,
        title: "Resumes lack ATS optimization",
        description:
          "Applications filtered out before human review due to poor formatting",
      },
      value: {
        icon: Shield,
        title: "ATS-ready formats and keyword alignment",
        description:
          "Guaranteed compatibility with 99% of applicant tracking systems",
      },
    },
    {
      problem: {
        icon: TrendingUp,
        title: "Low match rates from generic applications",
        description:
          "One-size-fits-all resumes fail to highlight relevant experience",
      },
      value: {
        icon: BarChart3,
        title: "Improved response and interview rates",
        description:
          "50% higher callback rates with targeted, optimized resumes",
      },
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
              From Problem to Solution
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              Transform your job search with AI-powered resume optimization
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={200} staggerChildren stagger={200}>
          <div className="grid md:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <div key={index} className="space-y-6">
                {/* Problem Card */}
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                          <item.problem.icon className="w-6 h-6 text-destructive" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-balance">
                          {item.problem.title}
                        </h3>
                        <p className="text-muted-foreground text-pretty">
                          {item.problem.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Value Card */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <item.value.icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-balance">
                          {item.value.title}
                        </h3>
                        <p className="text-muted-foreground text-pretty">
                          {item.value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
