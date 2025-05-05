"use client"

import { useState } from "react"
import { useLanguage } from "@/providers/language-provider"
import { useTheme } from "@/providers/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const { toast } = useToast()

  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Mi Empresa",
    email: "contacto@miempresa.com",
    phone: "+1234567890",
    address: "Calle Principal #123, Ciudad",
    logo: "",
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.ejemplo.com",
    smtpPort: "587",
    smtpUser: "usuario@ejemplo.com",
    smtpPassword: "********",
    fromEmail: "notificaciones@miempresa.com",
    fromName: "Sistema de Garantías",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newWarrantyNotification: true,
    statusChangeNotification: true,
    reminderNotification: false,
    dailySummary: false,
  })

  const handleGeneralChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmailChange = (e) => {
    const { name, value } = e.target
    setEmailSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (name) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const handleSaveSettings = (type) => {
    // En una implementación real, esto enviaría los datos a la API
    toast({
      title: t("settingsSaved"),
      description: t("settingsSavedDesc"),
      variant: "success",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("settings")}</h2>
        <p className="text-muted-foreground">{t("settingsDesc")}</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">{t("general")}</TabsTrigger>
          <TabsTrigger value="email">{t("email")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
          <TabsTrigger value="appearance">{t("appearance")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t("generalSettings")}</CardTitle>
              <CardDescription>{t("generalSettingsDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">{t("companyName")}</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={generalSettings.companyName}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <Input id="phone" name="phone" value={generalSettings.phone} onChange={handleGeneralChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">{t("logo")}</Label>
                  <Input id="logo" name="logo" type="file" accept="image/*" className="cursor-pointer" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">{t("address")}</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralChange}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("general")} className="bg-blue-600 hover:bg-blue-700">
                {t("saveChanges")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>{t("emailSettings")}</CardTitle>
              <CardDescription>{t("emailSettingsDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">{t("smtpServer")}</Label>
                  <Input
                    id="smtpServer"
                    name="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">{t("smtpPort")}</Label>
                  <Input id="smtpPort" name="smtpPort" value={emailSettings.smtpPort} onChange={handleEmailChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">{t("smtpUser")}</Label>
                  <Input id="smtpUser" name="smtpUser" value={emailSettings.smtpUser} onChange={handleEmailChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">{t("smtpPassword")}</Label>
                  <Input
                    id="smtpPassword"
                    name="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={handleEmailChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">{t("fromEmail")}</Label>
                  <Input
                    id="fromEmail"
                    name="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">{t("fromName")}</Label>
                  <Input id="fromName" name="fromName" value={emailSettings.fromName} onChange={handleEmailChange} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("email")} className="bg-blue-600 hover:bg-blue-700">
                {t("saveChanges")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t("notificationSettings")}</CardTitle>
              <CardDescription>{t("notificationSettingsDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("emailNotifications")}</Label>
                  <p className="text-sm text-muted-foreground">{t("emailNotificationsDesc")}</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("newWarrantyNotification")}</Label>
                  <p className="text-sm text-muted-foreground">{t("newWarrantyNotificationDesc")}</p>
                </div>
                <Switch
                  checked={notificationSettings.newWarrantyNotification}
                  onCheckedChange={() => handleNotificationToggle("newWarrantyNotification")}
                  disabled={!notificationSettings.emailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("statusChangeNotification")}</Label>
                  <p className="text-sm text-muted-foreground">{t("statusChangeNotificationDesc")}</p>
                </div>
                <Switch
                  checked={notificationSettings.statusChangeNotification}
                  onCheckedChange={() => handleNotificationToggle("statusChangeNotification")}
                  disabled={!notificationSettings.emailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("reminderNotification")}</Label>
                  <p className="text-sm text-muted-foreground">{t("reminderNotificationDesc")}</p>
                </div>
                <Switch
                  checked={notificationSettings.reminderNotification}
                  onCheckedChange={() => handleNotificationToggle("reminderNotification")}
                  disabled={!notificationSettings.emailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("dailySummary")}</Label>
                  <p className="text-sm text-muted-foreground">{t("dailySummaryDesc")}</p>
                </div>
                <Switch
                  checked={notificationSettings.dailySummary}
                  onCheckedChange={() => handleNotificationToggle("dailySummary")}
                  disabled={!notificationSettings.emailNotifications}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("notifications")} className="bg-blue-600 hover:bg-blue-700">
                {t("saveChanges")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>{t("appearanceSettings")}</CardTitle>
              <CardDescription>{t("appearanceSettingsDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("theme")}</Label>
                <div className="flex gap-4">
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${theme === "light" ? "border-blue-500 bg-blue-50 dark:bg-blue-900" : "border-gray-200 dark:border-gray-700"}`}
                  >
                    <div className="h-24 w-full bg-white border border-gray-200 rounded-md mb-2"></div>
                    <p className="text-center">{t("lightTheme")}</p>
                  </div>
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${theme === "dark" ? "border-blue-500 bg-blue-50 dark:bg-blue-900" : "border-gray-200 dark:border-gray-700"}`}
                  >
                    <div className="h-24 w-full bg-gray-900 border border-gray-700 rounded-md mb-2"></div>
                    <p className="text-center">{t("darkTheme")}</p>
                  </div>
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${theme === "system" ? "border-blue-500 bg-blue-50 dark:bg-blue-900" : "border-gray-200 dark:border-gray-700"}`}
                  >
                    <div className="h-24 w-full bg-gradient-to-r from-white to-gray-900 border border-gray-200 rounded-md mb-2"></div>
                    <p className="text-center">{t("systemTheme")}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">{t("language")}</Label>
                <Select defaultValue="es">
                  <SelectTrigger id="language">
                    <SelectValue placeholder={t("selectLanguage")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">{t("spanish")}</SelectItem>
                    <SelectItem value="en">{t("english")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("appearance")} className="bg-blue-600 hover:bg-blue-700">
                {t("saveChanges")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
