'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SiteHeader() {
  const router = useRouter()

  return (
    <header className="bg-transparent text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a className="flex items-center gap-3" href="/">
          <Image
            alt="SoftwareRP Logo"
            width={50}
            height={50}
            className="rounded-full"
            src="/logo empresa.png"
          />
          <div>
            <h1 className="text-2xl font-bold">SoftwareRP</h1>
            <p className="text-sm opacity-90">Warranty System</p>
          </div>
        </a>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/login')}
            className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-md"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/warranty-form')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md"
          >
              New Warranty
            </button>
        </div>
      </div>
    </header>
  )
}