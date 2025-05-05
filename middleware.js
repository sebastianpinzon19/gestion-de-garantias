<<<<<<< HEAD
import { NextResponse } from 'next/server';
import { verifyToken } from './lib/tokens';

// Rutas que requieren autenticación
const protectedRoutes = ['/admin', '/seller'];

// Rutas públicas que no necesitan autenticación
const publicRoutes = ['/', '/login', '/register', '/warranty-form'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Permitir rutas públicas
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Si no es una ruta protegida, permitir acceso
  if (!protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  // Si no hay token y es una ruta protegida, redirigir a login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verificar el token
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verificar permisos según la ruta
    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/seller') && payload.role !== 'SELLER') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Agregar el usuario al request para uso posterior
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.id);
    requestHeaders.set('x-user-role', payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.redirect(new URL('/login', request.url));
=======
import { NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/", "/login", "/register", "/garantia/nueva"]

// Rutas que requieren rol específico
const adminRoutes = ["/admin"]
const sellerRoutes = ["/vendedor"]
const customerRoutes = ["/cliente"]

export async function middleware(request) {
  // Obtener la ruta de la URL
  const { pathname } = request.nextUrl

  // Permitir rutas públicas
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/api/auth/") ||
    pathname.includes("/_next/") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes("/images/") ||
    pathname.includes("/fonts/")
  ) {
    return NextResponse.next()
  }

  // Verificar token en cookies
  const token = request.cookies.get("token")?.value

  // Si no hay token y se intenta acceder a una ruta protegida, redirigir a login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verificar token
    const { valid, decoded, error } = verifyToken(token)

    if (!valid) {
      // Token inválido, redirigir a login
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("token")
      response.cookies.delete("refreshToken")
      return response
    }

    // Verificar permisos según rol
    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      // Redirigir según rol
      if (decoded.role === "seller") {
        return NextResponse.redirect(new URL("/vendedor", request.url))
      } else {
        return NextResponse.redirect(new URL("/cliente", request.url))
      }
    }

    if (pathname.startsWith("/vendedor") && decoded.role !== "seller") {
      // Redirigir según rol
      if (decoded.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url))
      } else {
        return NextResponse.redirect(new URL("/cliente", request.url))
      }
    }

    if (pathname.startsWith("/cliente") && decoded.role !== "customer") {
      // Redirigir según rol
      if (decoded.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url))
      } else {
        return NextResponse.redirect(new URL("/vendedor", request.url))
      }
    }

    // Permitir acceso
    return NextResponse.next()
  } catch (error) {
    console.error("Error en middleware:", error)

    // Limpiar el token inválido y redirigir a login
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    response.cookies.delete("refreshToken")
    return response
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
  }
}

// Configurar las rutas que deben ser procesadas por el middleware
export const config = {
<<<<<<< HEAD
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

=======
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|fonts).*)"],
}
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
