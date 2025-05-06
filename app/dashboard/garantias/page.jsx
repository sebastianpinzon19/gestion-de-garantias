"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function GestionGarantias() {
  const [garantias, setGarantias] = useState([])
  const [filtro, setFiltro] = useState("todas")
  const [busqueda, setBusqueda] = useState("")
  const [garantiasFiltradas, setGarantiasFiltradas] = useState([])

  useEffect(() => {
    // Fetch data from API
    const fetchGarantias = async () => {
      try {
        // In a real application, this would be an API call
        const response = await fetch("/api/garantias")
        if (response.ok) {
          const data = await response.json()
          setGarantias(data)
        } else {
          // Fallback to mock data if API fails
          setGarantias([
            {
              id: 1001,
              cliente: "Juan Pérez",
              producto: "Refrigerador XYZ-123",
              serial: "RF123456789",
              fechaSolicitud: "2023-05-15",
              estado: "pendiente",
              crediMemo: "CM-001",
            },
            {
              id: 1002,
              cliente: "María González",
              producto: "Lavadora ABC-456",
              serial: "LV987654321",
              fechaSolicitud: "2023-05-10",
              estado: "aprobada",
              crediMemo: "CM-002",
            },
            {
              id: 1003,
              cliente: "Carlos Rodríguez",
              producto: "Televisor DEF-789",
              serial: "TV567891234",
              fechaSolicitud: "2023-05-05",
              estado: "rechazada",
              crediMemo: "CM-003",
            },
            {
              id: 1004,
              cliente: "Ana Martínez",
              producto: "Estufa GHI-012",
              serial: "ES432109876",
              fechaSolicitud: "2023-05-01",
              estado: "pendiente",
              crediMemo: "CM-004",
            },
            {
              id: 1005,
              cliente: "Pedro Sánchez",
              producto: "Microondas JKL-345",
              serial: "MW345678912",
              fechaSolicitud: "2023-04-28",
              estado: "aprobada",
              crediMemo: "CM-005",
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching warranties:", error)
        // Fallback to mock data if API fails
        setGarantias([
          {
            id: 1001,
            cliente: "Juan Pérez",
            producto: "Refrigerador XYZ-123",
            serial: "RF123456789",
            fechaSolicitud: "2023-05-15",
            estado: "pendiente",
            crediMemo: "CM-001",
          },
          // ... other mock data
        ])
      }
    }

    fetchGarantias()
  }, [])

  useEffect(() => {
    // Aplicar filtros
    let resultado = garantias

    // Filtrar por estado
    if (filtro !== "todas") {
      resultado = resultado.filter((g) => g.estado === filtro)
    }

    // Filtrar por búsqueda
    if (busqueda) {
      const terminoBusqueda = busqueda.toLowerCase()
      resultado = resultado.filter(
        (g) =>
          g.cliente.toLowerCase().includes(terminoBusqueda) ||
          g.producto.toLowerCase().includes(terminoBusqueda) ||
          g.serial.toLowerCase().includes(terminoBusqueda) ||
          g.crediMemo.toLowerCase().includes(terminoBusqueda),
      )
    }

    setGarantiasFiltradas(resultado)
  }, [garantias, filtro, busqueda])

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pendiente
          </Badge>
        )
      case "aprobada":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Aprobada
          </Badge>
        )
      case "rechazada":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Rechazada
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Gestión de Garantías</h1>
        <Link href="/garantia/nueva">
          <Button className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600">
            Nueva Garantía
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="border-blue-200">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las garantías</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="aprobada">Aprobadas</SelectItem>
              <SelectItem value="rechazada">Rechazadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Buscar por cliente, producto, serial o Credi Memo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border-blue-200"
          />
        </div>
      </div>

      <div className="rounded-md border border-blue-200">
        <Table>
          <TableHeader className="bg-blue-50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Serial</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Credi Memo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {garantiasFiltradas.length > 0 ? (
              garantiasFiltradas.map((garantia) => (
                <TableRow key={garantia.id} className="hover:bg-blue-50">
                  <TableCell>{garantia.id}</TableCell>
                  <TableCell>{garantia.cliente}</TableCell>
                  <TableCell>{garantia.producto}</TableCell>
                  <TableCell>{garantia.serial}</TableCell>
                  <TableCell>{garantia.fechaSolicitud}</TableCell>
                  <TableCell>{garantia.crediMemo}</TableCell>
                  <TableCell>{getEstadoBadge(garantia.estado)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/garantias/${garantia.id}`}>
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                        Ver Detalles
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                  No se encontraron garantías con los filtros aplicados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

