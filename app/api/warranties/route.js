import { NextResponse } from "next/server"
import { sendAdminNotification } from "@/lib/email-service"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // Mock data for warranties
    let warranties = [
      {
        id: 1001,
        customer_name: "Juan Pérez",
        brand: "FrostCool",
        model: "XYZ-123",
        serial: "RF123456789",
        created_at: "2023-05-15",
        status: "pending",
        credi_memo: "",
        assigned_to: null,
      },
      {
        id: 1002,
        customer_name: "María González",
        brand: "WashMaster",
        model: "ABC-456",
        serial: "LV987654321",
        created_at: "2023-05-10",
        status: "approved",
        credi_memo: "CM-002",
        assigned_to: 2,
      },
      {
        id: 1003,
        customer_name: "Carlos Rodríguez",
        brand: "ViewTech",
        model: "DEF-789",
        serial: "TV567891234",
        created_at: "2023-05-05",
        status: "rejected",
        credi_memo: "CM-003",
        assigned_to: 2,
      },
      {
        id: 1004,
        customer_name: "Ana Martínez",
        brand: "HomeHeat",
        model: "GHI-012",
        serial: "ES432109876",
        created_at: "2023-05-01",
        status: "pending",
        credi_memo: "CM-004",
        assigned_to: null,
      },
      {
        id: 1005,
        customer_name: "Pedro Sánchez",
        brand: "KitchenPro",
        model: "JKL-345",
        serial: "MW345678912",
        created_at: "2023-04-28",
        status: "approved",
        credi_memo: "CM-005",
        assigned_to: 3,
      },
    ]

    // Filter by status if provided
    if (status && status !== "all") {
      warranties = warranties.filter((w) => w.status === status)
    }

    return NextResponse.json(warranties)
  } catch (error) {
    console.error("Error fetching warranties:", error)
    return NextResponse.json([])
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    // En una implementación real, esto guardaría en la base de datos
    // y generaría un ID único
    const newWarranty = {
      id: Math.floor(1000 + Math.random() * 9000), // Random ID for demo
      ...data,
      created_at: new Date().toISOString().split("T")[0],
      status: "pending",
      assigned_to: null,
    }

    // Enviar notificación por correo a los administradores
    await sendAdminNotification(newWarranty)

    return NextResponse.json({
      success: true,
      message: "Garantía creada correctamente",
      warranty: newWarranty,
    })
  } catch (error) {
    console.error("Error creating warranty:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al crear la garantía",
      },
      { status: 500 },
    )
  }
}

