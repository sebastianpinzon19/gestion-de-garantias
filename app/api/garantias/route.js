import { NextResponse } from "next/server"
import { getAllWarranties, createWarranty } from "@/lib/warranty-service"
import { verifyToken } from "@/lib/auth"

export async function GET(request) {
  try {
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const createdBy = searchParams.get("createdBy")
    const assignedTo = searchParams.get("assignedTo")

    // Construir filtros
    const filters = {}
    if (status) filters.status = status
    if (search) filters.search = search
    if (createdBy) filters.createdBy = createdBy
    if (assignedTo) filters.assignedTo = assignedTo

    // Obtener garantías
    const result = await getAllWarranties(filters)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json(result.warranties)
  } catch (error) {
    console.error("Error al obtener garantías:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value

    // Verificar token
    let userId = null
    if (token) {
      const { valid, decoded } = verifyToken(token)
      if (valid) {
        userId = decoded.userId
      }
    }

    // Obtener datos de la garantía
    const warrantyData = await request.json()

    // Crear garantía
    const result = await createWarranty(warrantyData, userId)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, warranty: result.warranty }, { status: 201 })
  } catch (error) {
    console.error("Error al crear garantía:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
  }
}
