"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { translations } from "@/lib/translations"

const LanguageContext = createContext({
  language: "es",
  setLanguage: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("es")

  // Cargar idioma guardado
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Guardar idioma seleccionado
  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  // Función para traducir textos
  const t = (key) => {
    if (!translations[language] || !translations[language][key]) {
      // Fallback a español si no se encuentra la traducción
      return translations.es[key] || key
    }
    return translations[language][key]
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
