import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/onboarding", "/connect", "/init"];

// Routes only for unauthenticated users
const AUTH_ONLY_ROUTES = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("sp_access_token")?.value
    || request.headers.get("authorization")?.replace("Bearer ", "");

  // Check for localStorage token via a special cookie set on client
  // (We rely on a client-side guard for localStorage, middleware handles cookies)

  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
  const isAuthOnly = AUTH_ONLY_ROUTES.some(r => pathname.startsWith(r));

  // If accessing protected route without token, redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/connect/:path*",
    "/init/:path*",
    "/login",
  ],
};
