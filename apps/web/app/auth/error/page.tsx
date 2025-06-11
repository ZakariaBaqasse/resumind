import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default async function AuthErrorPage({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string>>
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const errorMessage =
    errorMessages[error as keyof typeof errorMessages] || errorMessages.default
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE]">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Authentication Error
          </h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-center">
            <b>{errorMessage.code}Error</b>:<br />
            {errorMessage.message}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Please try again or choose another authentication method.
          </p>

          <div className="flex flex-col space-y-3">
            <Link href="/auth/login" className="w-full">
              <Button className="w-full bg-primary hover:bg-primary-hover text-white rounded-full">
                Back to Login
              </Button>
            </Link>

            <Link href="/auth/signup" className="w-full">
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-[#F0EBFF] rounded-full"
              >
                Create an Account
              </Button>
            </Link>

            <Link
              href="/"
              className="text-[#7B3FF2] hover:underline text-center text-sm mt-2"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const errorMessages = {
  default: {
    code: "default",
    heading: "Error",
    message: "An error occurred while signing in.",
  },
  Configuration: {
    code: "Configuration",
    heading: "Server error",
    message:
      "There is a problem with the server configuration. Check the server logs for more information.",
  },
  AccessDenied: {
    code: "AccessDenied",
    heading: "Access Denied",
    message: "You do not have permission to sign in.",
  },
  Verification: {
    code: "Verification",
    heading: "Unable to sign in",
    message:
      "The sign in link is no longer valid. It may have been used already or it may have expired.",
  },
}
