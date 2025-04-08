"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/providers/language-provider"
import { useToast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"

export default function HistorialGarantias() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [garantias, setGarantias] = useState([])
  const [filtro, setFiltro] = useState("all")
  const [busqueda, setBusqueda] = useState("")
  const [garantiasFiltradas, setGarantiasFiltradas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGarantias = async () => {
      try {
        setLoading(true)
        // Obtener garantías que no están pendientes
        const response = await fetch("/api/warranties")

        if (response.ok) {
          const data = await response.json()
          // Filtrar solo las garantías que no están pendientes
          const historicoGarantias = data.filter((g) => g.status !== "pending")
          setGarantias(historicoGarantias)
        } else {
          throw new Error("Error al cargar historial de garantías")
        }
      } catch (error) {
        console.error("Error fetching warranty history:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar el historial de garantías",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchGarantias()
  }, [toast])

  useEffect(() => {
    // Aplicar filtros
    let resultado = garantias

    // Filtrar por estado
    if (filtro !== "all") {
      resultado = resultado.filter((g) => g.status === filtro)
    }

    // Filtrar por búsqueda
    if (busqueda.trim() !== "") {
      const terminoBusqueda = busqueda.toLowerCase()
      resultado = resultado.filter(
        (g) =>
          g.customer_name?.toLowerCase().includes(terminoBusqueda) ||
          g.brand?.toLowerCase().includes(terminoBusqueda) ||
          g.model?.toLowerCase().includes(terminoBusqueda) ||
          g.serial?.toLowerCase().includes(terminoBusqueda) ||
          g.credi_memo?.toLowerCase().includes(terminoBusqueda),
      )
    }

    setGarantiasFiltradas(resultado)
  }, [garantias, filtro, busqueda])

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900"
          >
            {t("approved")}
          </Badge>
        )
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900"
          >
            {t("rejected")}
          </Badge>
        )
      default:
        return <Badge variant="outline">{t("status")}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t("history")}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="border-blue-200 dark:border-blue-800">
              <SelectValue placeholder={t("filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allWarranties")}</SelectItem>
              <SelectItem value="approved">{t("approved")}</SelectItem>
              <SelectItem value="rejected">{t("rejected")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-2/3">
          <Input
            placeholder={t("searchPlaceholder")}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border-blue-200 dark:border-blue-800"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-700 dark:text-gray-300">{t("loadingHistory")}</p>
        </div>
      ) : garantiasFiltradas.length > 0 ? (
        <div className="rounded-md border border-blue-200 dark:border-blue-800">
          <Table>
            <TableHeader className="bg-blue-50 dark:bg-blue-900/30">
              <TableRow>
                <TableHead>{t("id")}</TableHead>
                <TableHead>{t("customer")}</TableHead>
                <TableHead>{t("product")}</TableHead>
                <TableHead>{t("crediMemo")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {garantiasFiltradas.map((garantia) => (
                <TableRow key={garantia.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/10">
                  <TableCell>{garantia.id}</TableCell>
                  <TableCell>{garantia.customer_name}</TableCell>
                  <TableCell>{`${garantia.brand} ${garantia.model}`}</TableCell>
                  <TableCell>{garantia.credi_memo || "-"}</TableCell>
                  <TableCell>{formatDate(garantia.created_at)}</TableCell>
                  <TableCell>{getEstadoBadge(garantia.status)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/garantias/${garantia.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        {t("details")}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800 p-6">
          <h3 className="text-xl font-medium mb-2 text-blue-700 dark:text-blue-400">{t("noResultsFound")}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">{t("noResultsDesc")}</p>
        </div>
      )}
    </div>
  )
}

