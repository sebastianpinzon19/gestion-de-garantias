<<<<<<< HEAD
import { db } from "@/lib/db"
=======
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getUserById, updateUser, deleteUser } from "@/lib/user-service"

export async function GET(request, { params }) {
  try {
    const { id } = params

<<<<<<< HEAD
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

=======
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

>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
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

<<<<<<< HEAD
    // Verificar si el usuario existe
    const existingUser = await db.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 })
    }

    // Si se está actualizando el correo, verificar que no exista
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await db.user.findFirst({
        where: {
          email: data.email,
          NOT: { id }
        }
      })

      if (emailExists) {
        return NextResponse.json(
          { success: false, message: "El correo electrónico ya está registrado" },
          { status: 400 },
        )
      }
    }

    // Preparar datos para actualizar
    const updateData = {
      name: data.name || existingUser.name,
      email: data.email || existingUser.email,
      role: data.role || existingUser.role,
    }

    // Si hay nueva contraseña, encriptarla
    if (data.password) {
      updateData.password = await argon2.hash(data.password)
    }

    // Ejecutar la actualización
    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Usuario actualizado correctamente",
      user: updatedUser,
    })
=======
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
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
  } catch (error) {
    console.error(`Error al actualizar usuario ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

<<<<<<< HEAD
    // Verificar si el usuario existe
    const existingUser = await db.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 })
    }

    // Eliminar el usuario
    await db.user.delete({
      where: { id }
    })
=======
    // Obtener token de la cookie
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 })
    }

    // Verificar token
    const decoded = verifyToken(token)
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f

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
