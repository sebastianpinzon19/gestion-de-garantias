import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getUserById, updateUser, deleteUser } from "@/lib/user-service"

export async function GET(request, { params }) {
  try {
    const { id } = params

    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 })
    }

    // Verificar token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Token inválido" }, { status: 401 })
    }

    // Solo permitir acceso al propio usuario o a administradores
    if (decoded.id !== id && decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 })
    }

    // Obtener usuario
    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error(`Error al obtener usuario ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Error al obtener usuario" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params

    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 })
    }

    // Verificar token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Token inválido" }, { status: 401 })
    }

    // Solo permitir actualizar al propio usuario o a administradores
    if (decoded.id !== id && decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 })
    }

    // Obtener datos del usuario
    const userData = await request.json()

    // Si no es admin, no permitir cambiar el rol
    if (decoded.role !== "admin" && userData.role) {
      delete userData.role
    }

    // Actualizar usuario
    const result = await updateUser(id, userData)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error al actualizar usuario ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

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

    // Eliminar usuario
    const result = await deleteUser(id)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error al eliminar usuario ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Error al eliminar usuario" }, { status: 500 })
  }
}
