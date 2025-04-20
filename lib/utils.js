import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date, format = "simple") {
  if (!date) return ""
  
  const dateObj = new Date(date)
  
  if (format === "simple") {
    return dateObj.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }
  
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
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

export async function fetchWithError(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export function getWarrantyStatusColor(status) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    processing: 'bg-blue-100 text-blue-800'
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

