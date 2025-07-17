import Link from "next/link"

import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="container relative z-50 mx-auto py-6">
      <nav className="flex items-center justify-between rounded-full bg-white/50 px-6 py-3 shadow-lg backdrop-blur-xl">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary-purple">
            Resumind
          </Link>
        </div>
        <div className="hidden items-center space-x-8 md:flex">
          <Link
            href="#features"
            className="font-semibold text-muted-foreground transition-colors hover:text-primary-purple"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="font-semibold text-muted-foreground transition-colors hover:text-primary-purple"
          >
            Pricing
          </Link>
          <Link
            href="#contact"
            className="font-semibold text-muted-foreground transition-colors hover:text-primary-purple"
          >
            Contact
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/auth/login"
            className="font-semibold text-muted-foreground transition-colors hover:text-primary-purple"
          >
            Log in
          </Link>
          <Link href="/auth/signup">
            <Button className="rounded-full bg-gradient-to-r from-primary-blue to-primary-purple px-6 py-2 font-semibold text-white transition-transform hover:scale-105">
              Sign up
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
