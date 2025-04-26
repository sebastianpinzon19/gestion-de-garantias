"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@providers/auth-provider"

export default function SellerDashboardPage() {
  const [warranties, setWarranties] = useState([])
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Verificación inmediata de autenticación
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData || !isAuthenticated) {
      router.replace("/login")
      return
    }

    // Si está autenticado, cargar las garantías
    fetchWarranties()
  }, [isAuthenticated, router])

  const fetchWarranties = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch('/api/warranties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setWarranties(data.warranties)
      }
    } catch (error) {
      console.error('Error fetching warranties:', error)
    }
  }

  // Si no está autenticado, no mostrar nada
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Solicitudes de Garantía</h2>
          <Link href="/warranty-form">
            <Button>Nueva Garantía</Button>
          </Link>
        </div>

        {warranties.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {warranties.map((warranty) => (
              <div
                key={warranty.id}
                className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{warranty.customer_name}</h3>
                    <p className="text-sm text-muted-foreground">{warranty.brand} - {warranty.model}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    warranty.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                    warranty.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' :
                    warranty.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {warranty.status?.charAt(0).toUpperCase() + warranty.status?.slice(1)}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Serial: {warranty.serial}</p>
                  <p>Fecha de Compra: {new Date(warranty.purchase_date).toLocaleDateString()}</p>
                  <p>Fecha del Daño: {new Date(warranty.damage_date).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href={`/warranty/${warranty.id}`}>
                    <Button variant="outline" className="w-full">Ver Detalles</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">No hay solicitudes de garantía</h3>
            <p className="text-muted-foreground mb-4">Crea tu primera solicitud de garantía para comenzar</p>
            <Link href="/warranty-form">
              <Button>Crear Solicitud de Garantía</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
