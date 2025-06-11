"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"

const benefits = [
  {
    title: "Proven Results",
    description:
      "Our customers report an average 35% increase in productivity within the first three months.",
  },
  {
    title: "Enterprise Security",
    description:
      "Your data is protected with enterprise-grade security and compliance with GDPR, HIPAA, and SOC 2.",
  },
  {
    title: "Dedicated Support",
    description:
      "Our support team is available to help you get the most from our platform with personalized assistance.",
  },
  {
    title: "Continuous Improvement",
    description:
      "We regularly release updates and new features based on customer feedback and AI advancements.",
  },
]

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.info("Form submitted:", formData)
  }

  return (
    <section className="bg-white py-24" id="contact">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium text-primary">CONTACT US</p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Get in Touch
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Have questions about our AI platform? Contact us today to learn how
            we can help transform your team&#39;s productivity.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-full bg-primary py-3 text-white transition-colors hover:bg-primary-hover"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Benefits */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Why Choose Our AI Platform?
            </h3>
            <div className="space-y-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4">
                  <CheckCircle2Icon className="size-6 shrink-0 text-primary" />
                  <div>
                    <h4 className="mb-1 font-semibold text-gray-900">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
