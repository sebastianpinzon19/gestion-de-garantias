import { NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"
import { sendWelcomeEmail } from "@/lib/email-service"
import { verifyToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const userData = await request.json()
    const { name, email, password, role } = userData

    // Validar datos requeridos
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Nombre, correo y contraseña son requeridos" },
        { status: 400 },
      )
    }

    // Si se intenta crear un usuario admin o seller, verificar que quien lo crea sea admin
    if (role === "admin" || role === "seller") {
      const token = request.cookies.get("token")?.value

      if (!token) {
        return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 })
      }

      const decoded = verifyToken(token)

      if (!decoded || decoded.role !== "admin") {
        return NextResponse.json(
          { success: false, message: "No autorizado para crear este tipo de usuario" },
          { status: 403 },
        )
      }
    }

    // Registrar usuario
    const result = await registerUser(userData)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    // Enviar correo de bienvenida
    await sendWelcomeEmail(result.user)

    return NextResponse.json({
      success: true,
      message: "Usuario registrado correctamente",
      user: result.user,
    })
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
  }
}
