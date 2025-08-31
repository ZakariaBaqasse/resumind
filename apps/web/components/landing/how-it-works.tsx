import { Download, Search, Sparkles, Upload } from "lucide-react"

import { FadeIn } from "../shared/fade-in"

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Upload or paste your resume",
      description: "Start with your existing resume in any format",
      detail:
        "ResumAI extracts and analyzes your experience, skills, and achievements",
    },
    {
      icon: Search,
      title: "Analyze job description",
      description: "Paste the job posting you want to apply for",
      detail:
        "Our AI identifies key requirements, skills, and keywords from the role",
    },
    {
      icon: Sparkles,
      title: "AI-tailored resume generation",
      description: "Watch as your resume transforms in real-time",
      detail:
        "Intelligent matching and optimization for maximum relevance and ATS compatibility",
    },
    {
      icon: Download,
      title: "Download or share with one click",
      description: "Get your optimized resume instantly",
      detail: "Professional formatting ready for applications and sharing",
    },
  ]

  return (
    <section
      id="how-it-works"
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5"
    >
      <div className="container mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              Transform your resume in four simple steps
            </p>
          </div>
        </FadeIn>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary to-primary transform -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <FadeIn key={index} delay={200 + index * 200} direction="up">
                <div
                  className={`flex items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Content Side */}
                  <div
                    className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} text-center md:text-inherit`}
                  >
                    <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <step.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-primary mb-1">
                            Step {index + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-balance">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-pretty mb-2">
                        {step.description}
                      </p>
                      <p className="text-sm text-muted-foreground/80 text-pretty">
                        {step.detail}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Node */}
                  <div className="relative z-10 hidden md:block">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg"></div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block"></div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
