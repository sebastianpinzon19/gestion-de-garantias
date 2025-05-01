import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// GET: Obtener todas las garantías
export async function GET(request) {
  try {
    // Verificar el token de autenticación
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Obtener todas las garantías
    const warranties = await prisma.warranty.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(warranties);
  } catch (error) {
    console.error("[WARRANTIES] Error fetching warranties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Crear una nueva garantía
export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const data = await request.json();
    
    const warranty = await prisma.warranty.create({
      data: {
        ...data,
        id: data.id || uuidv4(),
        warrantyStatus: data.warrantyStatus || "pending",
        updatedAt: new Date()
      }
    });

    return NextResponse.json(warranty);
  } catch (error) {
    console.error("[WARRANTIES] Error creating warranty:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 