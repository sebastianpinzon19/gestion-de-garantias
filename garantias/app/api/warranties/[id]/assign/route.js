import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import { sendSellerAssignmentNotification } from "@/lib/email-service"

export async function POST(request, { params }) {
  try {
    const { id } = params
    const { sellerId } = await request.json()

    // Verificar si la garantía existe
    const existingWarranty = await sql`
      SELECT * FROM warranties WHERE id = ${id}
    `

    if (existingWarranty.length === 0) {
      return NextResponse.json({ success: false, message: "Garantía no encontrada" }, { status: 404 })
    }

    // Verificar si el vendedor existe
    const seller = await sql`
      SELECT * FROM users WHERE id = ${sellerId} AND role = 'seller'
    `

    if (seller.length === 0) {
      return NextResponse.json({ success: false, message: "Vendedor no encontrado" }, { status: 404 })
    }

    // Actualizar la garantía con el vendedor asignado
    const updatedWarranty = await sql`
      UPDATE warranties 
      SET assigned_to = ${sellerId}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    // Enviar notificación por correo al vendedor
    await sendSellerAssignmentNotification(updatedWarranty[0], seller[0])

    return NextResponse.json({
      success: true,
      message: "Garantía asignada correctamente",
      warranty: updatedWarranty[0],
    })
  } catch (error) {
    console.error("Error assigning warranty:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al asignar la garantía",
      },
      { status: 500 },
    )
  }
}

