<<<<<<< HEAD
import { db } from "@/lib/db"
=======
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
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

<<<<<<< HEAD
    // Verificar si la garantía existe
    const existingWarranty = await db.warranty.findUnique({
      where: { id }
    })

    if (!existingWarranty) {
      return NextResponse.json({ success: false, message: "Warranty not found" }, { status: 404 })
    }

    // Check if seller exists
    const seller = await db.user.findFirst({
      where: {
        id: sellerId,
        role: 'SELLER'
      }
    })

    if (!seller) {
      return NextResponse.json({ success: false, message: "Seller not found" }, { status: 404 })
    }

    // Update warranty with assigned seller
    const updatedWarranty = await db.warranty.update({
      where: { id },
      data: {
        assignedTo: sellerId,
        updatedAt: new Date()
      }
    })

    try {
      // Send email notification to seller
      await sendSellerAssignmentNotification(updatedWarranty, seller)
    } catch (emailError) {
      console.error("Error sending email to seller:", emailError)
      return NextResponse.json(
        { success: false, message: "Warranty assigned, but email notification failed" },
        { status: 500 }
      )
=======
    if (!sellerId) {
      return NextResponse.json({ success: false, message: "ID del vendedor requerido" }, { status: 400 })
    }

    // Asignar garantía
    const warranty = await assignWarranty(id, sellerId, decoded.id)

    if (!warranty) {
      return NextResponse.json({ success: false, message: "Garantía no encontrada" }, { status: 404 })
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
    }

    return NextResponse.json({
      success: true,
<<<<<<< HEAD
      message: "Warranty assigned successfully",
      warranty: updatedWarranty,
=======
      message: "Garantía asignada correctamente",
      warranty,
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
    })
  } catch (error) {
    console.error(`Error al asignar garantía ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Error al asignar garantía" }, { status: 500 })
  }
}
