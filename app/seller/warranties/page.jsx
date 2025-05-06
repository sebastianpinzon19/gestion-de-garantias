"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Search } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export default function WarrantiesPage() {
  const { toast } = useToast()
  const [warranties, setWarranties] = useState([])
  const [filteredWarranties, setFilteredWarranties] = useState([])
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/warranties")

        if (response.ok) {
          const data = await response.json()
          setWarranties(data)
        } else {
          throw new Error("Failed to load warranties")
        }
      } catch (error) {
        console.error("Error fetching warranties:", error)
        toast({
          title: "Error",
          description: "Could not load warranties. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWarranties()
  }, [toast])

  useEffect(() => {
    // Apply filters
    let result = warranties

    // Filter by status
    if (filter !== "all") {
      result = result.filter((w) => w.status === filter)
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (w) =>
          w.customer_name?.toLowerCase().includes(term) ||
          w.brand?.toLowerCase().includes(term) ||
          w.model?.toLowerCase().includes(term) ||
          w.serial?.toLowerCase().includes(term) ||
          w.credi_memo?.toLowerCase().includes(term),
      )
    }

    setFilteredWarranties(result)
  }, [warranties, filter, searchTerm])

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900"
          >
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-900"
          >
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleDownloadPDF = async (id) => {
    try {
      const response = await fetch(`/api/pdf/${id}`)

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      // Create a blob URL and trigger download
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `warranty-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast({
        title: "Error",
        description: "Could not download PDF. Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Warranty Management</h1>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Warranties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="border-gray-600">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warranties</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-2/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by customer, product, serial or credi memo"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-600 bg-gray-700 text-white"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-300">Loading warranties...</p>
            </div>
          ) : filteredWarranties.length > 0 ? (
            <div className="rounded-md border border-gray-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-700">
                  <TableRow>
                    <TableHead className="text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-300">Customer</TableHead>
                    <TableHead className="text-gray-300">Product</TableHead>
                    <TableHead className="text-gray-300">Serial</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarranties.map((warranty) => (
                    <TableRow key={warranty.id} className="hover:bg-gray-700/50 border-gray-700">
                      <TableCell className="text-gray-300">{warranty.id}</TableCell>
                      <TableCell className="text-gray-300">{warranty.customer_name}</TableCell>
                      <TableCell className="text-gray-300">{`${warranty.brand} ${warranty.model}`}</TableCell>
                      <TableCell className="text-gray-300">{warranty.serial}</TableCell>
                      <TableCell className="text-gray-300">{formatDate(warranty.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(warranty.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/seller/warranties/${warranty.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
                            >
                              {warranty.status === "pending" ? "Process" : "View"}
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            onClick={() => handleDownloadPDF(warranty.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-700/30 rounded-md border border-gray-700 p-6">
              <h3 className="text-xl font-medium mb-2 text-gray-300">No warranties found</h3>
              <p className="text-gray-400 text-center">No warranties match your current filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
