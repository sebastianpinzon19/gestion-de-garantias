import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Formatear fecha para mostrar en la interfaz
export function formatDate(dateString) {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

// Generar un ID único
export function generateId() {
  return crypto.randomUUID()
}

// Validar email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Obtener estado de garantía en español
export function getWarrantyStatusText(status) {
  const statusMap = {
    pending: "Pendiente",
    approved: "Aprobada",
    rejected: "Rechazada",
    in_progress: "En Proceso",
    completed: "Completada",
  }

  return statusMap[status] || status
}

// Obtener rol en español
export function getRoleText(role) {
  const roleMap = {
    admin: "Administrador",
    seller: "Vendedor",
    customer: "Cliente",
  }

  return roleMap[role] || role
}

// Función cn para combinar clases de Tailwind de manera condicional
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
