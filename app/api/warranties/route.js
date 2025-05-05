import { NextResponse } from "next/server"
<<<<<<< HEAD
import prisma from '@/lib/prisma'
import { sendNewWarrantyNotification } from '@/lib/email'
=======
import { verifyToken } from "@/lib/auth"
import { getAllWarranties, createWarranty } from "@/lib/warranty-service"
import { sendWarrantyNotification } from "@/lib/email-service"
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f

export async function GET(request) {
  try {
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value
    const filters = {}

<<<<<<< HEAD
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
        createdAt: 'desc'
      },
    })
=======
    // Si hay token, verificarlo y aplicar filtros según el rol
    if (token) {
      const decoded = verifyToken(token)
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f

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
<<<<<<< HEAD
    console.log('Iniciando proceso de creación de garantía...');
    const data = await request.json()
    console.log('Datos recibidos:', JSON.stringify(data, null, 2));

    // Crear la garantía en la base de datos
    console.log('Intentando guardar la garantía en la base de datos...');
    const warranty = await prisma.warranty.create({
      data: {
        // ID se genera automáticamente por Prisma (@default(uuid()))
        customerName: data.company, // Mapeado desde form.company
        address: `${data.address}, ${data.city}, ${data.state} ${data.zip}`, // Combinado desde form
        customerPhone: data.phone, // Mapeado desde form.phone
        brand: data.brand, // Mapeado desde form.brand
        model: data.model, // Mapeado desde form.model
        serial: data.serialNumber, // Mapeado desde form.serialNumber
        purchaseDate: new Date(data.dateInstalled), // Mapeado desde form.dateInstalled
        damageDate: new Date(data.dateInstalled), // Usando dateInstalled como damageDate por ahora
        damageDescription: data.warrantyReason, // Mapeado desde form.warrantyReason
        damagedPart: data.item, // Mapeado desde form.item
        ownerName: data.name, // Mapeado desde form.name (homeowner name)
        ownerPhone: data.homeownerPhone, // Mapeado desde form.homeownerPhone
        // Campos del schema no presentes en el formulario actual:
        customerSignature: '', // No está en el formulario page.jsx
        damagedPartSerial: null, // No está en el formulario page.jsx
        invoiceNumber: 'N/A', // No está en el formulario page.jsx, usando default
        replacementPart: null, // No está en el formulario page.jsx
        replacementSerial: null, // No está en el formulario page.jsx
        sellerSignature: null, // No está en el formulario page.jsx
        technicianNotes: null, // No está en el formulario page.jsx
        crediMemo: null, // No está en el formulario page.jsx
        managementDate: null, // No aplicable en la creación
        resolutionDate: null, // No aplicable en la creación
        warrantyStatus: 'pending', // Estado inicial por defecto
        // createdAt es manejado por @default(now())
        // updatedAt es manejado por @updatedAt
      }
    })
    console.log('Garantía guardada exitosamente:', JSON.stringify(warranty, null, 2));

    // Enviar notificación a los administradores
    console.log('Enviando notificación a los administradores...');
    await sendNewWarrantyNotification({ warrantyData: warranty })
    console.log('Notificación enviada exitosamente');

    return NextResponse.json({
      success: true,
      message: "Warranty request created successfully",
      warranty
    }, { status: 201 })
  } catch (error) {
    console.error('Error processing warranty request:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Error processing warranty request',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
=======
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
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
  }
}
