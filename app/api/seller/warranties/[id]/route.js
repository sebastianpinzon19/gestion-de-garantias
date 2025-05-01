import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
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

      // Obtener los detalles de la garantía
      const warranty = await prisma.warranty.findUnique({
        where: {
          id: params.id,
          sellerId: decoded.userId
        },
        include: {
          customer: true,
          product: true,
          updates: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });

      if (!warranty) {
        return NextResponse.json(
          { error: "Garantía no encontrada" },
          { status: 404 }
        );
      }

      // Transformar los datos para la respuesta
      const formattedWarranty = {
        id: warranty.id,
        customerName: `${warranty.customer.firstName} ${warranty.customer.lastName}`,
        customerEmail: warranty.customer.email,
        customerPhone: warranty.customer.phone,
        productName: warranty.product.name,
        productSerial: warranty.product.serialNumber,
        status: warranty.status,
        createdAt: warranty.createdAt,
        purchaseDate: warranty.purchaseDate,
        description: warranty.description,
        updates: warranty.updates.map(update => ({
          comment: update.comment,
          createdAt: update.createdAt
        }))
      };

      return NextResponse.json(formattedWarranty);
    } catch (jwtError) {
      console.error("Error al verificar el token:", jwtError);
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error al obtener los detalles de la garantía:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 