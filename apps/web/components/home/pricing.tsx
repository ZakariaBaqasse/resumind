import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "For job seekers just getting started.",
    features: [
      "5 resume scans per month",
      "AI-powered keyword suggestions",
      "Basic cover letter generation",
      "Standard templates",
    ],
  },
  {
    name: "Pro",
    price: "15",
    description: "For professionals who want to stand out.",
    features: [
      "Unlimited resume scans",
      "Advanced CV and cover letter generation",
      "Multiple premium templates",
      "Priority email support",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "29",
    description: "For serious applicants who need every advantage.",
    features: [
      "Everything in Pro, plus:",
      "Personalized career coaching session",
      "LinkedIn profile review",
      "24/7 dedicated support",
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <p className="mb-4 font-semibold uppercase tracking-wider text-accent-blue">
            Pricing
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            Find the Plan That's Right for You
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground lg:text-xl">
            Choose a plan that aligns with your career goals. All plans are
            designed to give you a competitive edge in the job market.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative transform rounded-xl p-8 transition-transform hover:scale-105 ${
                plan.popular
                  ? "border-2 border-primary-purple bg-white shadow-2xl"
                  : "border border-neutral-gray-2 bg-white shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-blue to-primary-purple px-4 py-1 text-sm font-semibold text-white">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="mb-2 text-2xl font-bold text-foreground">
                  {plan.name}
                </h3>
                <div className="mb-4 flex items-baseline">
                  <span className="text-5xl font-extrabold text-foreground">
                    {plan.price === "Free" ? "Free" : `${plan.price}`}
                  </span>
                  {plan.price !== "Free" && (
                    <span className="ml-2 text-muted-foreground">/month</span>
                  )}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="mr-3 size-6 shrink-0 text-accent-blue" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full rounded-full py-3 text-lg font-semibold ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary-blue to-primary-purple text-white"
                    : "bg-white text-primary-purple border-2 border-primary-purple"
                }`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-muted-foreground">
          Need a custom solution for your organization?{" "}
          <Link href="/contact" className="font-semibold text-accent-blue hover:underline">
            Contact us
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
