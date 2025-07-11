import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { Contact } from "@/components/home/contact"
import { Features } from "@/components/home/features"
import { Hero } from "@/components/home/hero"
import { Pricing } from "@/components/home/pricing"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

export default async function Home() {
  const session = await getServerSession()
  if (session) {
    redirect("/dashboard")
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8F9FE]">
      <Navbar />
      <Hero />
      <Features />
      {/* <Testimonials /> */}
      <Pricing />
      <Contact />
      <Footer />
    </div>
  )
}
