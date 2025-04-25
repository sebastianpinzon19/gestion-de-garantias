import { NextResponse } from "next/server"

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    "/",
    "/login",
    "/auth/login",
    "/auth/register",
    "/garantia/nueva",
    "/garantia/solicitar",
    "/garantia/form",
    "/garantia/cliente",
    "/warranty/new",
    "/warranty/request",
    "/warranty-form",
    "/warranty"
  ]

  // Rutas de API que no requieren autenticación
  const publicApiRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/warranties",
    "/api/public"
  ]

  // Verificar si es una ruta pública o recurso estático
  if (
    publicRoutes.includes(pathname) ||
    publicApiRoutes.some(route => pathname.startsWith(route)) ||
    pathname.startsWith("/garantia/") ||
    pathname.startsWith("/warranty/") ||
    pathname.includes("/_next/") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes("/images/") ||
    pathname.includes("/api/auth/")
  ) {
    return NextResponse.next()
  }

  // Para todas las demás rutas, redirigir a login
  return NextResponse.redirect(new URL("/login", request.url))
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|public|api/public|warranty|garantia).*)",
  ],
}

