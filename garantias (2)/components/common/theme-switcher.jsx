"use client"

import { useTheme } from "@/providers/theme-provider"
import { useLanguage } from "@/providers/language-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-1 bg-blue-600/20 text-white hover:bg-blue-600/30 border-blue-400/40 dark:bg-blue-800/50 dark:hover:bg-blue-700"
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="sr-only md:not-sr-only md:inline-block">
        {theme === "light" ? t("darkMode") : t("lightMode")}
      </span>
    </Button>
  )
}

