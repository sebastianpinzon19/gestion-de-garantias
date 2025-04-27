import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import argon2 from "argon2"

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Demo credentials
    if (email === "admin@example.com" && password === "admin123") {
      const response = NextResponse.json({
        success: true,
        token: "demo-token-admin",
        user: {
          id: 1,
          name: "Admin",
          email: "admin@example.com",
          role: "admin",
        },
      })

      response.cookies.set({
        name: "token",
        value: "demo-token-admin",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "strict",
      })

      return response
    }

    if (email === "seller@example.com" && password === "seller123") {
      const response = NextResponse.json({
        success: true,
        token: "demo-token-seller",
        user: {
          id: 2,
          name: "Seller",
          email: "seller@example.com",
          role: "seller",
        },
      })

      response.cookies.set({
        name: "token",
        value: "demo-token-seller",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "strict",
      })

      return response
    }

    // Login real con base de datos
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }
    const valid = await argon2.verify(user.password, password)
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }
    // No enviar la contraseña al frontend
    const { password: _, ...userWithoutPassword } = user
    const response = NextResponse.json({
      success: true,
      token: "real-user-token",
      user: userWithoutPassword,
    })
    response.cookies.set({
      name: "token",
      value: "real-user-token",
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
    })
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

