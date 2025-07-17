import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="container relative z-10 mx-auto py-20 lg:py-32">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6 text-center lg:text-left">
          <p className="text-lg font-semibold text-accent-blue">
            Welcome to Resumind
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-6xl xl:text-7xl">
            Craft the Perfect Resume, Effortlessly
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground lg:text-xl">
            Resumind is your AI-powered partner for creating tailored CVs and
            cover letters that stand out to employers and get you hired.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Button
              asChild
              className="rounded-full bg-gradient-to-r from-primary-blue to-primary-purple px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105"
            >
              <Link href="/auth/signup">Get Started for Free</Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-2 border-primary-purple px-8 py-3 text-lg font-semibold text-primary-purple transition-colors hover:bg-primary-purple/10"
            >
              Learn More
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required. Start building your future today.
          </p>
        </div>
        <div className="relative flex h-full min-h-[400px] items-center justify-center">
          <div className="absolute inset-0 z-0 rounded-full bg-gradient-to-tr from-primary-blue/10 to-primary-pink/10 blur-3xl"></div>
          <Image
            src="/images/hero-illustration.svg"
            alt="AI-powered resume builder illustration"
            width={600}
            height={500}
            className="relative z-10"
          />
        </div>
      </div>
    </section>
  )
}
