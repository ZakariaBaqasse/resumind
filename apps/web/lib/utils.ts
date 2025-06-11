import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function placeholderImage(seed: string) {
  return `https://api.dicebear.com/9.x/identicon/svg?seed=${seed}`
}
