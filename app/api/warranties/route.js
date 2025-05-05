"use server"

import { NextResponse } from "next/server"
import prisma from '@/lib/prisma'
import { sendNewWarrantyNotification } from '@/lib/email'

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
        createdAt: 'desc'
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
  }
}

