"use server"

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

    // Aquí puedes agregar la lógica para guardar en tu base de datos
    // Por ahora solo retornamos una respuesta exitosa
    console.log('Warranty data received:', data)

    return NextResponse.json(
      { message: 'Warranty request created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing warranty request:', error)
    return NextResponse.json(
      { message: 'Error processing warranty request' },
      { status: 500 }
    )
  }
}

