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
import { Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import SignatureCanvas from "@/components/forms/signature-canvas"
import { formatDate } from "@/lib/utils"

export default function WarrantyDetailPage({ params }) {
  const { toast } = useToast()
  const router = useRouter()
  const { id } = params
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const [warranty, setWarranty] = useState(null)
  const [formData, setFormData] = useState({
    credi_memo: "",
    replacement_part: "",
    replacement_part_serial: "",
    seller_signature: null,
    management_date: "",
    status: "pending",
    technician_observations: "",
    resolution_date: "",
  })

  useEffect(() => {
    const fetchWarranty = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/warranties/${id}`)

        if (!response.ok) {
          throw new Error("Failed to load warranty details")
        }

        const data = await response.json()
        setWarranty(data)

        // Initialize form with existing data
        setFormData({
          credi_memo: data.credi_memo || "",
          replacement_part: data.replacement_part || "",
          replacement_part_serial: data.replacement_part_serial || "",
          seller_signature: data.seller_signature || null,
          management_date: data.management_date || "",
          status: data.status || "pending",
          technician_observations: data.technician_observations || "",
          resolution_date: data.resolution_date || "",
        })
      } catch (error) {
        console.error("Error loading warranty details:", error)
        setError("Could not load warranty details. Please try again later.")
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

  const handleSignature = (signature) => {
    setFormData((prev) => ({ ...prev, seller_signature: signature }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      // Validate required fields if status is being changed to completed
      if (formData.status === "completed") {
        const requiredFields = ["credi_memo", "replacement_part", "management_date"]
        const missingFields = requiredFields.filter((field) => !formData[field])

        if (missingFields.length > 0 || !formData.seller_signature) {
          throw new Error("Please fill in all required fields and provide your signature")
        }
      }

      // Prepare data for API
      const dataToSend = {
        credi_memo: formData.credi_memo,
        replacement_part: formData.replacement_part,
        replacement_part_serial: formData.replacement_part_serial || null,
        seller_signature: formData.seller_signature,
        management_date: formData.management_date,
        status: formData.status,
        technician_observations: formData.technician_observations || null,
        resolution_date: formData.resolution_date || null,
      }

      // Save changes
      const response = await fetch(`/api/warranties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save changes")
      }

      // Show success message
      setSuccess(true)
      toast({
        title: "Success",
        description: "Warranty has been updated successfully",
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/seller/warranties")
      }, 2000)
    } catch (err) {
      setError(err.message || "Failed to save changes")
      toast({
        title: "Error",
        description: err.message || "Failed to save changes",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true)

      // Call API to generate PDF
      const response = await fetch(`/api/pdf/${id}`)

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      // Create a blob URL and trigger download
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `warranty-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "PDF has been generated and downloaded",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Could not generate PDF. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setGeneratingPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-300">Loading warranty details...</p>
      </div>
    )
  }

  if (error && !warranty) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert variant="destructive" className="bg-red-900/50 border border-red-800">
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (success) {
    return (
      <div className="space-y-6">
        <Alert className="bg-green-900/50 border border-green-800">
          <AlertDescription className="text-green-200">Changes saved successfully!</AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Link href="/seller/warranties">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Return to Warranty List</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900"
          >
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-900"
          >
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Warranty #{warranty.id}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-300">Status:</span>
            {getStatusBadge(warranty.status)}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleGeneratePDF}
            disabled={generatingPDF}
            className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {generatingPDF ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </>
            )}
          </Button>
          <Link href="/seller/warranties">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Back
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-gray-700 bg-gray-800">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-white">Warranty Details</CardTitle>
          <CardDescription className="text-gray-400">View and process warranty request</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/50 border border-red-800">
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger
                value="customer"
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-blue-400 text-gray-300"
              >
                Customer Information
              </TabsTrigger>
              <TabsTrigger
                value="seller"
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-blue-400 text-gray-300"
              >
                Seller Information
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customer" className="space-y-4 mt-4 bg-gray-800 p-4 rounded-md border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-white">Customer Information</h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-gray-300">Customer Name</Label>
                      <p className="text-gray-300 p-2 bg-gray-700 rounded-md">{warranty.customer_name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-300">Customer Phone</Label>
                      <p className="text-gray-300 p-2 bg-gray-700 rounded-md">{warranty.customer_phone}</p>
                    </div>
                    <div>
                      <Label className="text-gray-300">Address</Label>
                      <p className="text-gray-300 p-2 bg-gray-700 rounded-md">{warranty.address}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-white">Product Information</h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-gray-300">Brand</Label>
                      <p className="text-gray-300 p-2 bg-gray-700 rounded-md">{warranty.brand}</p>
                    </div>
                    <div>
                      <Label className="text-gray-300">Model</Label>
                      <p className="text-gray-300 p-2 bg-gray-700 rounded-md">{warranty.model}</p>
                    </div>
                    <div>
                      <Label className="text-gray-300">Serial</Label>
                      <p className="text-gray-300 p-2 bg-gray-700 rounded-md">{warranty.serial}</p>
                    </div>
                    <div>
                      <Label className="text-gray-300">Purchase Date</Label>
                      <p className="text-gray-300 p-2 bg-gray-700 rounded-md">{formatDate(warranty.purchase_date)}</p>
                    </div>
                    <div>
                      <Label className="text-gray-300">Invoice Number</Label>
                      <p className="text-gray-300 p-2 bg-gray-700 rounded-md">{warranty.invoice_number}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-white">Damage Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label className="text-gray-300">Damaged Part</Label>
                    <p className="text-gray-300 p-2 bg-gray-700 rounded-md">{warranty.damaged_part}</p>
                  </div>
                  {warranty.damaged_part_serial && (
                    <div>
                      <Label className="text-gray-300">Damaged Part Serial</Label>
                      <p className="text-gray-300 p-2 bg-gray-700 rounded-md">{warranty.damaged_part_serial}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-300">Damage Date</Label>
                    <p className="text-gray-300 p-2 bg-gray-700 rounded-md">{formatDate(warranty.damage_date)}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Damage Description</Label>
                  <p className="text-gray-300 p-2 bg-gray-700 rounded-md">{warranty.damage_description}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-white">Customer Signature</h3>
                {warranty.customer_signature ? (
                  <div className="p-2 border rounded-md bg-gray-700 border-gray-600">
                    <img
                      src={warranty.customer_signature || "/placeholder.svg"}
                      alt="Customer Signature"
                      className="max-h-32 mx-auto"
                    />
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No signature provided</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="seller" className="space-y-4 mt-4 bg-gray-800 p-4 rounded-md border border-gray-700">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="credi_memo" className="text-gray-300">
                      Credi Memo *
                    </Label>
                    <Input
                      id="credi_memo"
                      name="credi_memo"
                      value={formData.credi_memo}
                      onChange={handleChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="management_date" className="text-gray-300">
                      Management Date *
                    </Label>
                    <Input
                      id="management_date"
                      name="management_date"
                      type="date"
                      value={formData.management_date}
                      onChange={handleChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="replacement_part" className="text-gray-300">
                      Replacement Part *
                    </Label>
                    <Input
                      id="replacement_part"
                      name="replacement_part"
                      value={formData.replacement_part}
                      onChange={handleChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="replacement_part_serial" className="text-gray-300">
                      Replacement Part Serial
                    </Label>
                    <Input
                      id="replacement_part_serial"
                      name="replacement_part_serial"
                      value={formData.replacement_part_serial}
                      onChange={handleChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="status" className="text-gray-300">
                    Warranty Status *
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="technician_observations" className="text-gray-300">
                    Technician Observations
                  </Label>
                  <Textarea
                    id="technician_observations"
                    name="technician_observations"
                    value={formData.technician_observations}
                    onChange={handleChange}
                    rows={4}
                    className="bg-gray-700 border-gray-600 text-white resize-none"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="resolution_date" className="text-gray-300">
                    Resolution Date
                  </Label>
                  <Input
                    id="resolution_date"
                    name="resolution_date"
                    type="date"
                    value={formData.resolution_date}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <Label className="text-gray-300">Seller Signature *</Label>
                  <SignatureCanvas onSave={handleSignature} theme="dark" />
                  {formData.seller_signature && (
                    <div className="mt-2 p-2 border rounded-md bg-gray-700 border-gray-600">
                      <p className="text-sm text-gray-400 mb-1">Your signature:</p>
                      <img
                        src={formData.seller_signature || "/placeholder.svg"}
                        alt="Seller Signature"
                        className="max-h-20 mx-auto"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {saving ? "Saving..." : "Save Changes"}
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
