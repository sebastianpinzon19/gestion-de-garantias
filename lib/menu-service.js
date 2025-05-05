import { sql } from "./db"
import { v4 as uuidv4 } from "uuid"

// Función para obtener los elementos del menú según el rol
export async function getMenuItems(role) {
  try {
    let query = `
      SELECT * FROM "MenuItem"
      WHERE role = 'all'
    `

    const params = []

    if (role) {
      query += ` OR role = $1`
      params.push(role)
    }

    query += ` ORDER BY "order" ASC`

    const result = await sql.query(query, params)

    return { success: true, menuItems: result.rows }
  } catch (error) {
    console.error("Error al obtener elementos del menú:", error)
    return { success: false, message: "Error al obtener el menú" }
  }
}

// Función para crear un nuevo elemento de menú
export async function createMenuItem(menuItemData) {
  try {
    const { name, link, icon, role, order } = menuItemData
    const id = uuidv4()

    const result = await sql`
      INSERT INTO "MenuItem" (
        id, 
        name, 
        link, 
        icon, 
        role, 
        "order", 
        "createdAt", 
        "updatedAt"
      )
      VALUES (
        ${id}, 
        ${name}, 
        ${link}, 
        ${icon || null}, 
        ${role || "all"}, 
        ${order || 0}, 
        NOW(), 
        NOW()
      )
      RETURNING *
    `

    return { success: true, menuItem: result[0] }
  } catch (error) {
    console.error("Error al crear elemento de menú:", error)
    return { success: false, message: "Error al crear el elemento de menú" }
  }
}

// Función para actualizar un elemento de menú
export async function updateMenuItem(id, menuItemData) {
  try {
    const { name, link, icon, role, order } = menuItemData

    // Preparar los campos a actualizar
    let updateQuery = `
      UPDATE "MenuItem"
      SET "updatedAt" = NOW()
    `

    const values = []
    let paramIndex = 1

    if (name) {
      updateQuery += `, name = $${paramIndex}`
      values.push(name)
      paramIndex++
    }

    if (link) {
      updateQuery += `, link = $${paramIndex}`
      values.push(link)
      paramIndex++
    }

    if (icon !== undefined) {
      updateQuery += `, icon = $${paramIndex}`
      values.push(icon)
      paramIndex++
    }

    if (role) {
      updateQuery += `, role = $${paramIndex}`
      values.push(role)
      paramIndex++
    }

    if (order !== undefined) {
      updateQuery += `, "order" = $${paramIndex}`
      values.push(order)
      paramIndex++
    }

    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`
    values.push(id)

    // Ejecutar la actualización
    const result = await sql.query(updateQuery, values)

    if (result.rows.length === 0) {
      return { success: false, message: "Elemento de menú no encontrado" }
    }

    return { success: true, menuItem: result.rows[0] }
  } catch (error) {
    console.error(`Error al actualizar elemento de menú ${id}:`, error)
    return { success: false, message: "Error al actualizar el elemento de menú" }
  }
}

// Función para eliminar un elemento de menú
export async function deleteMenuItem(id) {
  try {
    const result = await sql`
      DELETE FROM "MenuItem"
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return { success: false, message: "Elemento de menú no encontrado" }
    }

    return { success: true, message: "Elemento de menú eliminado correctamente" }
  } catch (error) {
    console.error(`Error al eliminar elemento de menú ${id}:`, error)
    return { success: false, message: "Error al eliminar el elemento de menú" }
  }
}
