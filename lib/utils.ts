import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base domain URL from environment variables
 * @returns The base URL (e.g., "https://example.com" or "http://localhost:3000")
 */
export function getBaseUrl(): string {
  const sanitize = (url: string) => url.replace(/\/+$/, "");

  // Client-side: prefer NEXT_PUBLIC_BASE_URL, fall back to window origin
  if (typeof window !== "undefined") {
    const base = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    return joinUrl(sanitize(base), "artist");
  }

  // Server-side: prefer NEXT_PUBLIC_BASE_URL, then BASE_URL, then VERCEL_URL, then localhost
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return joinUrl(sanitize(base), "artist");
}

/**
 * Join URL parts, handling trailing/leading slashes properly
 * @param baseUrl - The base URL (may or may not have trailing slash)
 * @param paths - Path segments to join
 * @returns Properly joined URL without double slashes
 * @example
 * joinUrl("http://example.com/", "path") // "http://example.com/path"
 * joinUrl("http://example.com", "path") // "http://example.com/path"
 * joinUrl("http://example.com/", "/path") // "http://example.com/path"
 */
export function joinUrl(baseUrl: string, ...paths: string[]): string {
  // Remove trailing slashes from base URL
  const base = baseUrl.replace(/\/+$/, "");
  
  // Join all paths, removing leading/trailing slashes and filtering empty strings
  const cleanPaths = paths
    .filter(Boolean)
    .map(path => path.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean);
  
  // Join base with paths
  return cleanPaths.length > 0 ? `${base}/${cleanPaths.join("/")}` : base;
}

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
