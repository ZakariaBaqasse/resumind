import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Starter",
    price: "29",
    description: "Perfect for individuals and small teams getting started.",
    features: [
      "AI assistant with basic capabilities",
      "5 users included",
      "5,000 AI operations per month",
      "Basic analytics dashboard",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: "79",
    description: "Ideal for growing teams with advanced needs.",
    features: [
      "Everything in Starter, plus:",
      "15 users included",
      "20,000 AI operations per month",
      "Advanced analytics & reporting",
      "Priority support response",
      "Custom AI training options",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description:
      "For organizations requiring high capacity and custom solutions.",
    features: [
      "Everything in Professional, plus:",
      "Unlimited users",
      "Unlimited AI operations",
      "Dedicated account manager",
      "24/7 phone & email support",
      "Custom integrations",
      "On-premise deployment option",
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium text-primary">PRICING</p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Plans for Teams of All Sizes
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Choose the plan that fits your needs. All plans include our core AI
            capabilities, security features, and regular updates.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-white p-8 ${
                plan.popular
                  ? "border-2 border-primary shadow-lg"
                  : "border border-gray-200"
              } transition-all duration-200 hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-sm font-medium text-white">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-8">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mb-4 flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="ml-2 text-gray-600">/month</span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="mr-3 size-5 shrink-0 text-primary" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full rounded-full ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "border-2 border-primary bg-white text-primary hover:bg-primary-light"
                }`}
              >
                Get started
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-gray-600">
          All plans include a 14-day free trial. No credit card required to
          start. Need a custom solution?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>{" "}
          for a tailored plan.
        </p>
      </div>
    </section>
  )
}
