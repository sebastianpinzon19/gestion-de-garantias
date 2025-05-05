import { NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

// Rutas que requieren autenticación
const protectedRoutes = ["/dashboard", "/admin"]

// Rutas que requieren roles específicos
const roleRoutes = {
  "/admin": ["admin"],
  "/dashboard": ["admin", "seller"],
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Verificar si la ruta está protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Obtener token de la cookie
  const token = request.cookies.get("token")?.value

  // Si no hay token, redirigir al login
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Verificar token
  const { valid, decoded } = verifyToken(token)

  // Si el token no es válido, redirigir al login
  if (!valid) {
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Verificar roles para rutas específicas
  for (const [route, roles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route) && !roles.includes(decoded.role)) {
      // Si el usuario no tiene el rol requerido, redirigir a la página principal
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
