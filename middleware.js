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
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

