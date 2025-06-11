"use client"

import { useState } from "react"
import Image from "next/image"
import { Quote, Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "What impressed us most was how the AI adapts to our specific industry needs. It's like having an assistant who understands our business intimately.",
    author: "Michael Chen",
    position: "Product Manager, FutureTech",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "The automation capabilities have transformed our workflow efficiency. We've seen a 40% increase in productivity since implementation.",
    author: "Sarah Johnson",
    position: "Operations Director, InnovateCo",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "The AI's ability to learn and adapt to our specific needs has been remarkable. It's become an indispensable part of our team.",
    author: "David Park",
    position: "CTO, TechGrowth",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const reviewPlatforms = [
  { name: "TrustPilot", logo: "/placeholder.svg?height=24&width=100" },
  { name: "G2", logo: "/placeholder.svg?height=24&width=40" },
  { name: "Capterra", logo: "/placeholder.svg?height=24&width=100" },
  { name: "Software Advice", logo: "/placeholder.svg?height=24&width=120" },
]

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section id="testimonials" className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium text-primary">TESTIMONIALS</p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            What Our Clients Say
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Organizations across industries have transformed their operations
            with our AI assistant.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="mx-auto mb-16 max-w-3xl">
          <div className="relative rounded-2xl bg-white p-8 shadow-lg">
            <div className="absolute left-4 top-4 font-serif text-6xl text-primary">
              <Quote className="size-4" />
            </div>
            <div className="relative">
              <div className="flex min-h-[160px] items-center justify-center">
                <p className="relative z-10 px-8 text-center text-xl text-gray-600">
                  {testimonials[activeIndex].quote}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-center space-x-4">
                <Image
                  src={testimonials[activeIndex].avatar || "/placeholder.svg"}
                  alt={testimonials[activeIndex].author}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">
                    {testimonials[activeIndex].author}
                  </p>
                  <p className="text-sm text-gray-600">
                    {testimonials[activeIndex].position}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Navigation */}
          <div className="mt-6 flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`size-2 rounded-full transition-colors duration-200 ${
                  index === activeIndex ? "bg-primary" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Rating Section */}
        <div className="mb-12 text-center">
          <div className="mb-2 flex justify-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-6 fill-current text-yellow-400" />
            ))}
          </div>
          <p className="mb-8 text-xl font-semibold text-gray-900">
            4.9 out of 5 stars from over 500 reviews
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {reviewPlatforms.map((platform) => (
              <Image
                key={platform.name}
                src={platform.logo || "/placeholder.svg"}
                alt={platform.name}
                width={platform.name === "G2" ? 40 : 100}
                height={24}
                className="h-6 w-auto"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
