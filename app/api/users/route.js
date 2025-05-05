import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getAllUsers } from "@/lib/user-service"
import { registerUser } from "@/lib/auth"

export async function GET(request) {
  try {
    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value

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

    // Verificar token
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 })
    }

    // Obtener datos del usuario
    const userData = await request.json()

    // Registrar usuario
    const result = await registerUser(userData)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ success: false, message: "Error al crear usuario" }, { status: 500 })
  }
}
