import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import * as argon2 from "argon2"

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Si no existe el usuario
    if (!user) {
      return NextResponse.json({ success: false, message: "Credenciales incorrectas" }, { status: 401 })
    }

    // Verificar contraseña
    const validPassword = await argon2.verify(user.password, password)
    if (!validPassword) {
      return NextResponse.json({ success: false, message: "Credenciales incorrectas" }, { status: 401 })
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "7d" }
    )

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    // Establecer el token como cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      sameSite: "strict",
    })

    return response
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

