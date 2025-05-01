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

      // Menú específico para vendedores
      const menuItems = [
        {
          id: 'seller-dashboard',
          name: 'Dashboard',
          link: '/seller',
          icon: 'home',
          order: 1
        },
        {
          id: 'seller-warranties',
          name: 'Warranties',
          link: '/seller/warranties',
          icon: 'warranties',
          order: 2
        },
        {
          id: 'seller-new-warranty',
          name: 'New Warranty',
          link: '/seller/warranties/new',
          icon: 'new-warranty',
          order: 3
        },
        {
          id: 'seller-pending',
          name: 'Pending',
          link: '/seller/warranties/pending',
          icon: 'pending',
          order: 4
        },
        {
          id: 'seller-profile',
          name: 'Profile',
          link: '/seller/profile',
          icon: 'profile',
          order: 5
        }
      ];

      return NextResponse.json(menuItems);
    } catch (jwtError) {
      console.error("Error al verificar el token:", jwtError);
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error al obtener los elementos del menú:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 