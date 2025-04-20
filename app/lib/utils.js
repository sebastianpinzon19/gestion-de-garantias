export function formatDate(date) {
  if (!date) return ''
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return new Date(date).toLocaleDateString('es-ES', options)
} 