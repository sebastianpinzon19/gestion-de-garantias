import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Crear respuesta
    const response = NextResponse.json({
      success: true,
      message: "Sesión cerrada correctamente",
    })

    // Eliminar cookies
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    })

    response.cookies.set({
      name: "refreshToken",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
  }
}
