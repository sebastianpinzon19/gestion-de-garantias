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

export default function HistoryPage() {
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
        // Get warranties that are not pending
        const response = await fetch("/api/warranties")

        if (response.ok) {
          const data = await response.json()
          // Filter only warranties that are not pending
          const warrantyHistory = data.filter((w) => w.status !== "pending")
          setWarranties(warrantyHistory)
        } else {
          throw new Error("Error loading warranty history")
        }
      } catch (error) {
        console.error("Error fetching warranty history:", error)
        toast({
          title: "Error",
          description: "Could not load warranty history",
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

    // Filter by search
    if (search.trim() !== "") {
      const searchTerm = search.toLowerCase()
      result = result.filter(
        (w) =>
          w.customer_name?.toLowerCase().includes(searchTerm) ||
          w.brand?.toLowerCase().includes(searchTerm) ||
          w.model?.toLowerCase().includes(searchTerm) ||
          w.serial?.toLowerCase().includes(searchTerm)
      )
    }

    setFilteredWarranties(result)
  }, [warranties, filter, search])

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900"
          >
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900"
          >
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Status</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">History</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="border-blue-200 dark:border-blue-800">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warranties</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search warranties"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-blue-200 dark:border-blue-800"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-700 dark:text-gray-300">Loading History...</p>
        </div>
      ) : filteredWarranties.length > 0 ? (
        <div className="rounded-md border border-blue-200 dark:border-blue-800">
          <Table>
            <TableHeader className="bg-blue-50 dark:bg-blue-900/30">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWarranties.map((warranty) => (
                <TableRow key={warranty.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/10">
                  <TableCell>{warranty.id}</TableCell>
                  <TableCell>{warranty.customer_name}</TableCell>
                  <TableCell>{`${warranty.brand} ${warranty.model}`}</TableCell>
                  <TableCell>{formatDate(warranty.created_at)}</TableCell>
                  <TableCell>{getStatusBadge(warranty.status)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/seller/warranties/${warranty.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800 p-6">
          <h3 className="text-xl font-medium mb-2 text-blue-700 dark:text-blue-400">No Results Found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">No warranties found with the applied filters</p>
        </div>
      )}
    </div>
  )
} 