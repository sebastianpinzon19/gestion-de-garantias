"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"

export default function SignatureCanvas({ onSave, theme }) {
  // Usar el hook con manejo de errores
  const languageContext = useLanguage()
  // Extraer t con un valor predeterminado en caso de que el contexto no esté listo
  const t = languageContext?.t || ((key) => key)

  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)

  // Efecto para configurar el canvas con el color correcto según el tema
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Configurar el fondo según el tema
    ctx.fillStyle = theme === "dark" ? "#374151" : "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dibujar un borde para indicar el área de firma
    ctx.strokeStyle = theme === "dark" ? "#6B7280" : "#E5E7EB"
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    setHasSigned(false)
  }, [theme])

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()

    // Ajustar coordenadas para dispositivos táctiles o ratón
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0)
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0)

    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()

    // Ajustar coordenadas para dispositivos táctiles o ratón
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0)
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0)

    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.strokeStyle = theme === "dark" ? "#ffffff" : "#000000"

    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSigned(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Configurar el fondo según el tema
    ctx.fillStyle = theme === "dark" ? "#374151" : "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dibujar un borde para indicar el área de firma
    ctx.strokeStyle = theme === "dark" ? "#6B7280" : "#E5E7EB"
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    setHasSigned(false)
  }

  const saveSignature = () => {
    if (!hasSigned || !canvasRef.current) return

    const canvas = canvasRef.current
    try {
      const signatureData = canvas.toDataURL("image/png")
      onSave(signatureData)
    } catch (error) {
      console.error("Error saving signature:", error)
    }
  }

  return (
    <div className="space-y-2">
      <Card className="p-1 border-2 border-dashed border-gray-300 dark:border-gray-600">
        <canvas
          ref={canvasRef}
          width={500}
          height={150}
          className="w-full rounded-md touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </Card>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={clearCanvas}
          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {t("clearSignature")}
        </Button>
        <Button
          type="button"
          onClick={saveSignature}
          disabled={!hasSigned}
          className={`bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white ${!hasSigned ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {t("saveSignature")}
        </Button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{t("signatureInstructions")}</p>
    </div>
  )
}
