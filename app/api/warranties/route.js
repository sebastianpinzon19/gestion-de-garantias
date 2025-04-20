import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const whereClause = status && status !== 'all' ? { status } : {}

    const warranties = await prisma.warranty.findMany({
      where: whereClause,
      include: {
        assigned_to: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc'
      },
    })

    return NextResponse.json({
      success: true,
      warranties: warranties || [],
    })
  } catch (error) {
    console.error('Error en GET /api/warranties:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener las garantías',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    
    // Validar campos requeridos
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
      "damageDescription"
    ]

    const missingFields = requiredFields.filter(field => !data[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Campos requeridos faltantes: ${missingFields.join(", ")}` 
        },
        { status: 400 }
      )
    }

    // Crear la garantía
    const warranty = await prisma.warranty.create({
      data: {
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        owner_name: data.ownerName || null,
        owner_phone: data.ownerPhone || null,
        address: data.address,
        brand: data.brand,
        model: data.model,
        serial: data.serial,
        purchase_date: new Date(data.purchaseDate),
        invoice_number: data.invoiceNumber,
        damaged_part: data.damagedPart,
        damaged_part_serial: data.damagedPartSerial || null,
        damage_date: new Date(data.damageDate),
        damage_description: data.damageDescription,
        status: "pending"
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: "Garantía creada exitosamente",
      warranty 
    })
  } catch (error) {
    console.error("Error al crear garantía:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Error al crear la garantía",
        error: error.message 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

