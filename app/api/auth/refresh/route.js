<<<<<<< HEAD
import { NextResponse } from "next/server";
import { verifyRefreshToken, generateTokens } from "@/lib/tokens";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    console.log('[REFRESH] Refresh token found:', !!refreshToken);

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      );
    }

    const decoded = await verifyRefreshToken(refreshToken);
    console.log('[REFRESH] Token decoded:', !!decoded);
    
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true
      }
    });

    console.log('[REFRESH] User found:', !!user);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    // Verificar si el token actual es válido antes de generar uno nuevo
    const currentToken = request.cookies.get('token')?.value;
    if (currentToken) {
      try {
        const decodedCurrent = await verifyRefreshToken(currentToken);
        if (decodedCurrent && decodedCurrent.id === user.id) {
          // El token actual es válido, no necesitamos generar uno nuevo
          console.log('[REFRESH] Current token is still valid, skipping refresh');
          return NextResponse.json({
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
              name: user.name
            }
          });
        }
      } catch (error) {
        // Si hay error al verificar el token actual, continuamos con el refresh
        console.log('[REFRESH] Current token invalid, proceeding with refresh');
      }
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);
    
    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });

    // Set cookies with proper configuration
    response.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 // 15 minutes
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    console.log('[REFRESH] Tokens refreshed successfully');
    return response;

  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
=======
import { NextResponse } from "next/server"
import { refreshAccessToken } from "@/lib/auth"

export async function POST(request) {
  try {
    // Obtener refresh token de la cookie
    const refreshToken = request.cookies.get("refreshToken")?.value

    if (!refreshToken) {
      return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 })
    }

    // Refrescar token
    const result = await refreshAccessToken(refreshToken)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 401 })
    }

    // Crear respuesta con nuevo token
    const response = NextResponse.json({
      success: true,
      message: "Token refrescado correctamente",
    })

    // Establecer cookie con el nuevo token JWT
    response.cookies.set({
      name: "token",
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 día
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error al refrescar token:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
  }
}
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
