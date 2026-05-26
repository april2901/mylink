import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const testUrl = url.startsWith("http://") || url.startsWith("https://") 
      ? url 
      : `https://${url}`;
    const parsed = new URL(testUrl);
    return parsed.hostname.includes(".") && parsed.hostname.split(".").pop()!.length >= 2;
  } catch {
    return false;
  }
}
