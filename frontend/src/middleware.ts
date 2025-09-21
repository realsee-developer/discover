import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const jwt = request.cookies.get("jwt")?.value;
  if (!jwt && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = new URL("/ (auth)/signin".replace(" (auth)", ""), request.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};


