import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { sendSellerAssignmentNotification } from "@/lib/email-service"

export async function POST(request, { params }) {
  try {
    const { id } = params
    const { sellerId } = await request.json()

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
    }

    return NextResponse.json({
      success: true,
      message: "Warranty assigned successfully",
      warranty: updatedWarranty,
    })
  } catch (error) {
    console.error("Error assigning warranty:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error assigning warranty",
      },
      { status: 500 },
    )
  }
}

