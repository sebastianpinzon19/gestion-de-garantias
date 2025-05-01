import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";



const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Obtener el token del header de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "No autorizado - Token no proporcionado" },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded || decoded.role !== 'admin') {
        return NextResponse.json(
          { error: "Acceso no autorizado - Se requiere rol de administrador" },
          { status: 401 }
        );
      }

      // Menú específico para administradores
      const menuItems = [
        {
          id: 'admin-dashboard',
          name: 'Dashboard',
          link: '/admin',
          icon: 'home',
          order: 1
        },
        {
          id: 'admin-users',
          name: 'Users',
          link: '/admin/users',
          icon: 'users',
          order: 2
        },
        {
          id: 'admin-warranties',
          name: 'Warranties',
          link: '/admin/warranties',
          icon: 'warranty',
          order: 3
        },
        {
          id: 'admin-analytics',
          name: 'Analytics',
          link: '/admin/analytics',
          icon: 'analytics',
          order: 4
        },
        {
          id: 'admin-settings',
          name: 'Settings',
          link: '/admin/settings',
          icon: 'settings',
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