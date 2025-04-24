"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import ThemeSwitcher from "@/components/theme-switcher"
import Image from "next/image"

export default function FormularioGarantiaPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    productName: "",
    serialNumber: "",
    purchaseDate: "",
    issueDescription: "",
    purchaseProof: null
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      for (const [key, value] of Object.entries(formData)) {
        if (value !== null) {
          formDataToSend.append(key, value)
        }
      }

      const response = await fetch("/api/garantias", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Error al enviar el formulario")
      }

      toast({
        title: "Garantía registrada",
        description: "Tu solicitud de garantía ha sido registrada exitosamente.",
      })

      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        productName: "",
        serialNumber: "",
        purchaseDate: "",
        issueDescription: "",
        purchaseProof: null
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0]
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <Card className="border-t-4 border-blue-500 max-w-6xl mx-auto shadow-xl">
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">Registro de Garantía</CardTitle>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Complete el formulario para registrar su garantía
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-card p-6 rounded-lg shadow-lg">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nombre del Cliente</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Correo Electrónico</Label>
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Teléfono</Label>
                <Input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="+57 300 123 4567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Nombre del Producto</Label>
                <Input
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Modelo y marca del producto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Número de Serie</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Número de serie del producto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Fecha de Compra</Label>
                <Input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseProof">Comprobante de Compra</Label>
                <Input
                  id="purchaseProof"
                  name="purchaseProof"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Formatos aceptados: PDF, JPG, PNG (máx. 5MB)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDescription">Descripción del Problema</Label>
                <Textarea
                  id="issueDescription"
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleChange}
                  placeholder="Describa el problema que presenta el producto"
                  required
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <Link href="/">
                  <Button variant="outline" type="button">
                    Volver al Inicio
                  </Button>
                </Link>
                <Button type="submit">Enviar Solicitud</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 