import {
  BarChart3,
  CheckCircle,
  FileText,
  Palette,
  Search,
  Shield,
  Target,
  Zap,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { FadeIn } from "../shared/fade-in"

export function Features() {
  const features = [
    {
      icon: FileText,
      title: "Smart Parsing",
      description:
        "Extracts key skills, experiences, and achievements from any format.",
      details:
        "Advanced AI parsing handles PDFs, Word docs, and plain text with 99% accuracy.",
    },
    {
      icon: Target,
      title: "Context-Aware Tailoring",
      description: "Matches your experience to the role for maximum relevance.",
      details:
        "Intelligent analysis identifies the most relevant experiences for each position.",
    },
    {
      icon: Shield,
      title: "ATS Optimization",
      description: "Ensures compliance with applicant tracking systems.",
      details:
        "Tested with 50+ ATS platforms to guarantee your resume gets through.",
    },
    {
      icon: Palette,
      title: "Instant Formatting",
      description:
        "Clean, professional templates optimized for readability and scanning.",
      details:
        "Multiple template options designed by hiring experts and recruiters.",
    },
  ]

  const keywordTabs = [
    {
      id: "analysis",
      label: "Role Analysis",
      icon: Search,
      content: {
        title: "Deep Job Description Analysis",
        description:
          "AI breaks down job requirements into key skills, qualifications, and priorities.",
        impact:
          "Identifies the most important keywords and phrases for your target role.",
      },
    },
    {
      id: "alignment",
      label: "Skill Alignment",
      icon: Target,
      content: {
        title: "Experience Matching",
        description:
          "Maps your background to job requirements with precision scoring.",
        impact: "Highlights your most relevant experiences and achievements.",
      },
    },
    {
      id: "clustering",
      label: "Keyword Clustering",
      icon: BarChart3,
      content: {
        title: "Strategic Keyword Placement",
        description:
          "Groups related terms and places them naturally throughout your resume.",
        impact: "Improves keyword density without compromising readability.",
      },
    },
  ]

  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              Everything you need to create winning resumes
            </p>
          </div>
        </FadeIn>

        {/* Core Features */}
        <FadeIn delay={200} staggerChildren stagger={150}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-balance">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-pretty text-sm">
                        {feature.description}
                      </p>
                      <p className="text-xs text-muted-foreground/80 text-pretty">
                        {feature.details}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeIn>

        {/* Keyword Optimization Spotlight */}
        <FadeIn delay={400}>
          <div className="bg-ghost-white border border-border rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-balance mb-2">
                Keyword Optimization Spotlight
              </h3>
              <p className="text-muted-foreground text-pretty">
                Advanced AI analysis for maximum job match rates
              </p>
            </div>

            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-8">
                {keywordTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 bg-muted/5"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {keywordTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-balance">
                        {tab.content.title}
                      </h4>
                      <p className="text-muted-foreground text-pretty">
                        {tab.content.description}
                      </p>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="text-sm font-medium text-primary">
                          Expected Impact: {tab.content.impact}
                        </p>
                      </div>
                    </div>
                    <div className="bg-muted/20 rounded-lg p-6 h-48 flex items-center justify-center">
                      <tab.icon className="w-16 h-16 text-muted-foreground/50" />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
