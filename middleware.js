import { NextResponse } from "next/server"

export async function middleware(request) {
  // Obtener la ruta de la URL
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/", "/login", "/garantia/nueva"]

  // Permitir rutas de API y rutas públicas
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/api/") ||
    pathname.includes("/_next/") ||
    pathname.includes("/favicon.ico")
  ) {
    return NextResponse.next()
  }

  // Verificar token en cookies o localStorage
  const token = request.cookies.get("token")?.value

  // Si no hay token y se intenta acceder a una ruta protegida, redirigir a login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Para esta demo, en lugar de verificar el token con JWT,
    // simplemente verificamos si es uno de nuestros tokens de demostración
    if (token === "demo-token-admin") {
      // Si es una ruta de dashboard y el usuario es admin, permitir
      return NextResponse.next()
    } else if (token === "demo-token-seller") {
      // Si es una ruta de admin y el usuario es vendedor, redirigir a dashboard
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      // Si es una ruta de dashboard y el usuario es vendedor, permitir
      return NextResponse.next()
    } else {
      // Token no reconocido, redirigir a login
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("token")
      return response
    }
  } catch (error) {
    console.error("Error en middleware:", error)

    // Limpiar el token inválido y redirigir a login
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    return response
  }
}

// Actualizar el matcher para excluir más archivos estáticos e incluir solo las rutas que queremos proteger
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|public|api/auth/login).*)"],
}

