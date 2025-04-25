"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm({ onSubmit, error, isLoading }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <Card className="w-full max-w-md border-t-4 border-blue-500 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-blue-800 dark:text-blue-300">
          Login
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/50 rounded-md border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">Demo Credentials</p>
          <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
            <p>
              <strong>Admin:</strong> admin@example.com / admin123
            </p>
            <p>
              <strong>Seller:</strong> seller@example.com / seller123
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/">
          <Button
            variant="ghost"
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
          >
            Back
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
} 