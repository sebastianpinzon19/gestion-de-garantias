"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/providers/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { user, updateUser, isLoading } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      // Validate passwords if changing password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("New passwords do not match")
        }

        if (!formData.currentPassword) {
          throw new Error("Current password is required to set a new password")
        }

        if (formData.newPassword.length < 8) {
          throw new Error("New password must be at least 8 characters long")
        }
      }

      // Prepare data for API
      const dataToSend = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
      }

      if (formData.newPassword) {
        dataToSend.currentPassword = formData.currentPassword
        dataToSend.newPassword = formData.newPassword
      }

      // Update user profile
      const result = await updateUser(dataToSend)

      if (!result.success) {
        throw new Error(result.message || "Failed to update profile")
      }

      // Show success message
      setSuccess("Profile updated successfully")
      toast({
        title: "Success",
        description: "Your profile has been updated successfully",
      })

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (err) {
      setError(err.message || "Failed to update profile")
      toast({
        title: "Error",
        description: err.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-300">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-gray-400">Manage your account information</p>
      </div>

      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
          <CardDescription className="text-gray-400">Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/50 border border-red-800">
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-900/50 border border-green-800">
              <AlertDescription className="text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-700 border-gray-600 text-gray-400"
                />
                <p className="text-xs text-gray-400">Email cannot be changed</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-300">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="border-t border-gray-700 my-6 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-gray-300">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-300">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-300">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <CardFooter className="px-0 pt-4">
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
