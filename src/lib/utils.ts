import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function formatDistanceToNow(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) {
    return "just now"
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  } else if (days < 30) {
    return `${days} ${days === 1 ? "day" : "days"} ago`
  } else if (months < 12) {
    return `${months} ${months === 1 ? "month" : "months"} ago`
  } else {
    return `${years} ${years === 1 ? "year" : "years"} ago`
  }
}