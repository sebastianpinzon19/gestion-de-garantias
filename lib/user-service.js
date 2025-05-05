import { sql } from "./db"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

// Función para obtener todos los usuarios
export async function getAllUsers(filters = {}) {
  try {
    let query = `
      SELECT id, name, email, role, "phoneNumber", "createdAt", "updatedAt"
      FROM "User"
    `

    const conditions = []
    const params = []

    // Aplicar filtros
    if (filters.role) {
      conditions.push(`role = $${params.length + 1}`)
      params.push(filters.role)
    }

    if (filters.search) {
      conditions.push(`(
        name ILIKE $${params.length + 1} OR
        email ILIKE $${params.length + 1}
      )`)
      params.push(`%${filters.search}%`)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    // Ordenar
    query += ` ORDER BY name ASC`

    // Ejecutar consulta
    const result = await sql.query(query, params)

    return { success: true, users: result.rows }
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return { success: false, message: "Error al obtener los usuarios" }
  }
}

// Función para obtener un usuario por ID
export async function getUserById(id) {
  try {
    const result = await sql`
      SELECT id, name, email, role, "phoneNumber", "createdAt", "updatedAt"
      FROM "User"
      WHERE id = ${id}
    `

    if (result.length === 0) {
      return { success: false, message: "Usuario no encontrado" }
    }

    return { success: true, user: result[0] }
  } catch (error) {
    console.error(`Error al obtener usuario ${id}:`, error)
    return { success: false, message: "Error al obtener el usuario" }
  }
}

// Función para crear un nuevo usuario
export async function createUser(userData) {
  try {
    const { name, email, password, role, phoneNumber } = userData

    // Verificar si el email ya existe
    const existingUsers = await sql`
      SELECT * FROM "User" WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return { success: false, message: "El correo electrónico ya está registrado" }
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generar ID único
    const id = uuidv4()

    // Insertar nuevo usuario
    const result = await sql`
      INSERT INTO "User" (
        id, 
        name, 
        email, 
        password, 
        role, 
        "phoneNumber", 
        "createdAt", 
        "updatedAt"
      )
      VALUES (
        ${id}, 
        ${name}, 
        ${email}, 
        ${hashedPassword}, 
        ${role}, 
        ${phoneNumber || null}, 
        NOW(), 
        NOW()
      )
      RETURNING id, name, email, role, "phoneNumber", "createdAt", "updatedAt"
    `

    return { success: true, user: result[0] }
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return { success: false, message: "Error al crear el usuario" }
  }
}

// Función para actualizar un usuario
export async function updateUser(id, userData) {
  try {
    // Verificar si el usuario existe
    const existingUser = await getUserById(id)

    if (!existingUser.success) {
      return existingUser
    }

    const { name, email, password, role, phoneNumber } = userData

    // Verificar si el email ya existe (si se está cambiando)
    if (email && email !== existingUser.user.email) {
      const existingEmail = await sql`
        SELECT * FROM "User" WHERE email = ${email} AND id != ${id}
      `

      if (existingEmail.length > 0) {
        return { success: false, message: "El correo electrónico ya está registrado" }
      }
    }

    // Preparar los campos a actualizar
    let updateQuery = `
      UPDATE "User"
      SET "updatedAt" = NOW()
    `

    const values = []
    let paramIndex = 1

    if (name) {
      updateQuery += `, name = $${paramIndex}`
      values.push(name)
      paramIndex++
    }

    if (email) {
      updateQuery += `, email = $${paramIndex}`
      values.push(email)
      paramIndex++
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateQuery += `, password = $${paramIndex}`
      values.push(hashedPassword)
      paramIndex++
    }

    if (role) {
      updateQuery += `, role = $${paramIndex}`
      values.push(role)
      paramIndex++
    }

    if (phoneNumber !== undefined) {
      updateQuery += `, "phoneNumber" = $${paramIndex}`
      values.push(phoneNumber)
      paramIndex++
    }

    updateQuery += ` WHERE id = $${paramIndex} RETURNING id, name, email, role, "phoneNumber", "createdAt", "updatedAt"`
    values.push(id)

    // Ejecutar la actualización
    const result = await sql.query(updateQuery, values)

    return { success: true, user: result.rows[0] }
  } catch (error) {
    console.error(`Error al actualizar usuario ${id}:`, error)
    return { success: false, message: "Error al actualizar el usuario" }
  }
}

// Función para eliminar un usuario
export async function deleteUser(id) {
  try {
    // Verificar si hay garantías asociadas al usuario
    const warranties = await sql`
      SELECT COUNT(*) as count
      FROM "Warranty"
      WHERE "createdBy" = ${id} OR "assignedTo" = ${id}
    `

    if (Number.parseInt(warranties[0].count) > 0) {
      return {
        success: false,
        message: "No se puede eliminar el usuario porque tiene garantías asociadas",
      }
    }

    // Eliminar usuario
    await sql`
      DELETE FROM "User"
      WHERE id = ${id}
    `

    return { success: true, message: "Usuario eliminado correctamente" }
  } catch (error) {
    console.error(`Error al eliminar usuario ${id}:`, error)
    return { success: false, message: "Error al eliminar el usuario" }
  }
}

// Función para obtener vendedores
export async function getSellers() {
  try {
    const result = await sql`
      SELECT id, name, email, "phoneNumber"
      FROM "User"
      WHERE role = 'seller'
      ORDER BY name ASC
    `

    return { success: true, sellers: result }
  } catch (error) {
    console.error("Error al obtener vendedores:", error)
    return { success: false, message: "Error al obtener los vendedores" }
  }
}
