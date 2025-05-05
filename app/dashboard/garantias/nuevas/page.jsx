"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function NewGarantiasPage() {
  const [garantias, setGarantias] = useState([])
  const [loading, setLoading] = useState(true)

  // Update the useEffect to fetch dynamic data
  useEffect(() => {
    // Simulación de datos - En producción, esto sería una llamada a la API
    const fetchGarantias = async () => {
      try {
        setLoading(true)
        // In a real application, this would be an API call
        const response = await fetch("/api/garantias/pendientes")

        if (response.ok) {
          const data = await response.json()
          setGarantias(data)
        } else {
          // Fallback to mock data if API fails
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const mockGarantias = [
            {
              id: 1001,
              cliente: "Juan Pérez",
              producto: "Refrigerador XYZ-123",
              serial: "RF123456789",
              fechaSolicitud: "2023-05-15",
              estado: "pendiente",
            },
            {
              id: 1004,
              cliente: "Ana Martínez",
              producto: "Estufa GHI-012",
              serial: "ES432109876",
              fechaSolicitud: "2023-05-01",
              estado: "pendiente",
            },
          ]

          setGarantias(mockGarantias)
        }
      } catch (error) {
        console.error("Error al cargar las garantías:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGarantias()
  }, [])

  // Update the UI with blue and yellow colors
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Solicitudes Nuevas</h1>
        <Link href="/garantia/nueva">
          <Button className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600">
            Nueva Garantía
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-blue-700">Cargando solicitudes...</p>
        </div>
      ) : garantias.length > 0 ? (
        <div className="rounded-md border border-blue-200">
          <Table>
            <TableHeader className="bg-blue-50">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {garantias.map((garantia) => (
                <TableRow key={garantia.id} className="hover:bg-blue-50">
                  <TableCell>{garantia.id}</TableCell>
                  <TableCell>{garantia.cliente}</TableCell>
                  <TableCell>{garantia.producto}</TableCell>
                  <TableCell>{garantia.serial}</TableCell>
                  <TableCell>{garantia.fechaSolicitud}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      Pendiente
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/garantias/${garantia.id}`}>
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                        Gestionar
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-blue-50 rounded-md border border-blue-200 p-6">
          <h3 className="text-xl font-medium mb-2 text-blue-700">No hay solicitudes nuevas</h3>
          <p className="text-gray-500 mb-4 text-center">Todas las solicitudes de garantía han sido gestionadas</p>
          <Link href="/garantia/nueva">
            <Button className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600">
              Crear Nueva Solicitud
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
