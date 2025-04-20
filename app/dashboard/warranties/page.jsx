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

export default function WarrantyManagement() {
  const { toast } = useToast()
  const [warranties, setWarranties] = useState([])
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [filteredWarranties, setFilteredWarranties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/warranties")
        if (!response.ok) {
          throw new Error("Error fetching warranties")
        }
        const data = await response.json()
        setWarranties(data)
      } catch (error) {
        console.error("Error fetching warranties:", error)
        toast({
          title: "Error",
          description: "Could not load warranties",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWarranties()
  }, [toast])

  useEffect(() => {
    let result = warranties

    if (filter !== "all") {
      result = result.filter((w) => w.status === filter)
    }

    if (search) {
      const searchTerm = search.toLowerCase()
      result = result.filter(
        (w) =>
          w.customer_name?.toLowerCase().includes(searchTerm) ||
          w.brand?.toLowerCase().includes(searchTerm) ||
          w.model?.toLowerCase().includes(searchTerm) ||
          w.serial?.toLowerCase().includes(searchTerm) ||
          w.credi_memo?.toLowerCase().includes(searchTerm),
      )
    }

    setFilteredWarranties(result)
  }, [warranties, filter, search])

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Warranty Management</h1>
        <Link href="/warranty/new">
          <Button className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600">
            New Warranty
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="border-blue-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All warranties</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search by customer, product, serial or Credit Memo"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-blue-200"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-700 dark:text-gray-300">Loading warranties...</p>
        </div>
      ) : (
        <div className="rounded-md border border-blue-200">
          <Table>
            <TableHeader className="bg-blue-50">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Credit Memo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWarranties.length > 0 ? (
                filteredWarranties.map((warranty) => (
                  <TableRow key={warranty.id} className="hover:bg-blue-50">
                    <TableCell>{warranty.id}</TableCell>
                    <TableCell>{warranty.customer_name}</TableCell>
                    <TableCell>{`${warranty.brand} ${warranty.model}`}</TableCell>
                    <TableCell>{warranty.serial}</TableCell>
                    <TableCell>{formatDate(warranty.created_at)}</TableCell>
                    <TableCell>{warranty.credi_memo || "-"}</TableCell>
                    <TableCell>{getStatusBadge(warranty.status)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/warranties/${warranty.id}`}>
                        <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    No warranties found with the applied filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

