"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import SignatureCanvas from "@/components/forms/signature-canvas"

export default function NuevaGarantia() {
  const { t, language } = useLanguage()
  const { theme } = useTheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("cliente")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // First, add a state to track if the user is a seller
  const [isSeller, setIsSeller] = useState(false)

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    // Sección del cliente
    nombreCliente: "",
    telefonoCliente: "",
    nombreDueno: "",
    direccionCasa: "",
    telefonoDueno: "",
    marcaEquipo: "",
    modeloEquipo: "",
    serialEquipo: "",
    fechaCompra: "",
    numeroFactura: "",
    parteDanada: "",
    serialParteDanada: "",
    fechaDano: "",
    descripcionDano: "",
    firmaCliente: null,

    // Sección del vendedor (inicialmente vacía)
    crediMemo: "",
    parteReemplazo: "",
    serialParteReemplazo: "",
    firmaVendedor: null,
    fechaGestion: "",
    estadoGarantia: "pendiente",
    observacionesTecnico: "",
    fechaResolucion: "",
  })

  // Add useEffect to check if the user is a seller
  useEffect(() => {
    // Check if user is logged in and is a seller
    if (typeof window !== "undefined") {
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          const user = JSON.parse(userData)
          setIsSeller(user.role === "seller" || user.role === "admin")
        } else {
          setIsSeller(false)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        setIsSeller(false)
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClienteSignature = (signature) => {
    setFormData((prev) => ({ ...prev, firmaCliente: signature }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validar campos obligatorios de la sección del cliente
      const camposObligatorios = [
        "nombreCliente",
        "telefonoCliente",
        "direccionCasa",
        "marcaEquipo",
        "modeloEquipo",
        "serialEquipo",
        "fechaCompra",
        "numeroFactura",
        "parteDanada",
        "fechaDano",
        "descripcionDano",
      ]

      const camposFaltantes = camposObligatorios.filter((campo) => !formData[campo])

      if (camposFaltantes.length > 0 || !formData.firmaCliente) {
        throw new Error(t("requiredField"))
      }

      // Simulación de envío - En producción, esto sería una llamada a la API
      const response = await fetch("/api/garantias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(t("errorSubmit"))
      }

      // Simular éxito
      setSuccess(true)

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err) {
      setError(err.message || t("errorSubmit"))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border-green-500 dark:border-green-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-green-600 dark:text-green-400">
              {t("requestSent")}
            </CardTitle>
            <CardDescription className="text-center dark:text-gray-300">{t("requestSentDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="text-center dark:text-gray-300">
            <p className="mb-4">{t("notificationMessage")}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white">
                {t("returnHome")}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("newWarranty")}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t("completeForm")}</p>
        </div>

        <Card className="border-t-4 border-blue-500 dark:border-blue-700 shadow-lg">
          <CardHeader className="bg-white dark:bg-gray-800">
            <CardTitle className="text-gray-900 dark:text-white">{t("warrantyForm")}</CardTitle>
            <CardDescription className="dark:text-gray-300">{t("requiredFields")}</CardDescription>
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700">
                <TabsTrigger
                  value="cliente"
                  className={`${activeTab === "cliente" ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"} transition-colors duration-200`}
                >
                  {t("customerInfo")}
                </TabsTrigger>
                <TabsTrigger
                  value="vendedor"
                  disabled={!formData.firmaCliente || !isSeller}
                  className={`${activeTab === "vendedor" ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"} transition-colors duration-200 ${!formData.firmaCliente || !isSeller ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {t("sellerInfo")}
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="cliente"
                className="space-y-4 mt-4 bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700"
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (formData.firmaCliente) {
                      if (isSeller) {
                        setActiveTab("vendedor")
                      } else {
                        handleSubmit(e)
                      }
                    } else {
                      setError(t("requiredField"))
                    }
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombreCliente" className="text-gray-700 dark:text-gray-300">
                        {t("customerName")} *
                      </Label>
                      <Input
                        id="nombreCliente"
                        name="nombreCliente"
                        value={formData.nombreCliente}
                        onChange={handleChange}
                        required
                        className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefonoCliente" className="text-gray-700 dark:text-gray-300">
                        {t("customerPhone")} *
                      </Label>
                      <Input
                        id="telefonoCliente"
                        name="telefonoCliente"
                        value={formData.telefonoCliente}
                        onChange={handleChange}
                        required
                        className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombreDueno" className="text-gray-700 dark:text-gray-300">
                        {t("ownerName")}
                      </Label>
                      <Input
                        id="nombreDueno"
                        name="nombreDueno"
                        value={formData.nombreDueno}
                        onChange={handleChange}
                        className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefonoDueno" className="text-gray-700 dark:text-gray-300">
                        {t("ownerPhone")}
                      </Label>
                      <Input
                        id="telefonoDueno"
                        name="telefonoDueno"
                        value={formData.telefonoDueno}
                        onChange={handleChange}
                        className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="direccionCasa" className="text-gray-700 dark:text-gray-300">
                      {t("address")} *
                    </Label>
                    <Input
                      id="direccionCasa"
                      name="direccionCasa"
                      value={formData.direccionCasa}
                      onChange={handleChange}
                      required
                      className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="marcaEquipo" className="text-gray-700 dark:text-gray-300">
                        {t("brand")} *
                      </Label>
                      <Input
                        id="marcaEquipo"
                        name="marcaEquipo"
                        value={formData.marcaEquipo}
                        onChange={handleChange}
                        required
                        className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modeloEquipo" className="text-gray-700 dark:text-gray-300">
                        {t("model")} *
                      </Label>
                      <Input
                        id="modeloEquipo"
                        name="modeloEquipo"
                        value={formData.modeloEquipo}
                        onChange={handleChange}
                        required
                        className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serialEquipo" className="text-gray-700 dark:text-gray-300">
                        {t("serial")} *
                      </Label>
                      <Input
                        id="serialEquipo"
                        name="serialEquipo"
                        value={formData.serialEquipo}
                        onChange={handleChange}
                        required
                        className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="fechaCompra" className="text-gray-700 dark:text-gray-300">
                        {t("purchaseDate")} *
                      </Label>
                      <Input
                        id="fechaCompra"
                        name="fechaCompra"
                        type="date"
                        value={formData.fechaCompra}
                        onChange={handleChange}
                        required
                        className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numeroFactura" className="text-gray-700 dark:text-gray-300">
                        {t("invoiceNumber")} *
                      </Label>
                      <Input
                        id="numeroFactura"
                        name="numeroFactura"
                        value={formData.numeroFactura}
                        onChange={handleChange}
                        required
                        className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="parteDanada" className="text-gray-700 dark:text-gray-300">
                        {t("damagedPart")} *
                      </Label>
                      <Input
                        id="parteDanada"
                        name="parteDanada"
                        value={formData.parteDanada}
                        onChange={handleChange}
                        required
                        className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serialParteDanada" className="text-gray-700 dark:text-gray-300">
                        {t("damagedPartSerial")}
                      </Label>
                      <Input
                        id="serialParteDanada"
                        name="serialParteDanada"
                        value={formData.serialParteDanada}
                        onChange={handleChange}
                        className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fechaDano" className="text-gray-700 dark:text-gray-300">
                        {t("damageDate")} *
                      </Label>
                      <Input
                        id="fechaDano"
                        name="fechaDano"
                        type="date"
                        value={formData.fechaDano}
                        onChange={handleChange}
                        required
                        className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="descripcionDano" className="text-gray-700 dark:text-gray-300">
                      {t("damageDescription")} *
                    </Label>
                    <Textarea
                      id="descripcionDano"
                      name="descripcionDano"
                      value={formData.descripcionDano}
                      onChange={handleChange}
                      rows={4}
                      required
                      className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 text-gray-900 dark:text-white resize-none"
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label className="text-gray-700 dark:text-gray-300">{t("customerSignature")} *</Label>
                    <SignatureCanvas onSave={handleClienteSignature} theme={theme} />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white"
                    >
                      {isSeller ? t("continueButton") : t("sendRequest")}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent
                value="vendedor"
                className="space-y-4 mt-4 bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700"
              >
                {isSeller ? (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md mb-4">
                      <p className="text-sm text-blue-600 dark:text-blue-300">{t("sellerSection")}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                      {/* Seller form fields */}
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

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setActiveTab("cliente")}
                          className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
                        >
                          {t("back")}
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white"
                        >
                          {loading ? t("loading") : t("sendRequest")}
                        </Button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 dark:bg-yellow-900 rounded-md border border-yellow-200 dark:border-yellow-800">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                        {t("onlyForSellers")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">{t("sellerSection")}</p>
                    </div>
                    <Link href="/login">
                      <Button className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white">
                        {t("login")}
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
