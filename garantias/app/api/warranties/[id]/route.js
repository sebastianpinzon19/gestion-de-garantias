import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    const { id } = params

    const warranty = await sql`
      SELECT * FROM warranties WHERE id = ${id}
    `

    if (warranty.length === 0) {
      return NextResponse.json({ success: false, message: "Garantía no encontrada" }, { status: 404 })
    }

    return NextResponse.json(warranty[0])
  } catch (error) {
    console.error("Error fetching warranty:", error)
    return NextResponse.json({ success: false, message: "Error al obtener la garantía" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    // Verificar si la garantía existe
    const existingWarranty = await sql`
      SELECT * FROM warranties WHERE id = ${id}
    `

    if (existingWarranty.length === 0) {
      return NextResponse.json({ success: false, message: "Garantía no encontrada" }, { status: 404 })
    }

    // Si hay cambio de estado, registrar en el historial
    if (data.status && data.status !== existingWarranty[0].status) {
      await sql`
        INSERT INTO warranty_status_history (
          warranty_id, 
          previous_status, 
          new_status, 
          changed_by, 
          observations
        ) VALUES (
          ${id}, 
          ${existingWarranty[0].status}, 
          ${data.status}, 
          ${data.updated_by}, 
          ${data.status_observations || null}
        )
      `
    }

    // Actualizar la garantía
    const updateFields = []
    const updateValues = []

    // Construir dinámicamente la consulta de actualización
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "id" && key !== "created_at" && key !== "updated_at") {
        updateFields.push(`${key} = $${updateValues.length + 1}`)
        updateValues.push(value)
      }
    })

    // Añadir updated_at
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)

    // Añadir el ID al final para la cláusula WHERE
    updateValues.push(id)

    const updateQuery = `
      UPDATE warranties 
      SET ${updateFields.join(", ")} 
      WHERE id = $${updateValues.length} 
      RETURNING *
    `

    const result = await sql.unsafe(updateQuery, updateValues)

    return NextResponse.json({
      success: true,
      message: "Garantía actualizada correctamente",
      warranty: result[0],
    })
  } catch (error) {
    console.error("Error updating warranty:", error)
    return NextResponse.json({ success: false, message: "Error al actualizar la garantía" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // Verificar si la garantía existe
    const existingWarranty = await sql`
      SELECT * FROM warranties WHERE id = ${id}
    `

    if (existingWarranty.length === 0) {
      return NextResponse.json({ success: false, message: "Garantía no encontrada" }, { status: 404 })
    }

    // Eliminar primero los registros de historial
    await sql`
      DELETE FROM warranty_status_history WHERE warranty_id = ${id}
    `

    // Eliminar la garantía
    await sql`
      DELETE FROM warranties WHERE id = ${id}
    `

    return NextResponse.json({
      success: true,
      message: "Garantía eliminada correctamente",
    })
  } catch (error) {
    console.error("Error deleting warranty:", error)
    return NextResponse.json({ success: false, message: "Error al eliminar la garantía" }, { status: 500 })
  }
}

