import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [total, pending, completed] = await Promise.all([
      prisma.warranty.count(),
      prisma.warranty.count({
        where: {
          warrantyStatus: "pending"
        }
      }),
      prisma.warranty.count({
        where: {
          warrantyStatus: "completed"
        }
      })
    ])

    const recentWarranties = await prisma.warranty.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        customerName: true,
        brand: true,
        model: true,
        serial: true,
        warrantyStatus: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        total,
        pending,
        completed,
        recentWarranties
      }
    })
  } catch (error) {
    console.error('Error fetching warranty stats:', error.stack); // Log stack trace
    return NextResponse.json(
      { success: false, message: "Error al obtener las estadísticas" },
      { status: 500 }
    )
  }
}

