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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-t-4 border-blue-500">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">New Warranty</CardTitle>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Complete all required fields (*)
            </p>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-4">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Customer Phone *</Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone">Owner Phone</Label>
                    <Input
                      id="ownerPhone"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div>
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-4">
                  Product Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serial">Serial Number *</Label>
                    <Input
                      id="serial"
                      name="serial"
                      value={formData.serial}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date *</Label>
                    <Input
                      id="purchaseDate"
                      name="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                    <Input
                      id="invoiceNumber"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Damage Information */}
              <div>
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-4">
                  Damage Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="damagedPart">Damaged Part *</Label>
                    <Input
                      id="damagedPart"
                      name="damagedPart"
                      value={formData.damagedPart}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="damagedPartSerial">Damaged Part Serial</Label>
                    <Input
                      id="damagedPartSerial"
                      name="damagedPartSerial"
                      value={formData.damagedPartSerial}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="damageDate">Damage Date *</Label>
                    <Input
                      id="damageDate"
                      name="damageDate"
                      type="date"
                      value={formData.damageDate}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="damageDescription">Damage Description *</Label>
                    <Textarea
                      id="damageDescription"
                      name="damageDescription"
                      value={formData.damageDescription}
                      onChange={handleChange}
                      required
                      className="w-full min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="customerSignature">Customer Signature *</Label>
                    <Input
                      id="customerSignature"
                      name="customerSignature"
                      value={formData.customerSignature}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between pt-6 border-t">
                <Link href="/dashboard/warranties">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Saving..." : "Create Warranty"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}