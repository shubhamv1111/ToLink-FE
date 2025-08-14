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

// Deterministically derive a short code from a source string (e.g., original URL)
// Produces a stable, lowercase base36 hash trimmed to 6 characters
export function generateDeterministicCodeFromString(
  source: string,
  length: number = 6
): string {
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    hash = ((hash << 5) - hash + source.charCodeAt(i)) | 0; // 32-bit int
  }
  const positive = Math.abs(hash);
  const base36 = positive.toString(36);
  // Pad with '0' to ensure sufficient length, then slice
  const padded = base36 + "000000";
  return padded.substring(0, length).toLowerCase();
}
