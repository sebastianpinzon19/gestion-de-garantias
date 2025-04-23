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
              <p className="text-sm opacity-90">Warranty Management System</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Link href="/login">
              <Button variant="secondary" className="mr-2 bg-white/20 text-white hover:bg-white/30 border-white/40">
                Login
              </Button>
            </Link>
            <Link href="/warranty/new">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">New Warranty</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8">
        <Card className="border-t-4 border-blue-500 max-w-6xl mx-auto shadow-xl">
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">New Warranty Request</CardTitle>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Please complete all required fields (*)
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
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} required placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Customer Phone *</Label>
                    <Input id="customerPhone" name="customerPhone" value={formData.customerPhone} onChange={handleChange} required placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name (if different)</Label>
                    <Input id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Enter owner's name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone">Owner Phone</Label>
                    <Input id="ownerPhone" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} placeholder="Enter owner's phone" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="Enter full address" />
                  </div>
                </div>
              </section>

              {/* Product Information */}
              <section className="space-y-6 p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 border-b pb-2">
                  Product Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} required placeholder="Enter brand" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input id="model" name="model" value={formData.model} onChange={handleChange} required placeholder="Enter model" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serial">Serial Number *</Label>
                    <Input id="serial" name="serial" value={formData.serial} onChange={handleChange} required placeholder="Enter serial number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date *</Label>
                    <Input id="purchaseDate" name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                    <Input id="invoiceNumber" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} required placeholder="Enter invoice number" />
                  </div>
                </div>
              </section>

              {/* Damage Information */}
              <section className="space-y-6 p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 border-b pb-2">
                  Damage Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="damagedPart">Damaged Part *</Label>
                    <Input id="damagedPart" name="damagedPart" value={formData.damagedPart} onChange={handleChange} required placeholder="Enter damaged part" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="damagedPartSerial">Damaged Part Serial</Label>
                    <Input id="damagedPartSerial" name="damagedPartSerial" value={formData.damagedPartSerial} onChange={handleChange} placeholder="Enter part serial number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="damageDate">Damage Date *</Label>
                    <Input id="damageDate" name="damageDate" type="date" value={formData.damageDate} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="damageDescription">Damage Description *</Label>
                    <Textarea id="damageDescription" name="damageDescription" value={formData.damageDescription} onChange={handleChange} required placeholder="Describe the damage in detail" />
                  </div>
                </div>
              </section>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
