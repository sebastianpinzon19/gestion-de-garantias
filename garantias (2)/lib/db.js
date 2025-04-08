import { neon } from "@neondatabase/serverless"

// Crear una instancia de cliente SQL reutilizable
const sql = neon(process.env.DATABASE_URL)

export { sql }

