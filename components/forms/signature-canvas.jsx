'use client'

import { useRef } from 'react'
import SignaturePad from 'react-signature-canvas'
import { Button } from "@/components/ui/button"

export default function SignatureCanvas({ onSave }) {
  const sigPad = useRef()

  const clear = () => {
    sigPad.current.clear()
  }

  const save = () => {
    if (!sigPad.current.isEmpty()) {
      const signature = sigPad.current.toDataURL()
      onSave(signature)
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
      <SignaturePad
        ref={sigPad}
        canvasProps={{
          className: "w-full h-40 border rounded bg-white"
        }}
      />
      <div className="flex gap-2 mt-2">
        <Button variant="outline" onClick={clear}>Limpiar</Button>
        <Button onClick={save}>Guardar Firma</Button>
      </div>
    </div>
  )
}

