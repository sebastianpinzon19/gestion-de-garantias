"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { translations } from "@/lib/translations"

// Crear el contexto con un valor predeterminado
const defaultContextValue = {
  language: "es",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => {
    // Proporcionar una traducción predeterminada incluso antes de que el contexto esté listo
    const defaultLang = "es"
    if (!translations[defaultLang][key]) {
      return key
    }
    return translations[defaultLang][key]
  },
}

const LanguageContext = createContext(defaultContextValue)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("es")
  const [mounted, setMounted] = useState(false)

  // Cargar preferencia de idioma del localStorage al iniciar
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      try {
        const savedLanguage = localStorage.getItem("preferredLanguage") || "es"
        setLanguage(savedLanguage)
      } catch (error) {
        console.error("Error loading language preference:", error)
      }
    }
  }, [])

  // Guardar preferencia de idioma en localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && mounted) {
      try {
        localStorage.setItem("preferredLanguage", language)
      } catch (error) {
        console.error("Error saving language preference:", error)
      }
    }
  }, [language, mounted])

  const t = (key) => {
    if (!translations[language] || !translations[language][key]) {
      // console.warn(`Translation missing for key: ${key} in language: ${language}`)
      return key
    }
    return translations[language][key]
  }

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "es" ? "en" : "es"))
  }

  const contextValue = {
    language,
    setLanguage,
    toggleLanguage,
    t,
  }

  // Evitar problemas de hidratación renderizando solo cuando el componente está montado
  if (!mounted) {
    return <>{children}</>
  }

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    console.error("useLanguage must be used within a LanguageProvider")
    // Devolver un valor predeterminado para evitar errores
    return defaultContextValue
  }
  return context
}

