import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";



const prisma = new PrismaClient();

export async function POST(request) {
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

      const body = await request.json();
      const {
        customerFirstName,
        customerLastName,
        customerEmail,
        customerPhone,
        productName,
        productSerial,
        purchaseDate,
        description
      } = body;

      // Validar campos requeridos
      if (!customerFirstName || !customerLastName || !customerEmail || !customerPhone ||
          !productName || !productSerial || !purchaseDate || !description) {
        return NextResponse.json(
          { error: "Todos los campos son requeridos" },
          { status: 400 }
        );
      }

      // Crear o actualizar el cliente
      const customer = await prisma.customer.upsert({
        where: {
          email: customerEmail
        },
        update: {
          firstName: customerFirstName,
          lastName: customerLastName,
          phone: customerPhone
        },
        create: {
          firstName: customerFirstName,
          lastName: customerLastName,
          email: customerEmail,
          phone: customerPhone
        }
      });

      // Crear o actualizar el producto
      const product = await prisma.product.upsert({
        where: {
          serialNumber: productSerial
        },
        update: {
          name: productName
        },
        create: {
          name: productName,
          serialNumber: productSerial
        }
      });

      // Crear la garantía
      const warranty = await prisma.warranty.create({
        data: {
          customerId: customer.id,
          productId: product.id,
          sellerId: decoded.userId,
          purchaseDate: new Date(purchaseDate),
          description: description,
          status: 'PENDING'
        },
        include: {
          customer: true,
          product: true
        }
      });

      return NextResponse.json({
        id: warranty.id,
        customerName: `${warranty.customer.firstName} ${warranty.customer.lastName}`,
        productName: warranty.product.name,
        status: warranty.status,
        createdAt: warranty.createdAt,
        description: warranty.description
      });
    } catch (jwtError) {
      console.error("Error al verificar el token:", jwtError);
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error al crear la garantía:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 