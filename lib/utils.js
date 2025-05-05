import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina clases de manera condicional con soporte para Tailwind CSS
 * @param {string[]} inputs - Clases a combinar
 * @returns {string} - Clases combinadas
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

<<<<<<< HEAD
export function formatDate(date, format = "simple") {
  if (!date) return ""
  
  const dateObj = new Date(date)
  
  if (format === "simple") {
    return dateObj.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

// Function to generate a PDF (simulation)
export function generatePDF(warrantyId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        url: `/pdf/warranty-${warrantyId}.pdf`,
      })
    }, 1500)
  })
}

// Function to validate a warranty form
export function validateWarrantyForm(data) {
  const errors = {}

  // Required fields validation
    const requiredFields = [
    'clientName',
    'productName',
    'serialNumber',
    'purchaseDate',
    'warrantyPeriod'
    ]

  requiredFields.forEach(field => {
      if (!data[field]) {
      errors[field] = "This field is required"
      }
    })

  // Client signature validation
  if (!data.clientSignature) {
    errors.clientSignature = "Client signature is required"
  }

  // Seller fields validation
  const sellerFields = [
    'sellerName',
    'storeName',
    'storeAddress'
  ]

  sellerFields.forEach(field => {
      if (!data[field]) {
      errors[field] = "This field is required"
      }
    })

  // Seller signature validation
  if (!data.sellerSignature) {
    errors.sellerSignature = "Seller signature is required"
=======
/**
 * Formatea una fecha en formato local
 * @param {Date|string} date - Fecha a formatear
 * @param {Object} options - Opciones de formato
 * @returns {string} - Fecha formateada
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
  }

  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString("es-ES", { ...defaultOptions, ...options })
}

/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Moneda (por defecto CLP)
 * @returns {string} - Cantidad formateada
 */
export function formatCurrency(amount, currency = "CLP") {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
  }).format(amount)
}

/**
 * Genera un ID único
 * @returns {string} - ID único
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} - Texto truncado
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}
