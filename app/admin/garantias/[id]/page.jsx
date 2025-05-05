"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/context/language-context"
import { useToast } from "@/components/ui/use-toast"

export default function AdminWarrantyDetails({ params }) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const { id } = params
  const [warranty, setWarranty] = useState(null)
  const [sellers, setSellers] = useState([])
  const [selectedSeller, setSelectedSeller] = useState("")
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch warranty details
        const warrantyRes = await fetch(`/api/warranties/${id}`)
        if (!warrantyRes.ok) throw new Error("Error al cargar los datos de la garantía")
        const warrantyData = await warrantyRes.json()
        setWarranty(warrantyData)

        // Fetch sellers
        const sellersRes = await fetch(`/api/users?role=seller`)
        if (!sellersRes.ok) throw new Error("Error al cargar los vendedores")
        const sellersData = await sellersRes.json()
        setSellers(sellersData)

        // Set selected seller if warranty is already assigned
        if (warrantyData.assigned_to) {
          setSelectedSeller(warrantyData.assigned_to.toString())
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleAssign = async () => {
    if (!selectedSeller) {
      toast({
        title: "Error",
        description: "Debe seleccionar un vendedor",
        variant: "destructive",
      })
      return
    }

    try {
      setAssigning(true)
      const response = await fetch(`/api/warranties/${id}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sellerId: Number.parseInt(selectedSeller) }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al asignar la garantía")
      }

      const data = await response.json()

      // Actualizar la garantía en el estado
      setWarranty(data.warranty)

      toast({
        title: "Éxito",
        description: "Garantía asignada correctamente",
      })
    } catch (error) {
      console.error("Error assigning warranty:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setAssigning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-3 text-gray-700 dark:text-gray-300">{t("loadingWarrantyDetails")}</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!warranty) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>Garantía no encontrada</AlertDescription>
      </Alert>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            {t("pending")}
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {t("approved")}
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {t("rejected")}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("warrantyDetails")} #{warranty.id}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-700 dark:text-gray-300">{t("status")}:</span>
            {getStatusBadge(warranty.status)}
          </div>
        </div>
        <Link href="/admin/garantias">
          <Button variant="outline" className="border-gray-300 dark:border-gray-600">
            {t("back")}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asignar Garantía</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sellers.map((seller) => (
                      <SelectItem key={seller.id} value={seller.id.toString()}>
                        {seller.name} ({seller.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAssign}
                disabled={assigning || !selectedSeller}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {assigning ? "Asignando..." : "Asignar Vendedor"}
              </Button>
            </div>

            {warranty.assigned_to && (
              <Alert className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800">
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Esta garantía está asignada al vendedor ID: {warranty.assigned_to}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Garantía</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="customer">
            <TabsList>
              <TabsTrigger value="customer">Información del Cliente</TabsTrigger>
              <TabsTrigger value="product">Información del Producto</TabsTrigger>
              <TabsTrigger value="damage">Información del Daño</TabsTrigger>
            </TabsList>

            <TabsContent value="customer" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nombre del Cliente</h3>
                  <p>{warranty.customer_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
                  <p>{warranty.customer_phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
                  <p>{warranty.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Fecha de Solicitud</h3>
                  <p>{new Date(warranty.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="product" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Marca</h3>
                  <p>{warranty.brand}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Modelo</h3>
                  <p>{warranty.model}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Serial</h3>
                  <p>{warranty.serial}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Fecha de Compra</h3>
                  <p>{warranty.purchase_date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Número de Factura</h3>
                  <p>{warranty.invoice_number}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="damage" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Parte Dañada</h3>
                  <p>{warranty.damaged_part}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Serial de Parte Dañada</h3>
                  <p>{warranty.damaged_part_serial || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Fecha del Daño</h3>
                  <p>{warranty.damage_date}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Descripción del Daño</h3>
                  <p className="whitespace-pre-wrap">{warranty.damage_description}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
