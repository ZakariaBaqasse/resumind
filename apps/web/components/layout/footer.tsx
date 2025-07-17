import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-neutral-gray-1 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <h2 className="mb-4 text-2xl font-bold text-primary-purple">
              Resumind
            </h2>
            <p className="text-muted-foreground">
              AI-powered CV and cover letter generation.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground transition-colors hover:text-primary-purple"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-muted-foreground transition-colors hover:text-primary-purple"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary-purple"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-muted-foreground transition-colors hover:text-primary-purple"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary-purple"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary-purple"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-gray-2 pt-8">
          <p className="text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} Resumind. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
