import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const warranties = await prisma.warranty.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(warranties)
  } catch (error) {
    console.error("Error fetching warranties:", error)
    return NextResponse.json(
      { message: "Error fetching warranties" },
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
      "damageDescription",
      "customerSignature"
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

    // Validar y formatear fechas
    const formatDate = (dateString) => {
      if (!dateString) return null;
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          throw new Error("Fecha inválida");
        }
        return date;
      } catch (error) {
        console.error("Error al formatear fecha:", error);
        throw new Error(`Fecha inválida: ${dateString}`);
      }
    };

    // Validar fechas requeridas
    try {
      formatDate(data.purchaseDate);
      formatDate(data.damageDate);
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.message 
        },
        { status: 400 }
      );
    }

    // Verificar conexión a la base de datos
    try {
      await prisma.$connect();
    } catch (error) {
      console.error("Error de conexión a la base de datos:", error);
      return NextResponse.json(
        { 
          success: false,
          message: "Error de conexión a la base de datos",
          error: error.message 
        },
        { status: 500 }
      );
    }

    // Crear la garantía
    const warranty = await prisma.warranty.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        ownerName: data.ownerName || null,
        ownerPhone: data.ownerPhone || null,
        address: data.address,
        brand: data.brand,
        model: data.model,
        serial: data.serial,
        purchaseDate: formatDate(data.purchaseDate),
        invoiceNumber: data.invoiceNumber,
        damagedPart: data.damagedPart,
        damagedPartSerial: data.damagedPartSerial || null,
        damageDate: formatDate(data.damageDate),
        damageDescription: data.damageDescription,
        customerSignature: data.customerSignature,
        warrantyStatus: "pending",
        
        // Campos opcionales del vendedor
        crediMemo: data.crediMemo || null,
        replacementPart: data.replacementPart || null,
        replacementSerial: data.replacementSerial || null,
        sellerSignature: data.sellerSignature || null,
        managementDate: data.managementDate ? formatDate(data.managementDate) : null,
        technicianNotes: data.technicianNotes || null,
        resolutionDate: data.resolutionDate ? formatDate(data.resolutionDate) : null,
      }
    })

    return NextResponse.json(warranty)
  } catch (error) {
    console.error("Error creating warranty:", error)
    return NextResponse.json(
      { 
        success: false,
        message: "Error al crear la garantía",
        error: error.message 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect();
  }
}

