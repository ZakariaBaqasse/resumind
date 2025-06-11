import Link from "next/link"

import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="container relative z-10 mx-auto py-4">
      <nav className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            AI Assistant
          </Link>
        </div>
        <div className="hidden items-center space-x-8 md:flex">
          <Link
            href="#features"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Features
          </Link>
          {/* <Link
            href="#testimonials"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Testimonials
          </Link> */}
          <Link
            href="#pricing"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Pricing
          </Link>
          <Link
            href="#contact"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Contact
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/auth/login"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Log in
          </Link>
          <Link href="/auth/signup">
            <Button className="rounded-full bg-primary px-4 py-2 text-sm text-white hover:bg-primary-hover">
              Sign up
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
