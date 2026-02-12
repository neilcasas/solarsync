import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "default-secret-change-me-in-production"
);

const PUBLIC_PATHS = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and API routes
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    const role = payload.role as string;

    // HR routes require hr or admin role
    if (pathname.startsWith("/hr") && role !== "hr" && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Employee routes require employee role
    if (!pathname.startsWith("/hr") && (role === "hr" || role === "admin")) {
      return NextResponse.redirect(new URL("/hr", request.url));
    }

    return NextResponse.next();
  } catch {
    // Invalid token — clear it and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
