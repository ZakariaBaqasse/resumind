import Link from "next/link"

import { Button } from "@/components/ui/button"

import { FadeIn } from "../shared/fade-in"

export function CTAFooter() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
      <div className="container mx-auto max-w-4xl text-center">
        <FadeIn>
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">
                Ready to transform your job search?
              </h2>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                Get a tailored resume in minutes — not hours. Join thousands of
                job seekers who've already improved their application success
                rates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Link href="/auth/signup">Generate My Resume</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              No credit card required • Free beta access
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
