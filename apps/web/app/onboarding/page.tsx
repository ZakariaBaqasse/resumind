import ProtectedComponents from "@/components/auth/protected-component"
import Onboarding from "@/components/onboarding"

export default function OnboardingPage() {
  return (
    <ProtectedComponents>
      <Onboarding />
    </ProtectedComponents>
  )
}
