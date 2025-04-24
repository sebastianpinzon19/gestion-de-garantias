import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h2 className="text-4xl font-bold mb-4">404 - Página no encontrada</h2>
      <p className="text-xl text-muted-foreground mb-8">
        Lo sentimos, la página que buscas no existe.
      </p>
      <Link href="/">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  )
} 