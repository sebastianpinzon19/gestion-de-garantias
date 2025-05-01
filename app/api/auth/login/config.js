// Configuración de variables de entorno con valores por defecto seguros
export const config = {
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:1019983857.@localhost:5432/warranty_db",
    JWT_SECRET: process.env.JWT_SECRET || "Fo^o-pQi%7D$yN+wWJsIGeZKqE^kh388",
    PORT: process.env.PORT || 3001,
    NODE_ENV: process.env.NODE_ENV || "development"
};

// Validación de configuración
export function validateConfig() {
    const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
        console.warn('Using default values for development. DO NOT use these in production!');
    }

    return config;
} 