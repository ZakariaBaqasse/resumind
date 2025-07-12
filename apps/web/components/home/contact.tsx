"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle2Icon, Mail, MessageSquare, User } from "lucide-react"

import { Button } from "@/components/ui/button"

const benefits = [
  {
    title: "Increased Interview Invitations",
    description:
      "Our users report a significant increase in interview invitations after using Resumind.",
  },
  {
    title: "Faithful & Reworded CVs",
    description:
      "Your CV stays true to your experience, but is reworded to emphasize key skills.",
  },
  {
    title: "Time-Saving Automation",
    description:
      "Generate tailored CVs and cover letters in minutes, not hours.",
  },
  {
    title: "Always Improving",
    description:
      "We continuously update our AI to ensure you have the best possible chance of success.",
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
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent-blue">
            Contact Us
          </p>
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            Get in Touch
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground lg:text-xl">
            Have questions about Resumind? We'd love to hear from you. Reach out
            and let us know how we can help you land your dream job.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-gray-2 py-3 pl-12 pr-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-purple"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-gray-2 py-3 pl-12 pr-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-purple"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-muted-foreground" />
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full resize-none rounded-lg border border-neutral-gray-2 py-3 pl-12 pr-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-purple"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-primary-blue to-primary-purple py-3 text-lg font-semibold text-white transition-transform hover:scale-105"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Benefits */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-foreground">
              Why Choose Resumind?
            </h3>
            <div className="space-y-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4">
                  <CheckCircle2Icon className="size-8 shrink-0 text-accent-blue" />
                  <div>
                    <h4 className="mb-1 text-xl font-semibold text-foreground">
                      {benefit.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
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
