<<<<<<< HEAD
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendNewWarrantyNotification } from '@/lib/email';

export async function GET(request) {
  try {
    const warranties = await prisma.warranty.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(warranties);
  } catch (error) {
    console.error('Error getting warranties:', error);
    return NextResponse.json(
      { error: 'Error getting warranties' },
      { status: 500 }
    );
=======
import { NextResponse } from "next/server"
import { getAllWarranties, createWarranty } from "@/lib/warranty-service"
import { verifyToken } from "@/lib/auth"

export async function GET(request) {
  try {
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const createdBy = searchParams.get("createdBy")
    const assignedTo = searchParams.get("assignedTo")

    // Construir filtros
    const filters = {}
    if (status) filters.status = status
    if (search) filters.search = search
    if (createdBy) filters.createdBy = createdBy
    if (assignedTo) filters.assignedTo = assignedTo

    // Obtener garantías
    const result = await getAllWarranties(filters)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json(result.warranties)
  } catch (error) {
    console.error("Error al obtener garantías:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
  }
}

export async function POST(request) {
  try {
<<<<<<< HEAD
    const data = await request.json();
    
    // Validar campos requeridos
    const requiredFields = [
      'customerName',
      'address',
      'customerPhone',
      'customerSignature',
      'damageDate',
      'damageDescription',
      'damagedPart',
      'invoiceNumber',
      'model',
      'purchaseDate',
      'serial'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Crear la garantía en la base de datos
    console.log('Attempting to create warranty with data:', JSON.stringify(data, null, 2)); // Log data before creation
    const warrantyDataToSave = {
      ...data,
      warrantyStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log('Data prepared for Prisma:', JSON.stringify(warrantyDataToSave, null, 2));

    const warranty = await prisma.warranty.create({
      data: warrantyDataToSave,
    });

    console.log('Warranty created successfully in DB:', warranty.id); // Log success after creation

    // Enviar notificación a los administradores
    console.log('Attempting to send notification for warranty:', warranty.id);
    await sendNewWarrantyNotification({ warrantyData: warranty });

    return NextResponse.json({
      success: true,
      warranty
    });
  } catch (error) {
    console.error('Error creating warranty:', error);
    console.error('Error details:', JSON.stringify(error, null, 2)); // Log detailed error
    return NextResponse.json(
      { error: 'Error creating warranty' },
      { status: 500 }
    );
=======
    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value

    // Verificar token
    let userId = null
    if (token) {
      const { valid, decoded } = verifyToken(token)
      if (valid) {
        userId = decoded.userId
      }
    }

    // Obtener datos de la garantía
    const warrantyData = await request.json()

    // Crear garantía
    const result = await createWarranty(warrantyData, userId)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, warranty: result.warranty }, { status: 201 })
  } catch (error) {
    console.error("Error al crear garantía:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
  }
}
