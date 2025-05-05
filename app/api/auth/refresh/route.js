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
