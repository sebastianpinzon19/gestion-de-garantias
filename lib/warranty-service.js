import { sql } from "./db"
import { v4 as uuidv4 } from "uuid"

// Función para crear una nueva garantía
export async function createWarranty(warrantyData, userId) {
  try {
    const id = uuidv4()
    const now = new Date()

    const result = await sql`
      INSERT INTO "Warranty" (
        id, 
        "customerName", 
        "customerPhone", 
        "address", 
        "brand", 
        "model", 
        "serial", 
        "purchaseDate", 
        "invoiceNumber", 
        "damagedPart", 
        "damagedPartSerial", 
        "damageDate", 
        "damageDescription", 
        "customerSignature", 
        "status", 
        "createdBy", 
        "createdAt", 
        "updatedAt"
      )
      VALUES (
        ${id}, 
        ${warrantyData.customerName}, 
        ${warrantyData.customerPhone}, 
        ${warrantyData.address || null}, 
        ${warrantyData.brand}, 
        ${warrantyData.model}, 
        ${warrantyData.serial}, 
        ${warrantyData.purchaseDate}, 
        ${warrantyData.invoiceNumber}, 
        ${warrantyData.damagedPart}, 
        ${warrantyData.damagedPartSerial || null}, 
        ${warrantyData.damageDate}, 
        ${warrantyData.damageDescription}, 
        ${warrantyData.customerSignature || null}, 
        ${"pending"}, 
        ${userId || null}, 
        ${now}, 
        ${now}
      )
      RETURNING *
    `

    return { success: true, warranty: result[0] }
  } catch (error) {
    console.error("Error al crear garantía:", error)
    return { success: false, message: "Error al crear la garantía" }
  }
}

// Función para obtener todas las garantías
export async function getAllWarranties(filters = {}) {
  try {
    let query = `
      SELECT w.*, u1.name as "createdByName", u2.name as "assignedToName"
      FROM "Warranty" w
      LEFT JOIN "User" u1 ON w."createdBy" = u1.id
      LEFT JOIN "User" u2 ON w."assignedTo" = u2.id
    `

    const conditions = []
    const params = []

    // Aplicar filtros
    if (filters.status) {
      conditions.push(`w.status = $${params.length + 1}`)
      params.push(filters.status)
    }

    if (filters.createdBy) {
      conditions.push(`w."createdBy" = $${params.length + 1}`)
      params.push(filters.createdBy)
    }

    if (filters.assignedTo) {
      conditions.push(`w."assignedTo" = $${params.length + 1}`)
      params.push(filters.assignedTo)
    }

    if (filters.search) {
      conditions.push(`(
        w."customerName" ILIKE $${params.length + 1} OR
        w."customerPhone" ILIKE $${params.length + 1} OR
        w.serial ILIKE $${params.length + 1} OR
        w."invoiceNumber" ILIKE $${params.length + 1}
      )`)
      params.push(`%${filters.search}%`)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    // Ordenar
    query += ` ORDER BY w."createdAt" DESC`

    // Ejecutar consulta
    const result = await sql.query(query, params)

    return { success: true, warranties: result.rows }
  } catch (error) {
    console.error("Error al obtener garantías:", error)
    return { success: false, message: "Error al obtener las garantías" }
  }
}

// Función para obtener una garantía por ID
export async function getWarrantyById(id) {
  try {
    const result = await sql`
      SELECT w.*, u1.name as "createdByName", u2.name as "assignedToName"
      FROM "Warranty" w
      LEFT JOIN "User" u1 ON w."createdBy" = u1.id
      LEFT JOIN "User" u2 ON w."assignedTo" = u2.id
      WHERE w.id = ${id}
    `

    if (result.length === 0) {
      return { success: false, message: "Garantía no encontrada" }
    }

    return { success: true, warranty: result[0] }
  } catch (error) {
    console.error(`Error al obtener garantía ${id}:`, error)
    return { success: false, message: "Error al obtener la garantía" }
  }
}

// Función para actualizar una garantía
export async function updateWarranty(id, warrantyData, userId) {
  try {
    // Verificar si la garantía existe
    const existingWarranty = await getWarrantyById(id)

    if (!existingWarranty.success) {
      return existingWarranty
    }

    // Preparar los campos a actualizar
    const updateFields = []
    const values = []
    let paramIndex = 1

    for (const [key, value] of Object.entries(warrantyData)) {
      // Convertir camelCase a snake_case para la base de datos
      const dbField = key.replace(/([A-Z])/g, "_$1").toLowerCase()
      updateFields.push(`"${key}" = $${paramIndex}`)
      values.push(value)
      paramIndex++
    }

    // Agregar campos de auditoría
    updateFields.push(`"updatedBy" = $${paramIndex}`)
    values.push(userId)
    paramIndex++

    updateFields.push(`"updatedAt" = $${paramIndex}`)
    values.push(new Date())

    // Construir y ejecutar la consulta
    const query = `
      UPDATE "Warranty"
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex + 1}
      RETURNING *
    `
    values.push(id)

    const result = await sql.query(query, values)

    return { success: true, warranty: result.rows[0] }
  } catch (error) {
    console.error(`Error al actualizar garantía ${id}:`, error)
    return { success: false, message: "Error al actualizar la garantía" }
  }
}

// Función para asignar una garantía a un vendedor
export async function assignWarranty(id, sellerId, assignedBy) {
  try {
    const result = await sql`
      UPDATE "Warranty"
      SET "assignedTo" = ${sellerId},
          "updatedBy" = ${assignedBy},
          "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return { success: false, message: "Garantía no encontrada" }
    }

    return { success: true, warranty: result[0] }
  } catch (error) {
    console.error(`Error al asignar garantía ${id}:`, error)
    return { success: false, message: "Error al asignar la garantía" }
  }
}

// Función para obtener estadísticas de garantías
export async function getWarrantyStats() {
  try {
    // Total de garantías
    const totalResult = await sql`SELECT COUNT(*) as total FROM "Warranty"`
    const total = Number.parseInt(totalResult[0].total)

    // Garantías por estado
    const byStatusResult = await sql`
      SELECT status, COUNT(*) as count
      FROM "Warranty"
      GROUP BY status
    `

    // Garantías por mes (últimos 6 meses)
    const byMonthResult = await sql`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM "Warranty"
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month
    `

    return {
      success: true,
      stats: {
        total,
        byStatus: byStatusResult,
        byMonth: byMonthResult,
      },
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return { success: false, message: "Error al obtener estadísticas" }
  }
}
