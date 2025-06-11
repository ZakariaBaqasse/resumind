import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

const features = [
  {
    name: "Secure & Private",
    description:
      "Enterprise-grade security with end-to-end encryption and customizable data retention policies.",
    iconBg: "from-[#F0EBFF] to-[#E5D8FF]",
    iconColor: "text-primary",
  },
  {
    name: "Team Collaboration",
    description:
      "Real-time collaboration tools that allow seamless teamwork across your organization.",
    iconBg: "from-[#F0EBFF] to-[#E5D8FF]",
    iconColor: "text-primary",
  },
  {
    name: "Universal Integration",
    description:
      "Connect with your existing tools through our extensive API and pre-built integrations.",
    iconBg: "from-[#F0EBFF] to-[#E5D8FF]",
    iconColor: "text-primary",
  },
  {
    name: "Advanced Analytics",
    description:
      "Gain invaluable insights with our detailed analytics dashboard and customizable reports.",
    iconBg: "from-[#F0EBFF] to-[#E5D8FF]",
    iconColor: "text-primary",
  },
]

const smartWorkflowFeatures = [
  "Automate repetitive tasks with customizable workflows",
  "Natural language processing for effortless interaction",
  "Contextual recommendations based on your team's behavior",
  "Proactive alerts for potential issues or opportunities",
]

export function Features() {
  return (
    <section
      id="features"
      className="bg-[linear-gradient(135deg,_rgba(var(--primary-rgb),_0.1)_0%,_rgba(255,_255,_255,_0.8)_50%,_rgba(10,_175,_156,_0.1)_100%)] py-24"
    >
      <div className="container mx-auto px-4">
        {/* Features Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium text-primary">FEATURES</p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            The Ultimate AI Assistant for Modern Teams
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Our AI platform helps you streamline workflows, enhance
            productivity, and make data-driven decisions with ease.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.name}
              className="rounded-xl bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              <div
                className={`size-12 rounded-full bg-gradient-to-br ${feature.iconBg} mb-4 flex items-center justify-center`}
              >
                <div className={`size-6 ${feature.iconColor}`}>
                  {index === 0 && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {feature.name}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Smart Workflows Section */}
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <div className="absolute inset-0 -rotate-3 rounded-2xl bg-primary opacity-5"></div>
            <Image
              src="/images/features.jpeg"
              alt="Smart Workflows Dashboard"
              width={600}
              height={400}
              className="relative rounded-2xl shadow-lg"
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Smart Workflows That Adapt To Your Needs
            </h3>
            <p className="text-gray-600">
              Our AI continuously learns from your team&#39;s patterns to
              automate routine tasks, suggest improvements, and identify
              potential bottlenecks before they occur.
            </p>
            <ul className="space-y-4">
              {smartWorkflowFeatures.map((feature) => (
                <li key={feature} className="flex items-start space-x-3">
                  <CheckCircle2 className="size-6 shrink-0 text-primary" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
