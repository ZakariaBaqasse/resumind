import Image from "next/image"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="container relative z-10 mx-auto py-16 md:py-24">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-block rounded-full bg-primary-light px-3 py-1">
            <p className="text-xs font-medium text-primary">
              AI-POWERED PRODUCTIVITY
            </p>
          </div>
          <h1 className="text-4xl font-bold leading-tight text-primary md:text-5xl">
            Transform Your Workflow with Intelligent Automation
          </h1>
          <p className="max-w-lg text-gray-600">
            Our AI assistant helps teams automate tasks with less effort by
            analyzing patterns, generating insights, and providing contextual
            recommendations.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button className="animate-pulse rounded-full bg-primary px-6 py-2 text-white hover:bg-primary-hover">
              Get Started
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-primary px-6 py-2 text-primary hover:bg-primary-light"
            >
              Book a Demo
            </Button>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 size-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            No credit card required
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rotate-3 rounded-2xl bg-primary opacity-5"></div>
          <div className="relative z-10 overflow-hidden rounded-2xl shadow-lg">
            <div className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/30 via-transparent to-primary/20 mix-blend-overlay"></div>
            <Image
              src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="AI Assistant Dashboard"
              width={600}
              height={400}
              className="size-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
