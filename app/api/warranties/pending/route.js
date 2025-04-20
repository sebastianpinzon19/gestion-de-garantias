import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const warranties = await prisma.warranty.findMany({
      where: {
        status: "pending",
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return NextResponse.json(warranties)
  } catch (error) {
    console.error("Error fetching pending warranties:", error)
    return NextResponse.json(
      { message: "Error fetching pending warranties" },
      { status: 500 }
    )
  }
}

