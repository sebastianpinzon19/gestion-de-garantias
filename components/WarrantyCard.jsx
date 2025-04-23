import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WarrantyCard({ warranty }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{warranty.customerName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Status: {warranty.warrantyStatus}</p>
        <p>Date: {warranty.purchaseDate}</p>
      </CardContent>
    </Card>
  )
}