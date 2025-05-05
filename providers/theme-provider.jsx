"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light")

  // Cargar tema guardado
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else if (prefersDark) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Cambiar tema
  const changeTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  // Alternar entre temas
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    changeTheme(newTheme)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: changeTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
