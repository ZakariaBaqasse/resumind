import { AlertCircle, FileText, Palette, Users } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

import { FadeIn } from "../shared/fade-in"

export function Limitations() {
  const limitations = [
    {
      icon: FileText,
      title: "Best results with detailed resumes",
      description:
        "More comprehensive input leads to better AI optimization and tailoring",
    },
    {
      icon: Palette,
      title: "AI supports resume text only; custom designs in roadmap",
      description:
        "Currently focused on content optimization; visual customization coming soon",
    },
    {
      icon: Users,
      title: "Beta access currently limited",
      description:
        "Rolling out gradually to ensure quality experience for all users",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
      <div className="container mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">
                Transparent Scope & Limitations
              </h2>
            </div>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              We believe in honest communication about what ResumAI can and
              cannot do
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={200} staggerChildren stagger={150}>
          <div className="grid md:grid-cols-3 gap-6">
            {limitations.map((limitation, index) => (
              <Card key={index} className="border-primary/20 bg-ghost-white">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <limitation.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-balance">
                        {limitation.title}
                      </h3>
                      <p className="text-muted-foreground text-pretty">
                        {limitation.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
