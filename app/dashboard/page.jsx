"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  })

  useEffect(() => {
    // Fetch data from API
    const fetchStats = async () => {
      try {
        // In a real application, this would be an API call
        // For now, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 500))

        // This would be the API response
        const response = await fetch("/api/warranties/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          // Fallback to mock data if API fails
          setStats({
            pending: 5,
            approved: 12,
            rejected: 3,
            total: 20,
          })
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Fallback to mock data if API fails
        setStats({
          pending: 5,
          approved: 12,
          rejected: 3,
          total: 20,
        })
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Dashboard</h1>
        <Link href="/dashboard/warranties/new">
          <Button className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600">
            View New Requests
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Warranties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-yellow-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-red-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-blue-700">Recent Activity</CardTitle>
            <CardDescription>Latest warranty requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Warranty #{1000 + item}</h4>
                      <p className="text-sm text-gray-500">Customer: John Doe</p>
                      <p className="text-sm text-gray-500">Product: Refrigerator XYZ-123</p>
                    </div>
                    <div className="text-sm">
                      <span
                        className={`px-2 py-1 rounded-full ${
                          item === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : item === 2
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item === 1 ? "Pending" : item === 2 ? "Approved" : "Rejected"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-yellow-700">Quick Actions</CardTitle>
            <CardDescription>Direct access to common functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/warranties/new">
              <Button variant="outline" className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50">
                View Pending Requests
              </Button>
            </Link>
            <Link href="/warranty/new">
              <Button
                variant="outline"
                className="w-full justify-start border-yellow-200 text-yellow-700 hover:bg-yellow-50"
              >
                Create New Request
              </Button>
            </Link>
            <Link href="/dashboard/warranties/history">
              <Button variant="outline" className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50">
                View Full History
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
