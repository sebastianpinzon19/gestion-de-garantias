"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import ThemeSwitcher from "@/components/theme-switcher"
import Image from "next/image"

export default function WarrantyFormPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

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
        throw new Error(errorData.message || 'Error creating warranty request')
      }

      setSuccess(true)
      toast({
        title: "Success!",
        description: "Your warranty request has been submitted successfully.",
      })
      
      // Clear form after successful submission
      setFormData({
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
      })
      
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
    <div className="min-h-screen bg-[#0f172a]">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 border-b border-blue-700">
        <div className="px-4 mx-auto">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo empresa.png"
                alt="SoftwareRP Logo"
                width={36}
                height={36}
                className="rounded-full border-2 border-white/20"
              />
              <div>
                <h1 className="text-lg font-bold text-white">SoftwareRP</h1>
                <p className="text-xs text-white/80">Warranty Management</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link href="/warranty-form">
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  New Warranty
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 py-8 bg-[#0f172a]">
        <div className="max-w-4xl mx-auto">
          {success ? (
            <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-green-400 mb-4">Warranty Request Submitted!</h2>
              <p className="text-gray-300 mb-6">
                Your warranty request has been received successfully. Our team will review it shortly.
              </p>
              <Button 
                onClick={() => setSuccess(false)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden">
              <div className="border-b border-gray-800 bg-gray-900/50 px-6 py-4">
                <h1 className="text-xl font-semibold text-white text-center">
                  New Warranty Request
                </h1>
                <p className="text-center text-sm text-gray-400 mt-1">
                  Please fill in all required fields (*)
                </p>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Information */}
                  <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                    <h2 className="text-lg font-medium text-blue-400 mb-4">
                      Customer Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName" className="text-gray-400">Customer Name *</Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone" className="text-gray-400">Phone Number *</Label>
                        <Input
                          id="customerPhone"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ownerName" className="text-gray-400">Owner Name (if different)</Label>
                        <Input
                          id="ownerName"
                          name="ownerName"
                          value={formData.ownerName}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          placeholder="Enter owner name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ownerPhone" className="text-gray-400">Owner Phone</Label>
                        <Input
                          id="ownerPhone"
                          name="ownerPhone"
                          value={formData.ownerPhone}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          placeholder="Enter owner phone"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="text-gray-400">Address *</Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 min-h-[80px]"
                          placeholder="Enter complete address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                    <h2 className="text-lg font-medium text-blue-400 mb-4">
                      Product Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="brand" className="text-gray-400">Brand *</Label>
                        <Input
                          id="brand"
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          placeholder="Enter brand name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model" className="text-gray-400">Model *</Label>
                        <Input
                          id="model"
                          name="model"
                          value={formData.model}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          placeholder="Enter model number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serial" className="text-gray-400">Serial Number *</Label>
                        <Input
                          id="serial"
                          name="serial"
                          value={formData.serial}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          placeholder="Enter serial number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purchaseDate" className="text-gray-400">Purchase Date *</Label>
                        <Input
                          id="purchaseDate"
                          name="purchaseDate"
                          type="date"
                          value={formData.purchaseDate}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="invoiceNumber" className="text-gray-400">Invoice Number *</Label>
                        <Input
                          id="invoiceNumber"
                          name="invoiceNumber"
                          value={formData.invoiceNumber}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          placeholder="Enter invoice number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Damage Information */}
                  <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                    <h2 className="text-lg font-medium text-blue-400 mb-4">
                      Damage Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="damagedPart" className="text-gray-400">Damaged Part *</Label>
                        <Input
                          id="damagedPart"
                          name="damagedPart"
                          value={formData.damagedPart}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          placeholder="Enter damaged part name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="damagedPartSerial" className="text-gray-400">Damaged Part Serial</Label>
                        <Input
                          id="damagedPartSerial"
                          name="damagedPartSerial"
                          value={formData.damagedPartSerial}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          placeholder="Enter damaged part serial"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="damageDate" className="text-gray-400">Damage Date *</Label>
                        <Input
                          id="damageDate"
                          name="damageDate"
                          type="date"
                          value={formData.damageDate}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="damageDescription" className="text-gray-400">Damage Description *</Label>
                        <Textarea
                          id="damageDescription"
                          name="damageDescription"
                          value={formData.damageDescription}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 min-h-[100px]"
                          placeholder="Please describe the damage in detail"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="customerSignature" className="text-gray-400">Customer Signature *</Label>
                        <Input
                          id="customerSignature"
                          name="customerSignature"
                          value={formData.customerSignature}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          placeholder="Type your full name as signature"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-between pt-4">
                    <Link href="/">
                      <Button variant="outline" type="button" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800">
                        Cancel
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]"
                    >
                      {loading ? "Processing..." : "Submit Request"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 