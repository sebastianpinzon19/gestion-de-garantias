"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { WarrantyCard } from "@/components/WarrantyCard"
import { ErrorMessage } from "@/components/ErrorMessage"
import { Loading } from "@/components/Loading"

export default function Warranties() {
  const [warranties, setWarranties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        const response = await fetch("/api/warranties")
        if (!response.ok) {
          throw new Error("Error al cargar las garantías")
        }
        const data = await response.json()
        setWarranties(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWarranties()
  }, [])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warranties.map((warranty) => (
          <WarrantyCard key={warranty.id} warranty={warranty} />
        ))}
      </div>
      {warranties.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No hay garantías registradas
          </p>
          <Button className="mt-4" href="/warranty-form">
            Registrar Nueva Garantía
          </Button>
        </div>
      )}
    </div>
  )
} 