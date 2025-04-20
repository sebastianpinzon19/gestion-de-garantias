"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"

export default function Dashboard() {
  const { toast } = useToast()
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  })
  const [recentWarranties, setRecentWarranties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Obtener estadísticas
        const statsResponse = await fetch("/api/warranties/stats")
        if (!statsResponse.ok) throw new Error("Error al cargar estadísticas")
        const statsData = await statsResponse.json()
        setStats(statsData)

        // Obtener garantías recientes
        const warrantiesResponse = await fetch("/api/warranties/recent")
        if (!warrantiesResponse.ok) throw new Error("Error al cargar garantías recientes")
        const warrantiesData = await warrantiesResponse.json()
        setRecentWarranties(warrantiesData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del dashboard",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    const labels = {
      pending: "Pendiente",
      approved: "Aprobada",
      rejected: "Rechazada",
    }
    return (
      <span className={`px-2 py-1 rounded-full ${styles[status] || styles.pending}`}>
        {labels[status] || "Pendiente"}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Panel de Control</h1>
        <Link href="/dashboard/warranties/new">
          <Button className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600">
            Ver Nuevas Solicitudes
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Garantías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800 dark:text-blue-300">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-l-4 border-yellow-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Aprobadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-l-4 border-red-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Rechazadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300">Actividad Reciente</CardTitle>
            <CardDescription>Últimas solicitudes de garantía</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <div className="h-16 bg-gray-100 dark:bg-gray-700 animate-pulse rounded"></div>
                <div className="h-16 bg-gray-100 dark:bg-gray-700 animate-pulse rounded"></div>
                <div className="h-16 bg-gray-100 dark:bg-gray-700 animate-pulse rounded"></div>
              </div>
            ) : recentWarranties.length > 0 ? (
              <div className="space-y-4">
                {recentWarranties.map((warranty) => (
                  <div key={warranty.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Garantía #{warranty.id}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Cliente: {warranty.customer_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Producto: {warranty.brand} {warranty.model}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Fecha: {formatDate(warranty.created_at)}
                        </p>
                      </div>
                      <div className="text-sm">{getStatusBadge(warranty.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No hay garantías recientes
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-yellow-700 dark:text-yellow-500">Acciones Rápidas</CardTitle>
            <CardDescription>Acceso directo a funciones comunes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/warranties/new">
              <Button variant="outline" className="w-full justify-start border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                Ver Solicitudes Pendientes
              </Button>
            </Link>
            <Link href="/warranty/new">
              <Button
                variant="outline"
                className="w-full justify-start border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              >
                Crear Nueva Solicitud
              </Button>
            </Link>
            <Link href="/dashboard/warranties/history">
              <Button variant="outline" className="w-full justify-start border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                Ver Historial Completo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
