<<<<<<< HEAD
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateToken } from "@/lib/tokens";
=======
import { NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log("[LOGIN] Login attempt:", { email });

<<<<<<< HEAD
    // Validar que se proporcionen email y password
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    console.log("[LOGIN] User found:", user ? "Yes" : "No");
    if (user) {
      console.log("[LOGIN] User password hash from DB:", user.password);
    }

    // Verificar si el usuario existe
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verificar la contraseña
    console.log("[LOGIN] Comparing provided password with DB hash.");
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("[LOGIN] Valid password?:", isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generar token JWT
    const token = generateToken(user);

    // Retornar respuesta exitosa
    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[LOGIN] Error:", error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


=======
    // Validar datos requeridos
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Correo y contraseña son requeridos" }, { status: 400 })
    }

    // Autenticar usuario
    const result = await authenticateUser(email, password)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 401 })
    }

    // Crear respuesta con cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    })

    // Establecer cookie con el token JWT
    response.cookies.set({
      name: "token",
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 día
      path: "/",
    })

    // Establecer cookie con el refresh token
    response.cookies.set({
      name: "refreshToken",
      value: result.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error en inicio de sesión:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
  }
}
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
