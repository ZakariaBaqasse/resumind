import { CTAFooter } from "@/components/landing/cta-footer"
import { FAQ } from "@/components/landing/faq"
import { Features } from "@/components/landing/features"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Integrations } from "@/components/landing/integrations"
import { Limitations } from "@/components/landing/limitations"
import { Outcomes } from "@/components/landing/outcomes"
import { ProblemValue } from "@/components/landing/problem-value"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vibrant-blue via-periwinkle to-soft-pink">
      <Header />
      <main>
        <Hero />
        <ProblemValue />
        <HowItWorks />
        <Features />
        <Integrations />
        <Outcomes />
        <Limitations />
        <FAQ />
        <CTAFooter />
      </main>
      <Footer />
    </div>
  )
}
