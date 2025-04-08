"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Importamos los componentes directamente en lugar de usar los hooks
import LanguageSwitcher from "@/components/language-switcher"
import ThemeSwitcher from "@/components/theme-switcher"

export default function HomePage() {
  const [translations, setTranslations] = useState({
    login: "Iniciar Sesión",
    newWarranty: "Nueva Garantía",
    warrantySystem: "Sistema de Garantías",
    description:
      "Digitalice el proceso de gestión de garantías para evitar el uso de papel, permitiendo que los clientes envíen solicitudes y que los vendedores las gestionen fácilmente.",
    forCustomers: "Para Clientes",
    forCustomersDesc:
      "Complete el formulario de garantía para su producto y reciba actualizaciones sobre el estado de su solicitud.",
    requestWarranty: "Solicitar Garantía",
    forSellers: "Para Vendedores",
    forSellersDesc: "Gestione las solicitudes de garantía, actualice su estado y genere documentos PDF.",
    accessDashboard: "Acceder al Panel",
    mainFeatures: "Características Principales",
    digitalForm: "Formulario Digital",
    digitalFormDesc: "Reemplace el papeleo con un formulario digital completo para todas sus necesidades de garantía.",
    efficientManagement: "Gestión Eficiente",
    efficientManagementDesc: "Revise, apruebe o rechace solicitudes de garantía desde un panel centralizado.",
    pdfDocumentation: "Documentación PDF",
    pdfDocumentationDesc: "Genere automáticamente documentos PDF con toda la información de la garantía.",
    allRightsReserved: "Todos los derechos reservados.",
  })
  const [language, setLanguage] = useState("es")
  const router = useRouter()

  // Efecto para cargar el idioma preferido
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedLanguage = localStorage.getItem("preferredLanguage") || "es"
        setLanguage(savedLanguage)

        // Actualizar traducciones si el idioma es inglés
        if (savedLanguage === "en") {
          setTranslations({
            login: "Login",
            newWarranty: "New Warranty",
            warrantySystem: "Warranty System",
            description:
              "Digitize the warranty management process to avoid paper usage, allowing customers to submit requests and sellers to manage them easily.",
            forCustomers: "For Customers",
            forCustomersDesc:
              "Complete the warranty form for your product and receive updates on the status of your request.",
            requestWarranty: "Request Warranty",
            forSellers: "For Sellers",
            forSellersDesc: "Manage warranty requests, update their status, and generate PDF documents.",
            accessDashboard: "Access Dashboard",
            mainFeatures: "Main Features",
            digitalForm: "Digital Form",
            digitalFormDesc: "Replace paperwork with a complete digital form for all your warranty needs.",
            efficientManagement: "Efficient Management",
            efficientManagementDesc: "Review, approve, or reject warranty requests from a centralized dashboard.",
            pdfDocumentation: "PDF Documentation",
            pdfDocumentationDesc: "Automatically generate PDF documents with all warranty information.",
            allRightsReserved: "All rights reserved.",
          })
        }
      } catch (error) {
        console.error("Error loading language preference:", error)
      }
    }
  }, [])

  // Verificar si hay una sesión activa
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        try {
          const user = JSON.parse(userData)
          if (user.role === "admin") {
            router.push("/admin/dashboard")
          } else if (user.role === "seller") {
            router.push("/dashboard")
          }
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-yellow-500 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">GarantíasApp</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Link href="/login">
              <Button variant="secondary" className="mr-2 bg-white/20 text-white hover:bg-white/30 border-white/40">
                {translations.login}
              </Button>
            </Link>
            <Link href="/garantia/nueva">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">{translations.newWarranty}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-300 mb-4">{translations.warrantySystem}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{translations.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-300">
                  {translations.forCustomers}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{translations.forCustomersDesc}</p>
                <Link href="/garantia/nueva">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600">
                    {translations.requestWarranty}
                  </Button>
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-t-4 border-yellow-500 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-yellow-600 dark:text-yellow-300">
                  {translations.forSellers}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{translations.forSellersDesc}</p>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full border-yellow-500 text-yellow-600 dark:text-yellow-300 dark:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-gray-700"
                  >
                    {translations.accessDashboard}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{translations.mainFeatures}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-gray-700 border-blue-100 dark:border-blue-800">
                  <h4 className="text-lg font-medium mb-2 text-blue-700 dark:text-blue-300">
                    {translations.digitalForm}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">{translations.digitalFormDesc}</p>
                </div>
                <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-gray-700 border-yellow-100 dark:border-yellow-800">
                  <h4 className="text-lg font-medium mb-2 text-yellow-700 dark:text-yellow-300">
                    {translations.efficientManagement}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">{translations.efficientManagementDesc}</p>
                </div>
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-gray-700 border-blue-100 dark:border-blue-800">
                  <h4 className="text-lg font-medium mb-2 text-blue-700 dark:text-blue-300">
                    {translations.pdfDocumentation}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">{translations.pdfDocumentationDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-yellow-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} GarantíasApp. {translations.allRightsReserved}
          </p>
        </div>
      </footer>
    </div>
  )
}

