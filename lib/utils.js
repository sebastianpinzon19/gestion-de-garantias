import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

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

