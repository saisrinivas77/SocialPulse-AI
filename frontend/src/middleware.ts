import { NextRequest, NextResponse } from "next/server";

// Next.js middleware for SocialPulse AI
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("sp_access_token")?.value
    || request.headers.get("authorization")?.replace("Bearer ", "");

  // If a cookie token is explicitly invalidated or absent during server render,
  // we allow client hydration so localStorage auth guards can verify tokens.
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
