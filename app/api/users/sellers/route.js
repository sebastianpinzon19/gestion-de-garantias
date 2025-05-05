import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getSellers } from "@/lib/user-service"

export async function GET(request) {
  try {
    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 })
    }

    // Verificar token
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 })
    }

    // Obtener vendedores
    const sellers = await getSellers()

    return NextResponse.json(sellers)
  } catch (error) {
    console.error("Error al obtener vendedores:", error)
    return NextResponse.json({ success: false, message: "Error al obtener vendedores" }, { status: 500 })
  }
}
