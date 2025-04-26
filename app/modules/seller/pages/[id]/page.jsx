"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "@context/theme-context"
import { Download, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import SignatureCanvas from "@/components/forms/signature-canvas"

export default function WarrantyDetails({ params }) {
  const { theme } = useTheme()
  const router = useRouter()
  const { id } = params
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [user, setUser] = useState(null)

  // Estado para los datos de la garantía
  const [warranty, setWarranty] = useState(null)
  const [formData, setFormData] = useState({
    crediMemo: "",
    replacementPart: "",
    replacementSerial: "",
    sellerSignature: null,
    managementDate: "",
    status: "pending",
    technicianNotes: "",
    resolutionDate: "",
  })

  useEffect(() => {
    // Obtener datos del usuario
    if (typeof window !== "undefined") {
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    // Cargar datos de la garantía
    const fetchWarranty = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/warranties/${id}`)

        if (!response.ok) {
          throw new Error("Error loading warranty data")
        }

        const data = await response.json()
        setWarranty(data)

        // Inicializar el formulario con los datos existentes
        setFormData({
          crediMemo: data.crediMemo || "",
          replacementPart: data.replacementPart || "",
          replacementSerial: data.replacementSerial || "",
          sellerSignature: data.sellerSignature || null,
          managementDate: data.managementDate || "",
          status: data.warrantyStatus || "pending",
          technicianNotes: data.technicianNotes || "",
          resolutionDate: data.resolutionDate || "",
        })
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Error loading warranty data")
      } finally {
        setLoading(false)
      }
    }

    fetchWarranty()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSellerSignature = (signature) => {
    setFormData((prev) => ({ ...prev, sellerSignature: signature }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      // Validar campos obligatorios de la sección del vendedor
      if (formData.status !== "pending") {
        const requiredFields = ["crediMemo", "replacementPart", "managementDate"]
        const missingFields = requiredFields.filter((field) => !formData[field])

        if (missingFields.length > 0 || !formData.sellerSignature) {
          throw new Error("Please fill all required fields")
        }
      }

      // Preparar datos para enviar a la API
      const dataToSend = {
        crediMemo: formData.crediMemo,
        replacementPart: formData.replacementPart,
        replacementSerial: formData.replacementSerial || null,
        sellerSignature: formData.sellerSignature,
        managementDate: formData.managementDate,
        warrantyStatus: formData.status,
        technicianNotes: formData.technicianNotes || null,
        resolutionDate: formData.resolutionDate || null,
        updatedBy: user?.id || null,
      }

      // Guardar los cambios
      const response = await fetch(`/api/warranties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error saving warranty")
      }

      // Mostrar mensaje de éxito
      setSuccess(true)

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push("/dashboard/warranties")
      }, 2000)
    } catch (err) {
      setError(err.message || "Error saving warranty")
    } finally {
      setSaving(false)
    }
  }

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true)
      setPdfUrl(null)

      // Llamar a la API para generar el PDF
      const response = await fetch(`/api/pdf/${id}`)

      if (!response.ok) {
        throw new Error("Error generating PDF")
      }

      const data = await response.json()

      // Crear un objeto Blob con los datos de la garantía
      const warrantyJSON = JSON.stringify(warranty, null, 2)
      const blob = new Blob([warrantyJSON], { type: "application/json" })

      // Crear una URL para el blob
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)

      // Descargar automáticamente el archivo
      const a = document.createElement("a")
      a.href = url
      a.download = `warranty-${id}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      console.error("Error generating PDF:", err)
      setError("Error generating PDF")
    } finally {
      setGeneratingPDF(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        text: "Pending"
      },
      approved: {
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        text: "Approved"
      },
      rejected: {
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        text: "Rejected"
      },
      completed: {
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        text: "Completed"
      }
    }

    const config = statusConfig[status] || statusConfig.pending
    return <Badge className={config.className}>{config.text}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border-green-500 dark:border-green-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-green-600 dark:text-green-400">
              Changes Saved Successfully
            </CardTitle>
            <CardDescription className="text-center dark:text-gray-300">
              The warranty has been updated
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center dark:text-gray-300">
            <p className="mb-4">Redirecting to warranty list...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!warranty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border-red-500 dark:border-red-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-red-600 dark:text-red-400">
              Warranty Not Found
            </CardTitle>
            <CardDescription className="text-center dark:text-gray-300">
              The requested warranty could not be found
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard/warranties">
              <Button className="mt-4">
                Return to Warranty List
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Warranty Details
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={handleGeneratePDF}
              disabled={generatingPDF}
              className="flex items-center gap-2"
            >
              {generatingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export PDF
                </>
              )}
            </Button>
            <Link href="/dashboard/warranties">
              <Button variant="outline">Back to List</Button>
            </Link>
          </div>
        </div>

        <Card className="border-t-4 border-blue-500 dark:border-blue-700 shadow-lg">
          <CardHeader className="bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">
                  Warranty #{warranty.id}
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Created on {new Date(warranty.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              {getStatusBadge(warranty.warrantyStatus)}
            </div>
          </CardHeader>

          <CardContent className="bg-white dark:bg-gray-800">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="customer" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer">Customer Information</TabsTrigger>
                <TabsTrigger value="seller">Seller Information</TabsTrigger>
              </TabsList>

              <TabsContent value="customer">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Customer Name</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Customer Phone</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.customerPhone}</p>
                  </div>
                  {warranty.ownerName && (
                    <>
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Owner Name</Label>
                        <p className="text-gray-900 dark:text-white">{warranty.ownerName}</p>
                      </div>
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Owner Phone</Label>
                        <p className="text-gray-900 dark:text-white">{warranty.ownerPhone}</p>
                      </div>
                    </>
                  )}
                  <div className="col-span-2">
                    <Label className="text-gray-700 dark:text-gray-300">Address</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.address}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Brand</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.brand}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Model</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.model}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Serial Number</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.serial}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Purchase Date</Label>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(warranty.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Invoice Number</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.invoiceNumber}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Damaged Part</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.damagedPart}</p>
                  </div>
                  {warranty.damagedPartSerial && (
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">Damaged Part Serial</Label>
                      <p className="text-gray-900 dark:text-white">{warranty.damagedPartSerial}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Damage Date</Label>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(warranty.damageDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-700 dark:text-gray-300">Damage Description</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.damageDescription}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-700 dark:text-gray-300">Customer Signature</Label>
                    <img
                      src={warranty.customerSignature}
                      alt="Customer Signature"
                      className="max-w-sm mt-2 border border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seller">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="crediMemo">Credit Memo</Label>
                      <Input
                        id="crediMemo"
                        name="crediMemo"
                        value={formData.crediMemo}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="replacementPart">Replacement Part</Label>
                      <Input
                        id="replacementPart"
                        name="replacementPart"
                        value={formData.replacementPart}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="replacementSerial">Replacement Serial</Label>
                      <Input
                        id="replacementSerial"
                        name="replacementSerial"
                        value={formData.replacementSerial}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="managementDate">Management Date</Label>
                      <Input
                        id="managementDate"
                        name="managementDate"
                        type="date"
                        value={formData.managementDate}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange("status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resolutionDate">Resolution Date</Label>
                      <Input
                        id="resolutionDate"
                        name="resolutionDate"
                        type="date"
                        value={formData.resolutionDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technicianNotes">Technician Notes</Label>
                    <Textarea
                      id="technicianNotes"
                      name="technicianNotes"
                      value={formData.technicianNotes}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Seller Signature</Label>
                    <SignatureCanvas
                      onSave={handleSellerSignature}
                      className="border border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 