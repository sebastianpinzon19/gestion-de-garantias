"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/providers/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye } from "lucide-react"
import Link from "next/link"

export default function AdminWarrantiesPage() {
  const { t } = useLanguage()
  const [warranties, setWarranties] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWarranties = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/warranties?status=${statusFilter}`)
        const data = await response.json()
        setWarranties(data)
      } catch (error) {
        console.error("Error fetching warranties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWarranties()
  }, [statusFilter])

  const filteredWarranties = warranties.filter(
    (warranty) =>
      warranty.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.serial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.credi_memo?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300"
          >
            {t("pending")}
          </Badge>
        )
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300"
          >
            {t("approved")}
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300">
            {t("rejected")}
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-300"
          >
            {status}
          </Badge>
        )
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES").format(date)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("warranties")}</h2>
        <p className="text-muted-foreground">{t("manageWarranties")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("warrantiesList")}</CardTitle>
          <CardDescription>{t("warrantiesListDesc")}</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex items-center flex-1">
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input
                placeholder={t("searchWarranties")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allWarranties")}</SelectItem>
                <SelectItem value="pending">{t("pendingWarranties")}</SelectItem>
                <SelectItem value="approved">{t("approvedWarranties")}</SelectItem>
                <SelectItem value="rejected">{t("rejectedWarranties")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("customer")}</TableHead>
                <TableHead>{t("product")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWarranties.length > 0 ? (
                filteredWarranties.map((warranty) => (
                  <TableRow key={warranty.id}>
                    <TableCell className="font-medium">{warranty.customer_name}</TableCell>
                    <TableCell>
                      {warranty.brand} {warranty.model}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {t("serial")}: {warranty.serial}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(warranty.created_at)}</TableCell>
                    <TableCell>{getStatusBadge(warranty.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/garantias/${warranty.id}`}>
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    {t("noWarrantiesFound")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
