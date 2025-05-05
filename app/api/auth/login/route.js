import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateToken } from "@/lib/tokens";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log("[LOGIN] Login attempt:", { email });

    // Validar que se proporcionen email y password
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    console.log("[LOGIN] User found:", user ? "Yes" : "No");
    if (user) {
      console.log("[LOGIN] User password hash from DB:", user.password);
    }

    // Verificar si el usuario existe
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verificar la contraseña
    console.log("[LOGIN] Comparing provided password with DB hash.");
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("[LOGIN] Valid password?:", isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generar token JWT
    const token = generateToken(user);

    // Retornar respuesta exitosa
    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[LOGIN] Error:", error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


