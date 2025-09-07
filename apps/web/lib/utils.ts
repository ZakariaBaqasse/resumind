import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function placeholderImage(seed: string) {
  return `https://api.dicebear.com/9.x/identicon/svg?seed=${seed}`
}

export function createQueryStringFunc(
  name: string,
  value: string,
  searchParams: URLSearchParams
) {
  const params = new URLSearchParams(searchParams.toString())
  params.set(name, value)

  return params.toString()
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
