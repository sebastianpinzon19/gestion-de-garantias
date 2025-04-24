"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ThemeSwitcher from "@/components/theme-switcher"
import Image from "next/image"

export default function DashboardPage() {
  const [warranties, setWarranties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWarranties()
  }, [])

  const fetchWarranties = async () => {
    try {
      const response = await fetch('/api/warranties')
      const data = await response.json()
      if (data.success) {
        setWarranties(data.warranties)
      }
    } catch (error) {
      console.error('Error fetching warranties:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo empresa.png"
                  alt="SoftwareRP Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-xl font-bold text-foreground">SoftwareRP</h1>
                  <p className="text-xs text-muted-foreground">Warranty Management</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <Link href="/warranty-form">
                <Button>New Warranty</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Warranty Requests</h2>
          <Link href="/warranty-form">
            <Button>Create New Warranty</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : warranties.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {warranties.map((warranty) => (
              <div
                key={warranty.id}
                className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{warranty.customer_name}</h3>
                    <p className="text-sm text-muted-foreground">{warranty.brand} - {warranty.model}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    warranty.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                    warranty.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' :
                    warranty.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {warranty.status?.charAt(0).toUpperCase() + warranty.status?.slice(1)}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Serial: {warranty.serial}</p>
                  <p>Purchase Date: {new Date(warranty.purchase_date).toLocaleDateString()}</p>
                  <p>Damage Date: {new Date(warranty.damage_date).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href={`/warranty/${warranty.id}`}>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">No warranty requests yet</h3>
            <p className="text-muted-foreground mb-4">Create your first warranty request to get started</p>
            <Link href="/warranty-form">
              <Button>Create Warranty Request</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
