import { AuthError } from "@/components/auth/error"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return <AuthError error={error} />
}
