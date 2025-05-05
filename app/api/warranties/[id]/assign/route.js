import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { assignWarranty } from "@/lib/warranty-service"

export async function POST(request, { params }) {
  try {
    const { id } = params

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

    // Obtener ID del vendedor
    const { sellerId } = await request.json()

    if (!sellerId) {
      return NextResponse.json({ success: false, message: "ID del vendedor requerido" }, { status: 400 })
    }

    // Asignar garantía
    const warranty = await assignWarranty(id, sellerId, decoded.id)

    if (!warranty) {
      return NextResponse.json({ success: false, message: "Garantía no encontrada" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Garantía asignada correctamente",
      warranty,
    })
  } catch (error) {
    console.error(`Error al asignar garantía ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Error al asignar garantía" }, { status: 500 })
  }
}
