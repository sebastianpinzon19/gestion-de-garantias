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

    // Crear la garantía en la base de datos
    const warranty = await prisma.warranty.create({
      data: {
        company: data.company,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        contactPerson: data.contactPerson,
        phone: data.phone,
        homeownerName: data.name,
        homeownerPhone: data.homeownerPhone,
        homeownerAddress: data.homeownerAddress,
        homeownerCity: data.homeownerCity,
        homeownerState: data.homeownerState,
        homeownerZip: data.homeownerZip,
        item: data.item,
        model: data.model,
        serialNumber: data.serialNumber,
        brand: data.brand,
        dateInstalled: new Date(data.dateInstalled),
        warrantyReason: data.warrantyReason,
        warrantyStatus: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

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

