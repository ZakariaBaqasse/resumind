import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="mb-4 w-full md:mb-0 md:w-1/4">
            <h2 className="mb-4 text-lg font-bold text-primary">
              AI Assistant
            </h2>
            <p className="text-sm text-gray-600">
              Transforming workflows with intelligent automation.
            </p>
          </div>
          <div className="mb-4 w-full md:mb-0 md:w-1/4">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/features"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div className="mb-4 w-full md:mb-0 md:w-1/4">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            &copy; 2024 AI Assistant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
