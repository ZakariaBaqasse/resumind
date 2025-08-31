import { FileCheck, Globe, Lock, Shield } from "lucide-react"

import { FadeIn } from "../shared/fade-in"

export function Integrations() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Data encrypted in transit and at rest",
      description: "End-to-end encryption protects your personal information",
    },
    {
      icon: Lock,
      title: "No data sharing without consent",
      description: "Your resume data stays private and is never sold or shared",
    },
    {
      icon: FileCheck,
      title: "Compliant with SOC 2, GDPR-ready",
      description:
        "Meeting the highest standards for data protection and privacy",
    },
    {
      icon: Globe,
      title: "Privacy policy and security docs",
      description: "Transparent about our data practices and security measures",
    },
  ]

  return (
    <section
      id="integrations"
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5"
    >
      <div className="container mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
              Integrations & Security
            </h2>
          </div>
        </FadeIn>

        {/* Security Features */}
        <FadeIn delay={400}>
          <div className="bg-ghost-white border border-border rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-center mb-8">
              Your data is secure with us
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-balance">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground text-pretty">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-6 mt-8 pt-6 border-t border-border">
              <a href="#" className="text-sm text-primary hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-primary hover:underline">
                Security Documentation
              </a>
              <a href="#" className="text-sm text-primary hover:underline">
                Terms of Service
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
