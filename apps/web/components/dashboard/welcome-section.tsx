interface WelcomeSectionProps {
  userName?: string
}

export function WelcomeSection({ userName }: WelcomeSectionProps) {
  const firstName = userName?.split(" ")[0]

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {firstName}!
      </h2>
      <p className="text-gray-600">
        Ready to create your next tailored resume?
      </p>
    </div>
  )
}
