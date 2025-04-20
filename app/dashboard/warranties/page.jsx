"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import WarrantyCard from '@/components/WarrantyCard'
import Loading from '@/components/Loading'
import ErrorMessage from '@/components/ErrorMessage'

export default function WarrantyManagement() {
  const { toast } = useToast()
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const [warranties, setWarranties] = useState([])
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [filteredWarranties, setFilteredWarranties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWarranties = async (status = 'all') => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/warranties?status=${status}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Error al obtener las garantías')
      }

      setWarranties(data.warranties)
      setFilteredWarranties(data.warranties)
    } catch (err) {
      console.error('Error al cargar garantías:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterWarranties = (warranties, term) => {
    if (!term) return warranties
    
    return warranties.filter(warranty => {
      if (!warranty) return false
      
      const searchFields = [
        warranty.customer_name,
        warranty.customer_email,
        warranty.product_name,
        warranty.serial_number,
        warranty.damage_description,
        warranty.status,
      ]

      return searchFields.some(field => 
        field && field.toLowerCase().includes(term.toLowerCase())
      )
    })
  }

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchWarranties(filter)
    } else if (sessionStatus === 'unauthenticated') {
      router.push('/login')
    }
  }, [sessionStatus, filter])

  useEffect(() => {
    setFilteredWarranties(filterWarranties(warranties, search))
  }, [search, warranties])

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (sessionStatus === 'loading' || loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Garantías
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar garantías..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white w-full md:w-64"
          />
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En progreso</option>
            <option value="completed">Completada</option>
            <option value="rejected">Rechazada</option>
          </select>
        </div>
      </div>

      {filteredWarranties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No se encontraron garantías
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWarranties.map((warranty) => (
            <WarrantyCard key={warranty.id} warranty={warranty} />
          ))}
        </div>
      )}
    </div>
  )
}

