import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const { id } = params

    const warranty = await prisma.warranty.findUnique({
      where: {
        id: parseInt(id),
      },
    })

    if (!warranty) {
      return NextResponse.json(
        { message: "Warranty not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(warranty)
  } catch (error) {
    console.error("Error fetching warranty:", error)
    return NextResponse.json(
      { message: "Error fetching warranty" },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    const warranty = await prisma.warranty.update({
      where: {
        id: parseInt(id),
      },
      data: {
        crediMemo: data.crediMemo,
        replacementPart: data.replacementPart,
        replacementSerial: data.replacementSerial,
        sellerSignature: data.sellerSignature,
        managementDate: data.managementDate ? new Date(data.managementDate) : null,
        warrantyStatus: data.warrantyStatus,
        technicianNotes: data.technicianNotes,
        resolutionDate: data.resolutionDate ? new Date(data.resolutionDate) : null,
        updatedBy: data.updatedBy,
      },
    })

    return NextResponse.json(warranty)
  } catch (error) {
    console.error("Error updating warranty:", error)
    return NextResponse.json(
      { message: "Error updating warranty" },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await prisma.warranty.delete({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({ message: "Warranty deleted successfully" })
  } catch (error) {
    console.error("Error deleting warranty:", error)
    return NextResponse.json(
      { message: "Error deleting warranty" },
      { status: 500 }
    )
  }
}

