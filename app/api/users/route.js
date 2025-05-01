import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import * as argon2 from "argon2"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    // Construir la consulta con Prisma
    const users = await db.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, message: "Error al obtener los usuarios" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json()

    // Validar datos requeridos
    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, message: "Todos los campos son obligatorios" }, { status: 400 })
    }

    // Verificar si el correo ya existe
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ success: false, message: "El correo electrónico ya está registrado" }, { status: 400 })
    }

    // Encriptar contraseña
    const hashedPassword = await argon2.hash(password)

    // Insertar usuario
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Usuario creado correctamente",
      user,
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ success: false, message: "Error al crear el usuario" }, { status: 500 })
  }
}

