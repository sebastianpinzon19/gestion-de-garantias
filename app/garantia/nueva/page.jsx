"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import ThemeSwitcher from "@/components/theme-switcher"
import Image from "next/image"

export default function NewWarrantyPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    ownerName: "",
    ownerPhone: "",
    address: "",
    brand: "",
    model: "",
    serial: "",
    purchaseDate: "",
    invoiceNumber: "",
    damagedPart: "",
    damagedPartSerial: "",
    damageDate: "",
    damageDescription: "",
    customerSignature: "",
    crediMemo: "",
    replacementPart: "",
    replacementSerial: "",
    managementDate: "",
    technicianNotes: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/warranties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error creating warranty')
      }

      const data = await response.json()
      toast({
        title: "Success",
        description: "Warranty has been created successfully",
      })
      router.push(`/dashboard/warranties/${data.id}`)
    } catch (err) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-yellow-500 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo empresa.png"
              alt="SoftwareRP Logo"
              width={50}
              height={50}
              className="rounded-full shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold">SoftwareRP</h1>
              <p className="text-sm opacity-90">Sistema de Gestión de Garantías</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Link href="/login">
              <Button variant="secondary" className="mr-2 bg-white/20 text-white hover:bg-white/30 border-white/40">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/warranty/new">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">Nueva Garantía</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <Card className="border-t-4 border-blue-500 max-w-6xl mx-auto shadow-xl">
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">Nueva Solicitud de Garantía</CardTitle>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Por favor complete todos los campos requeridos (*)
            </p>
          </CardHeader>

          <CardContent className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg shadow-sm">
                <p className="flex items-center gap-2">
                  <span className="font-bold">Error:</span> {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <section className="space-y-6 p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 border-b pb-2">
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="text-gray-700 dark:text-gray-300">Nombre del Cliente *</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Ingrese el nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone" className="text-gray-700 dark:text-gray-300">Teléfono del Cliente *</Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      className="w-full transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Ingrese el número de teléfono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName" className="text-gray-700 dark:text-gray-300">Nombre del Propietario (si es diferente)</Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="w-full transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Ingrese el nombre del propietario"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone" className="text-gray-700 dark:text-gray-300">Teléfono del Propietario</Label>
                    <Input
                      id="ownerPhone"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                      className="w-full transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Ingrese el teléfono del propietario"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">Dirección *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full min-h-[100px] transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Ingrese la dirección completa"
                    />
                  </div>
                </div>
              </section>

              {/* Product Information */}
              <section className="space-y-6 p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 border-b pb-2">
                  Información del Producto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-gray-700 dark:text-gray-300">Marca *</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                      className="w-full transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Ingrese la marca"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-gray-700 dark:text-gray-300">Modelo *</Label>
                    <Input
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                      className="w-full transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Ingrese el modelo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serial" className="text-gray-700 dark:text-gray-300">Número de Serie *</Label>
                    <Input
                      id="serial"
                      name="serial"
                      value={formData.serial}
                      onChange={handleChange}
                      required
                      className="w-full transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Ingrese el número de serie"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate" className="text-gray-700 dark:text-gray-300">Fecha de Compra *</Label>
                    <Input
                      id="purchaseDate"
                      name="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      required
                      className="w-full transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber" className="text-gray-700 dark:text-gray-300">Número de Factura *</Label>
                    <Input
                      id="invoiceNumber"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleChange}
                      required
                      className="w-full transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Ingrese el número de factura"
                    />
                  </div>
                </div>
              </section>

              {/* Damage Information */}
              <section className="space-y-6 p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 border-b pb-2">
                  Información del Daño
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="damagedPart" className="text-gray-700 dark:text-gray-300">Parte Dañada *</Label>
                    <Input
                      id="damagedPart"
                      name="damagedPart"
                      value={formData.damagedPart}
                      onChange={handleChange}
                      required
                      className="w-full transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Ingrese la parte dañada"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="damagedPartSerial" className="text-gray-700 dark:text-gray-300">Serial de Parte Dañada</Label>
                    <Input
                      id="damagedPartSerial"
                      name="damagedPartSerial"
                      value={formData.damagedPartSerial}
                      onChange={handleChange}
                      className="w-full transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Ingrese el serial de la parte dañada"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="damageDate" className="text-gray-700 dark:text-gray-300">Fecha del Daño *</Label>
                    <Input
                      id="damageDate"
                      name="damageDate"
                      type="date"
                      value={formData.damageDate}
                      onChange={handleChange}
                      required
                      className="w-full transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="damageDescription" className="text-gray-700 dark:text-gray-300">Descripción del Daño *</Label>
                    <Textarea
                      id="damageDescription"
                      name="damageDescription"
                      value={formData.damageDescription}
                      onChange={handleChange}
                      required
                      className="w-full min-h-[100px] transition-colors focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Describa detalladamente el daño presentado"
                    />
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? "Enviando..." : "Enviar Solicitud"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}