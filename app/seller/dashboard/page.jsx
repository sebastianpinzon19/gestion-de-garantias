"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

export default function SellerDashboardPage() {
  const [warranties, setWarranties] = useState([])
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "seller") {
      router.replace("/login")
      return
    }

    // Load warranties
    fetchWarranties()
  }, [isAuthenticated, user, router])

  const fetchWarranties = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch('/api/warranties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setWarranties(data.warranties)
      }
    } catch (error) {
      console.error('Error fetching warranties:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Seller Dashboard</h1>
        <Link href="/seller/warranties/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Create New Warranty
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Warranties */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Warranties</h2>
          {warranties.length > 0 ? (
            <ul className="space-y-4">
              {warranties.slice(0, 5).map((warranty) => (
                <li key={warranty.id} className="border-b pb-2 last:border-0">
                  <Link href={`/seller/warranties/${warranty.id}`}>
                    <div className="hover:text-blue-600 dark:hover:text-blue-400">
                      <p className="font-medium">{warranty.customerName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Product: {warranty.productName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Status: {warranty.status}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No warranties found</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Warranties</p>
              <p className="text-2xl font-bold text-blue-600">{warranties.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Warranties</p>
              <p className="text-2xl font-bold text-green-600">
                {warranties.filter(w => w.status === 'active').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {warranties.filter(w => w.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 