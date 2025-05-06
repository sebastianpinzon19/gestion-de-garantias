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

/**
 * Formatea una fecha en formato local
 * @param {Date|string} date - Fecha a formatear
 * @param {Object} options - Opciones de formato
 * @returns {string} - Fecha formateada
 */
export function formatDate(date) {
  if (!date) return ""
  const d = new Date(date)
  return d.toLocaleDateString()
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
