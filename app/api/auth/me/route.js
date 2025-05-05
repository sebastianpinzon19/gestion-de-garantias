import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getUserById } from "@/lib/user-service"

export async function GET(request) {
  try {
    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 })
    }

    // Verificar token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Token inválido" }, { status: 401 })
    }

    // Obtener datos del usuario
    const user = await getUserById(decoded.id)

    if (!user) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phone_number,
      },
    })
  } catch (error) {
    console.error("Error al verificar autenticación:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
  }
}
