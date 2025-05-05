import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getWarrantyById, updateWarranty } from "@/lib/warranty-service"
import { sendStatusUpdateNotification } from "@/lib/email-service"
import { sql } from "@/lib/db"

export async function GET(request, { params }) {
  try {
    const { id } = params

    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value

    // Verificar permisos si hay token
    if (token) {
      const decoded = verifyToken(token)

      if (decoded) {
        // Obtener garantía
        const warranty = await getWarrantyById(id)

        if (!warranty) {
          return NextResponse.json({ success: false, message: "Garantía no encontrada" }, { status: 404 })
        }

        // Verificar permisos según rol
        if (decoded.role === "customer" && warranty.created_by !== decoded.id) {
          return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 })
        }

        if (decoded.role === "seller" && warranty.assigned_to !== decoded.id) {
          return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 })
        }

        return NextResponse.json(warranty)
      }
    }

    // Si no hay token o es inválido, solo permitir ver garantías públicas
    const warranty = await getWarrantyById(id)

    if (!warranty) {
      return NextResponse.json({ success: false, message: "Garantía no encontrada" }, { status: 404 })
    }

    // Filtrar información sensible para usuarios no autenticados
    const publicWarranty = {
      id: warranty.id,
      status: warranty.status,
      brand: warranty.brand,
      model: warranty.model,
      created_at: warranty.created_at,
    }

    return NextResponse.json(publicWarranty)
  } catch (error) {
    console.error(`Error al obtener garantía ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Error al obtener garantía" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params

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

    // Obtener datos de la garantía
    const warrantyData = await request.json()

    // Obtener garantía actual para comparar cambios
    const currentWarranty = await getWarrantyById(id)

    if (!currentWarranty) {
      return NextResponse.json({ success: false, message: "Garantía no encontrada" }, { status: 404 })
    }

    // Verificar permisos según rol
    if (decoded.role === "customer" && currentWarranty.created_by !== decoded.id) {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 })
    }

    if (decoded.role === "seller") {
      // Los vendedores solo pueden actualizar garantías asignadas a ellos
      if (currentWarranty.assigned_to !== decoded.id) {
        return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 })
      }

      // Los vendedores solo pueden actualizar ciertos campos
      const allowedFields = [
        "status",
        "technicianObservations",
        "replacementPart",
        "replacementPartSerial",
        "sellerSignature",
        "managementDate",
        "resolutionDate",
      ]

      // Filtrar campos no permitidos
      Object.keys(warrantyData).forEach((key) => {
        if (!allowedFields.includes(key)) {
          delete warrantyData[key]
        }
      })
    }

    // Actualizar garantía
    const updatedWarranty = await updateWarranty(id, warrantyData, decoded.id)

    if (!updatedWarranty) {
      return NextResponse.json({ success: false, message: "Error al actualizar garantía" }, { status: 500 })
    }

    // Si cambió el estado, enviar notificación por correo
    if (warrantyData.status && warrantyData.status !== currentWarranty.status && currentWarranty.customer_email) {
      await sendStatusUpdateNotification(updatedWarranty, currentWarranty.customer_email)
    }

    return NextResponse.json({
      success: true,
      message: "Garantía actualizada correctamente",
      warranty: updatedWarranty,
    })
  } catch (error) {
    console.error(`Error al actualizar garantía ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Error al actualizar garantía" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
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

    // Eliminar garantía
    await sql`DELETE FROM warranties WHERE id = ${id}`

    return NextResponse.json({
      success: true,
      message: "Garantía eliminada correctamente",
    })
  } catch (error) {
    console.error(`Error al eliminar garantía ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Error al eliminar garantía" }, { status: 500 })
  }
}
