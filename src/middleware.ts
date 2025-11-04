import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for geo-location detection and regional optimization
 * Runs on Vercel Edge Network for optimal performance
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get geo information from Vercel (available on Vercel deployments)
  const country = request.geo?.country || "Unknown";
  const region = request.geo?.region || "Unknown";
  const city = request.geo?.city || "Unknown";

  // Add geo information to response headers for analytics/debugging
  response.headers.set("x-geo-country", country);
  response.headers.set("x-geo-region", region);
  response.headers.set("x-geo-city", city);

  // Set cookie for geo preference (can be used by components)
  if (country !== "Unknown") {
    response.cookies.set("user-country", country, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
    });
  }

  // Optional: Add regional hints for search engines
  const locale = getLocaleFromCountry(country);
  response.headers.set("content-language", locale);

  return response;
}

/**
 * Map country code to locale
 */
function getLocaleFromCountry(country: string): string {
  const countryToLocale: Record<string, string> = {
    US: "en-US",
    CA: "en-CA",
    GB: "en-GB",
    AU: "en-AU",
    NZ: "en-NZ",
    IN: "en-IN",
    SG: "en-SG",
    IE: "en-IE",
    ZA: "en-ZA",
  };

  return countryToLocale[country] || "en";
}

// Configure which routes should run through middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

