import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default function WarrantyCard({ warranty }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {warranty.customer_name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(warranty.created_at)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(warranty.status)}`}>
            {warranty.status === 'pending' && 'Pendiente'}
            {warranty.status === 'in_progress' && 'En Progreso'}
            {warranty.status === 'completed' && 'Completada'}
            {warranty.status === 'rejected' && 'Rechazada'}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Producto:</span>{' '}
            {warranty.brand} {warranty.model}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Serial:</span>{' '}
            {warranty.serial}
          </p>
          {warranty.invoice_number && (
            <p className="text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Factura:</span>{' '}
              {warranty.invoice_number}
            </p>
          )}
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <p className="line-clamp-2">{warranty.damage_description}</p>
        </div>

        <Link 
          href={`/dashboard/warranties/${warranty.id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  )
} 