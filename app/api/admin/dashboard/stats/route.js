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
      
      if (!decoded || decoded.role !== 'admin') {
        return NextResponse.json(
          { error: "Acceso no autorizado - Se requiere rol de administrador" },
          { status: 401 }
        );
      }

      // Obtener estadísticas de garantías
      const [totalWarranties, pendingWarranties, inProgressWarranties, completedWarranties, totalSellers] = await Promise.all([
        prisma.warranty.count(),
        prisma.warranty.count({
          where: { warrantyStatus: 'pending' }
        }),
        prisma.warranty.count({
          where: { warrantyStatus: 'in_progress' }
        }),
        prisma.warranty.count({
          where: { warrantyStatus: 'completed' }
        }),
        prisma.user.count({
          where: { role: 'seller' }
        })
      ]);

      return NextResponse.json({
        totalWarranties,
        pendingWarranties,
        inProgressWarranties,
        completedWarranties,
        totalSellers
      });
    } catch (jwtError) {
      console.error("Error al verificar el token:", jwtError);
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error al obtener las estadísticas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 