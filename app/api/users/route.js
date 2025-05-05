<<<<<<< HEAD
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import * as argon2 from "argon2"
=======
import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getAllUsers } from "@/lib/user-service"
import { registerUser } from "@/lib/auth"
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f

export async function GET(request) {
  try {
    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value

<<<<<<< HEAD
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
=======
    if (!token) {
      return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 })
    }

    // Verificar token
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 })
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const search = searchParams.get("search")

    // Construir filtros
    const filters = {}
    if (role) {
      filters.role = role
    }
    if (search) {
      filters.search = search
    }

    // Obtener usuarios
    const users = await getAllUsers(filters)
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ success: false, message: "Error al obtener usuarios" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 })
    }

<<<<<<< HEAD
    // Verificar si el correo ya existe
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ success: false, message: "El correo electrónico ya está registrado" }, { status: 400 })
=======
    // Verificar token
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 })
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
    }

    // Obtener datos del usuario
    const userData = await request.json()

<<<<<<< HEAD
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
=======
    // Registrar usuario
    const result = await registerUser(userData)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json(result)
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ success: false, message: "Error al crear usuario" }, { status: 500 })
  }
}
