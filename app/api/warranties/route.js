import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getAllWarranties, createWarranty } from "@/lib/warranty-service"
import { sendWarrantyNotification } from "@/lib/email-service"

export async function GET(request) {
  try {
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value
    const filters = {}

    // Si hay token, verificarlo y aplicar filtros según el rol
    if (token) {
      const decoded = verifyToken(token)

      if (decoded) {
        if (decoded.role === "customer") {
          // Los clientes solo ven sus propias garantías
          filters.customerId = decoded.id
        } else if (decoded.role === "seller") {
          // Los vendedores ven las garantías asignadas a ellos
          filters.sellerId = decoded.id
        }
        // Los administradores ven todas las garantías
      }
    }

    // Aplicar filtros adicionales
    if (status && status !== "all") {
      filters.status = status
    }
    if (search) {
      filters.search = search
    }

    // Obtener garantías
    const warranties = await getAllWarranties(filters)

    return NextResponse.json(warranties)
  } catch (error) {
    console.error("Error al obtener garantías:", error)
    return NextResponse.json({ success: false, message: "Error al obtener garantías" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value
    let userId = null

    // Si hay token, verificarlo y obtener el ID del usuario
    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        userId = decoded.id
      }
    }

    // Obtener datos de la garantía
    const warrantyData = await request.json()

    // Validar datos requeridos
    const requiredFields = [
      "customerName",
      "customerPhone",
      "address",
      "brand",
      "model",
      "serial",
      "purchaseDate",
      "invoiceNumber",
      "damagedPart",
      "damageDate",
      "damageDescription",
      "customerSignature",
    ]

    const missingFields = requiredFields.filter((field) => !warrantyData[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Faltan campos requeridos",
          fields: missingFields,
        },
        { status: 400 },
      )
    }

    // Crear garantía
    const warranty = await createWarranty(warrantyData, userId)

    // Enviar notificación por correo
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
    if (adminEmails.length > 0) {
      await sendWarrantyNotification(warranty, adminEmails)
    }

    return NextResponse.json({
      success: true,
      message: "Garantía creada correctamente",
      warranty,
    })
  } catch (error) {
    console.error("Error al crear garantía:", error)
    return NextResponse.json({ success: false, message: "Error al crear garantía" }, { status: 500 })
  }
}
