import { PrismaClient } from '@prisma/client';

<<<<<<< HEAD
const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
=======
// Crear una instancia de cliente SQL reutilizable
export const sql = neon(process.env.DATABASE_URL)
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f

// Función para ejecutar consultas SQL
export async function executeQuery(query, params = []) {
  try {
    const result = await sql.query(query, params)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
