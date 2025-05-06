import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export function middleware(request) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  if (pathname === "/" || pathname === "/login" || pathname === "/register" || pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verify token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Route protection based on roles
    if (pathname.startsWith("/seller") && decoded.role !== "seller") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (pathname.startsWith("/customer") && decoded.role !== "customer") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
