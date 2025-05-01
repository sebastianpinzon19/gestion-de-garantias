import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import * as argon2 from "argon2"

export async function GET(request, { params }) {
  try {
    const { id } = params

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

    if (!user) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, message: "Error al obtener el usuario" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

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
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ success: false, message: "Error al actualizar el usuario" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

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

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado correctamente",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ success: false, message: "Error al eliminar el usuario" }, { status: 500 })
  }
}

