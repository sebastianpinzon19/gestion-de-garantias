import { NextResponse } from "next/server"
import { getWarrantyById, updateWarranty } from "@/lib/warranty-service"
import { verifyToken } from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const { id } = params

    // Obtener garantía
    const result = await getWarrantyById(id)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 404 })
    }

    return NextResponse.json(result.warranty)
  } catch (error) {
    console.error(`Error al obtener garantía ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params

    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value

    // Verificar token
    let userId = null
    if (token) {
      const { valid, decoded } = verifyToken(token)
      if (valid) {
        userId = decoded.userId
      } else {
        return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 })
      }
    } else {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 })
    }

    // Obtener datos de la garantía
    const warrantyData = await request.json()

    // Actualizar garantía
    const result = await updateWarranty(id, warrantyData, userId)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, warranty: result.warranty })
  } catch (error) {
    console.error(`Error al actualizar garantía ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
  }
}
