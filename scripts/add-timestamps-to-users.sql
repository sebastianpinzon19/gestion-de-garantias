-- Agregar columnas createdAt y updatedAt a la tabla users
ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT NOW();