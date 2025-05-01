import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";



const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "No autorizado - Token no proporcionado" },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded || decoded.role !== 'seller') {
        return NextResponse.json(
          { error: "Acceso no autorizado - Se requiere rol de vendedor" },
          { status: 401 }
        );
      }

      // Obtener todas las garantías del vendedor
      const warranties = await prisma.warranty.findMany({
        where: {
          sellerId: decoded.userId
        },
        include: {
          customer: true,
          product: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Transformar los datos para la respuesta
      const formattedWarranties = warranties.map(warranty => ({
        id: warranty.id,
        customerName: `${warranty.customer.firstName} ${warranty.customer.lastName}`,
        productName: warranty.product.name,
        status: warranty.status,
        createdAt: warranty.createdAt,
        description: warranty.description
      }));

      return NextResponse.json(formattedWarranties);
    } catch (jwtError) {
      console.error("Error al verificar el token:", jwtError);
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error al obtener las garantías:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 