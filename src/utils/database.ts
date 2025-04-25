import { neon } from "@neondatabase/serverless";

export async function getData() {
    // Asegúrate de que DATABASE_URL esté configurada correctamente en tu archivo .env
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL no está definida en las variables de entorno.");
    }
    const sql = neon(process.env.DATABASE_URL);

    try {
        // Ejecuta una consulta para obtener datos de la tabla "posts"
        const data = await sql`SELECT * FROM posts;`;
        return data;
    } catch (error) {
        console.error("Error al obtener datos:", error);
        throw error;
    }
}