import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Para propósitos de demostración, permitir acceso con credenciales específicas
    if (email === "admin@ejemplo.com" && password === "admin123") {
      const token = jwt.sign({ id: 1, email, role: "admin" }, process.env.JWT_SECRET || "secret-key", {
        expiresIn: "7d",
      })

      const response = NextResponse.json({
        success: true,
        token,
        user: {
          id: 1,
          name: "Administrador",
          email: "admin@ejemplo.com",
          role: "admin",
        },
      })

      // Establecer el token como cookie
      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
        sameSite: "strict",
      })

      return response
    }

    if (email === "vendedor@ejemplo.com" && password === "vendedor123") {
      const token = jwt.sign({ id: 2, email, role: "seller" }, process.env.JWT_SECRET || "secret-key", {
        expiresIn: "7d",
      })

      const response = NextResponse.json({
        success: true,
        token,
        user: {
          id: 2,
          name: "Vendedor Demo",
          email: "vendedor@ejemplo.com",
          role: "seller",
        },
      })

      // Establecer el token como cookie
      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
        sameSite: "strict",
      })

      return response
    }

    // Si las credenciales no coinciden con las predefinidas
    return NextResponse.json({ success: false, message: "Credenciales incorrectas" }, { status: 401 })
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
  }
}

