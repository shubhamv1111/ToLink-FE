import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to get dynamic base URL
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use current window location
    return `${window.location.protocol}//${window.location.host}`;
  } else {
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_BASE_URL || "https://tolink.in";
  }
}

// Function to generate short URL with dynamic base
export function generateShortUrl(shortCode: string): string {
  return `${getBaseUrl()}/${shortCode}`;
}
