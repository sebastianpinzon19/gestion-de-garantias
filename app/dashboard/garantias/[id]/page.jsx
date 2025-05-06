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
import { useLanguage } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"
import { Download, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import SignatureCanvas from "@/components/forms/signature-canvas"

export default function DetalleGarantia({ params }) {
  const { t } = useLanguage()
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
  const [garantia, setGarantia] = useState(null)
  const [formData, setFormData] = useState({
    crediMemo: "",
    parteReemplazo: "",
    serialParteReemplazo: "",
    firmaVendedor: null,
    fechaGestion: "",
    status: "pending",
    observacionesTecnico: "",
    fechaResolucion: "",
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
    const fetchGarantia = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/garantias/${id}`)

        if (!response.ok) {
          throw new Error(t("errorLoadingData"))
        }

        const data = await response.json()
        setGarantia(data)

        // Inicializar el formulario con los datos existentes
        setFormData({
          crediMemo: data.crediMemo || "",
          parteReemplazo: data.parteReemplazo || "",
          serialParteReemplazo: data.serialParteReemplazo || "",
          firmaVendedor: data.firmaVendedor || null,
          fechaGestion: data.fechaGestion || "",
          status: data.estadoGarantia || "pending",
          observacionesTecnico: data.observacionesTecnico || "",
          fechaResolucion: data.fechaResolucion || "",
        })
      } catch (err) {
        console.error("Error al cargar los datos:", err)
        setError(t("errorLoadingData"))
      } finally {
        setLoading(false)
      }
    }

    fetchGarantia()
  }, [id, t])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleVendedorSignature = (signature) => {
    setFormData((prev) => ({ ...prev, firmaVendedor: signature }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      // Validar campos obligatorios de la sección del vendedor
      if (formData.status !== "pending") {
        const camposObligatorios = ["crediMemo", "parteReemplazo", "fechaGestion"]
        const camposFaltantes = camposObligatorios.filter((campo) => !formData[campo])

        if (camposFaltantes.length > 0 || !formData.firmaVendedor) {
          throw new Error(t("requiredField"))
        }
      }

      // Preparar datos para enviar a la API
      const dataToSend = {
        crediMemo: formData.crediMemo,
        parteReemplazo: formData.parteReemplazo,
        serialParteReemplazo: formData.serialParteReemplazo || null,
        firmaVendedor: formData.firmaVendedor,
        fechaGestion: formData.fechaGestion,
        estadoGarantia: formData.status,
        observacionesTecnico: formData.observacionesTecnico || null,
        fechaResolucion: formData.fechaResolucion || null,
        updated_by: user?.id || null,
      }

      // Guardar los cambios
      const response = await fetch(`/api/garantias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.mensaje || t("errorSave"))
      }

      // Mostrar mensaje de éxito
      setSuccess(true)

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push("/dashboard/garantias")
      }, 2000)
    } catch (err) {
      setError(err.message || t("errorSave"))
    } finally {
      setSaving(false)
    }
  }

  const handleGenerarPDF = async () => {
    try {
      setGeneratingPDF(true)
      setPdfUrl(null)

      // Llamar a la API para generar el PDF
      const response = await fetch(`/api/pdf/${id}`)

      if (!response.ok) {
        throw new Error(t("pdfError"))
      }

      const data = await response.json()

      // Crear un objeto Blob con los datos de la garantía
      const garantiaJSON = JSON.stringify(garantia, null, 2)
      const blob = new Blob([garantiaJSON], { type: "application/json" })

      // Crear una URL para el blob
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)

      // Descargar automáticamente el archivo
      const a = document.createElement("a")
      a.href = url
      a.download = `garantia-${id}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      console.error("Error al generar PDF:", err)
      setError(t("pdfError"))
    } finally {
      setGeneratingPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-700 dark:text-gray-300">{t("loadingWarrantyDetails")}</p>
      </div>
    )
  }

  if (error && !garantia) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800">
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (success) {
    return (
      <div className="space-y-6">
        <Alert className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800">
          <AlertDescription className="text-green-800 dark:text-green-200">{t("changesSaved")}</AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Link href="/dashboard/garantias">
            <Button className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white">
              {t("returnToWarrantyList")}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-900"
          >
            {t("pending")}
          </Badge>
        )
      case "aprobada":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900"
          >
            {t("approved")}
          </Badge>
        )
      case "rechazada":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900"
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("warrantyDetails")} #{garantia.id}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-700 dark:text-gray-300">{t("status")}:</span>
            {getEstadoBadge(garantia.estadoGarantia)}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleGenerarPDF}
            disabled={generatingPDF}
            className="flex items-center gap-2 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            {generatingPDF ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 dark:border-blue-400 border-t-transparent dark:border-t-transparent rounded-full"></div>
                <span>{t("pdfGenerating")}</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>{t("downloadPDF")}</span>
              </>
            )}
          </Button>
          <Link href="/dashboard/garantias">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {t("back")}
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-gray-200 dark:border-gray-700 shadow-md">
        <CardHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-gray-900 dark:text-white">{t("warrantyDetails")}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">{t("warrantyForm")}</CardDescription>
        </CardHeader>
        <CardContent className="bg-white dark:bg-gray-800">
          {error && (
            <Alert
              variant="destructive"
              className="mb-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800"
            >
              <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {pdfUrl && (
            <Alert className="mb-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <AlertDescription className="text-green-800 dark:text-green-200">{t("pdfReady")}</AlertDescription>
              </div>
            </Alert>
          )}

          <Tabs defaultValue="cliente" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700">
              <TabsTrigger
                value="cliente"
                className="data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:text-blue-600 data-[state=active]:dark:text-blue-400 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              >
                {t("customerInfo")}
              </TabsTrigger>
              <TabsTrigger
                value="vendedor"
                className="data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:text-blue-600 data-[state=active]:dark:text-blue-400 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              >
                {t("sellerInfo")}
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="cliente"
              className="space-y-4 mt-4 bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">{t("customerInfo")}</h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">{t("customerName")}</Label>
                      <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        {garantia.nombreCliente}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">{t("customerPhone")}</Label>
                      <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        {garantia.telefonoCliente}
                      </p>
                    </div>
                    {garantia.nombreDueno && (
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">{t("ownerName")}</Label>
                        <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                          {garantia.nombreDueno}
                        </p>
                      </div>
                    )}
                    {garantia.telefonoDueno && (
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">{t("ownerPhone")}</Label>
                        <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                          {garantia.telefonoDueno}
                        </p>
                      </div>
                    )}
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">{t("address")}</Label>
                      <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        {garantia.direccionCasa}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">{t("equipmentInfo")}</h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">{t("brand")}</Label>
                      <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        {garantia.marcaEquipo}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">{t("model")}</Label>
                      <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        {garantia.modeloEquipo}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">{t("serial")}</Label>
                      <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        {garantia.serialEquipo}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">{t("purchaseDate")}</Label>
                      <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        {garantia.fechaCompra}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">{t("invoiceNumber")}</Label>
                      <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        {garantia.numeroFactura}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">{t("damageInfo")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">{t("damagedPart")}</Label>
                    <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {garantia.parteDanada}
                    </p>
                  </div>
                  {garantia.serialParteDanada && (
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">{t("damagedPartSerial")}</Label>
                      <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        {garantia.serialParteDanada}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">{t("damageDate")}</Label>
                    <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {garantia.fechaDano}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">{t("damageDescription")}</Label>
                  <p className="text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {garantia.descripcionDano}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">{t("customerSignature")}</h3>
                {garantia.firmaCliente ? (
                  <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                    <img
                      src={garantia.firmaCliente || "/placeholder.svg"}
                      alt={t("customerSignature")}
                      className="max-h-32 mx-auto"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">{t("noSignature")}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="vendedor"
              className="space-y-4 mt-4 bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700"
            >
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="crediMemo" className="text-gray-700 dark:text-gray-300">
                      {t("crediMemo")} *
                    </Label>
                    <Input
                      id="crediMemo"
                      name="crediMemo"
                      value={formData.crediMemo}
                      onChange={handleChange}
                      className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaGestion" className="text-gray-700 dark:text-gray-300">
                      {t("managementDate")} *
                    </Label>
                    <Input
                      id="fechaGestion"
                      name="fechaGestion"
                      type="date"
                      value={formData.fechaGestion}
                      onChange={handleChange}
                      className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="parteReemplazo" className="text-gray-700 dark:text-gray-300">
                      {t("replacementPart")} *
                    </Label>
                    <Input
                      id="parteReemplazo"
                      name="parteReemplazo"
                      value={formData.parteReemplazo}
                      onChange={handleChange}
                      className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serialParteReemplazo" className="text-gray-700 dark:text-gray-300">
                      {t("replacementPartSerial")}
                    </Label>
                    <Input
                      id="serialParteReemplazo"
                      name="serialParteReemplazo"
                      value={formData.serialParteReemplazo}
                      onChange={handleChange}
                      className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">
                    {t("warrantyStatus")} *
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder={t("selectStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t("pending")}</SelectItem>
                      <SelectItem value="approved">{t("approved")}</SelectItem>
                      <SelectItem value="rejected">{t("rejected")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="observacionesTecnico" className="text-gray-700 dark:text-gray-300">
                    {t("technicianObservations")}
                  </Label>
                  <Textarea
                    id="observacionesTecnico"
                    name="observacionesTecnico"
                    value={formData.observacionesTecnico}
                    onChange={handleChange}
                    rows={4}
                    className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white resize-none"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="fechaResolucion" className="text-gray-700 dark:text-gray-300">
                    {t("resolutionDate")}
                  </Label>
                  <Input
                    id="fechaResolucion"
                    name="fechaResolucion"
                    type="date"
                    value={formData.fechaResolucion}
                    onChange={handleChange}
                    className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <Label className="text-gray-700 dark:text-gray-300">{t("sellerSignature")} *</Label>
                  <SignatureCanvas onSave={handleVendedorSignature} theme={theme} />
                  {formData.firmaVendedor && (
                    <div className="mt-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t("sellerSignature")}:</p>
                      <img
                        src={formData.firmaVendedor || "/placeholder.svg"}
                        alt={t("sellerSignature")}
                        className="max-h-20 mx-auto"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white"
                  >
                    {saving ? t("saving") : t("save")}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

