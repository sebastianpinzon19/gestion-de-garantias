<<<<<<< HEAD
import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
} 
=======
import { sql } from "./db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { randomUUID } from "crypto"

// Función para autenticar un usuario
export async function authenticateUser(email, password) {
  try {
    // Buscar usuario por email en la tabla User existente
    const users = await sql`
      SELECT * FROM "User" WHERE email = ${email}
    `

    if (users.length === 0) {
      return { success: false, message: "Credenciales incorrectas" }
    }

    const user = users[0]

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return { success: false, message: "Credenciales incorrectas" }
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "default-jwt-secret",
      { expiresIn: "1d" },
    )

    // Generar refresh token
    const refreshToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_REFRESH_SECRET || "default-refresh-secret",
      { expiresIn: "7d" },
    )

    // Actualizar último login (no hay columna last_login, así que actualizamos updatedAt)
    await sql`
      UPDATE "User" 
      SET "updatedAt" = NOW() 
      WHERE id = ${user.id}
    `

    // Devolver información del usuario (sin contraseña)
    const { password: _, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
      token,
      refreshToken,
    }
  } catch (error) {
    console.error("Error en autenticación:", error)
    return { success: false, message: "Error en el servidor" }
  }
}

// Función para verificar un token JWT
export function verifyToken(token) {
  if (!token) {
    return { valid: false, error: "Token no proporcionado" }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default-jwt-secret")
    return { valid: true, decoded }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}

// Función para verificar un refresh token
export function verifyRefreshToken(token) {
  if (!token) {
    return { valid: false, error: "Token no proporcionado" }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || "default-refresh-secret")
    return { valid: true, decoded }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}

// Función para generar un nuevo token a partir de un refresh token
export async function refreshAccessToken(refreshToken) {
  try {
    // Verificar refresh token
    const { valid, decoded, error } = verifyRefreshToken(refreshToken)

    if (!valid) {
      return { success: false, message: "Token inválido", error }
    }

    // Buscar usuario
    const users = await sql`
      SELECT * FROM "User" WHERE id = ${decoded.userId}
    `

    if (users.length === 0) {
      return { success: false, message: "Usuario no encontrado" }
    }

    const user = users[0]

    // Generar nuevo token
    const newToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "default-jwt-secret",
      { expiresIn: "1d" },
    )

    // Devolver información del usuario (sin contraseña)
    const { password: _, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
      token: newToken,
    }
  } catch (error) {
    console.error("Error al refrescar token:", error)
    return { success: false, message: "Error en el servidor" }
  }
}

// Función para registrar un nuevo usuario
export async function registerUser(userData) {
  try {
    const { name, email, password, role = "customer", phoneNumber = null } = userData

    // Verificar si el email ya está registrado
    const existingUsers = await sql`
      SELECT * FROM "User" WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return { success: false, message: "El correo electrónico ya está registrado" }
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generar un ID único (UUID)
    const id = randomUUID()

    // Insertar nuevo usuario
    const result = await sql`
      INSERT INTO "User" (id, name, email, password, role, "phoneNumber", "createdAt", "updatedAt")
      VALUES (${id}, ${name}, ${email}, ${hashedPassword}, ${role}, ${phoneNumber}, NOW(), NOW())
      RETURNING id, name, email, role, "phoneNumber", "createdAt", "updatedAt"
    `

    return { success: true, user: result[0] }
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return { success: false, message: "Error en el servidor" }
  }
}

// Función para obtener usuario por ID
export async function getUserById(id) {
  try {
    const users = await sql`
      SELECT id, name, email, role, "phoneNumber", "createdAt", "updatedAt"
      FROM "User"
      WHERE id = ${id}
    `

    if (users.length === 0) {
      return { success: false, message: "Usuario no encontrado" }
    }

    return { success: true, user: users[0] }
  } catch (error) {
    console.error(`Error al obtener usuario ${id}:`, error)
    return { success: false, message: "Error en el servidor" }
  }
}
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
