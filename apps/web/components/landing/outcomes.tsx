"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { FadeIn } from "../shared/fade-in"

export function Outcomes() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const kpis = [
    {
      icon: TrendingUp,
      value: "+50%",
      label: "interview callback rates",
      description: "Higher response rates from targeted applications",
    },
    {
      icon: Clock,
      value: "10x",
      label: "faster resume customization",
      description: "Minutes instead of hours per application",
    },
    {
      icon: Shield,
      value: "99%",
      label: "of ATS systems",
      description: "Optimized for maximum compatibility",
    },
  ]

  const testimonials = [
    {
      quote:
        "ResumAI helped me land interviews at 3 FAANG companies. The keyword optimization made all the difference.",
      industry: "Software Engineering",
      rating: 5,
    },
    {
      quote:
        "I went from 2% response rate to 15% after using ResumAI. The ATS optimization really works.",
      industry: "Product Management",
      rating: 5,
    },
    {
      quote:
        "Saved me hours of manual work. The AI perfectly matched my experience to each job description.",
      industry: "Data Science",
      rating: 5,
    },
    {
      quote:
        "Finally got past the initial screening at top consulting firms. The tailoring is incredibly smart.",
      industry: "Management Consulting",
      rating: 5,
    },
    {
      quote:
        "As a career changer, ResumAI helped me highlight transferable skills I didn't even know I had.",
      industry: "Healthcare to Tech",
      rating: 5,
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )
  }

  return (
    <section id="success-stories" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
              Proven Results
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              Real outcomes from job seekers who transformed their applications
              with ResumAI
            </p>
          </div>
        </FadeIn>

        {/* KPI Tiles */}
        <FadeIn delay={200} staggerChildren stagger={200}>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {kpis.map((kpi, index) => (
              <Card
                key={index}
                className="text-center group hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                      <kpi.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary">
                        {kpi.value}
                      </div>
                      <div className="text-lg font-semibold text-balance">
                        {kpi.label}
                      </div>
                      <p className="text-sm text-muted-foreground text-pretty">
                        {kpi.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeIn>

        {/* Testimonial Slider */}
        <FadeIn delay={400}>
          <div className="bg-card/30 border border-border rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-center mb-8">
              What job seekers are saying
            </h3>

            <div className="relative max-w-4xl mx-auto">
              <div className="text-center space-y-6">
                {/* Stars */}
                <div className="flex justify-center space-x-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    )
                  )}
                </div>

                {/* Quote */}
                <blockquote className="text-xl text-pretty leading-relaxed">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>

                {/* Industry */}
                <div className="text-muted-foreground font-medium">
                  — {testimonials[currentTestimonial].industry}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center items-center space-x-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevTestimonial}
                  className="w-10 h-10 p-0 bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTestimonial ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextTestimonial}
                  className="w-10 h-10 p-0 bg-transparent"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
