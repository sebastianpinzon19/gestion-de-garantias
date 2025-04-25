import { NextResponse } from "next/server"

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

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}

