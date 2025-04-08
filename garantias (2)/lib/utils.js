import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Función para formatear fechas
export function formatDate(dateString) {
  if (!dateString) return ""

  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Función para generar un PDF (simulación)
export function generatePDF(garantiaId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        url: `/pdf/garantia-${garantiaId}.pdf`,
      })
    }, 1500)
  })
}

// Función para validar un formulario de garantía
export function validateGarantiaForm(data, section = "cliente") {
  const errors = {}

  if (section === "cliente") {
    // Validar campos obligatorios del cliente
    const requiredFields = [
      "nombreCliente",
      "telefonoCliente",
      "direccionCasa",
      "marcaEquipo",
      "modeloEquipo",
      "serialEquipo",
      "fechaCompra",
      "numeroFactura",
      "parteDanada",
      "fechaDano",
      "descripcionDano",
    ]

    requiredFields.forEach((field) => {
      if (!data[field]) {
        errors[field] = "Este campo es obligatorio"
      }
    })

    // Validar firma del cliente
    if (!data.firmaCliente) {
      errors.firmaCliente = "La firma del cliente es obligatoria"
    }
  } else if (section === "vendedor") {
    // Validar campos obligatorios del vendedor
    const requiredFields = ["crediMemo", "parteReemplazo", "fechaGestion"]

    requiredFields.forEach((field) => {
      if (!data[field]) {
        errors[field] = "Este campo es obligatorio"
      }
    })

    // Validar firma del vendedor
    if (!data.firmaVendedor) {
      errors.firmaVendedor = "La firma del vendedor es obligatoria"
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

