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
  }
}

export async function POST(request) {
  try {
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
  }
}

