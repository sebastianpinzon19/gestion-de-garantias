import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ErrorMessage({ message }) {
  return (
    <Alert variant="destructive">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}