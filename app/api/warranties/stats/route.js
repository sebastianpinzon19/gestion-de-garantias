import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getWarrantyStats } from "@/lib/warranty-service"

export async function GET(request) {
  try {
    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 })
    }

    // Verificar token
    const decoded = verifyToken(token)

    if (!decoded || (decoded.role !== "admin" && decoded.role !== "seller")) {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 })
    }

    // Obtener estadísticas
    const stats = await getWarrantyStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json({ success: false, message: "Error al obtener estadísticas" }, { status: 500 })
  }
}
