import { NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validar datos requeridos
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Correo y contraseña son requeridos" }, { status: 400 })
    }

    // Autenticar usuario
    const result = await authenticateUser(email, password)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 401 })
    }

    // Crear respuesta con cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    })

    // Establecer cookie con el token JWT
    response.cookies.set({
      name: "token",
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 día
      path: "/",
    })

    // Establecer cookie con el refresh token
    response.cookies.set({
      name: "refreshToken",
      value: result.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error en inicio de sesión:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
  }
}
