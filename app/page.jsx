"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If user is authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    if (user?.role === "seller") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-6">Welcome to Warranty Management System</h1>
            <div className="space-y-4">
              <Link href="/seller/warranties">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Go to Warranty Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-6">Welcome to Warranty Management System</h1>
            <div className="space-y-4">
              <Link href="/warranty/new">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Submit New Warranty</Button>
              </Link>
              <Link href="/customer/warranties">
                <Button className="w-full bg-gray-700 hover:bg-gray-800">View My Warranties</Button>
              </Link>
            </div>
          </div>
        </div>
      )
    }
  }

  // If not authenticated, show login/register options
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md border-blue-500 dark:border-blue-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Warranty Management System</CardTitle>
          <CardDescription className="text-center">Manage product warranties efficiently</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Link href="/login">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Login</Button>
            </Link>
          </div>
          <div className="space-y-2">
            <Link href="/register">
              <Button variant="outline" className="w-full">
                Register
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            <Link href="/warranty/new">
              <Button variant="outline" className="w-full">
                Submit Warranty (No Account Required)
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
