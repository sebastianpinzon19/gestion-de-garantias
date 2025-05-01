const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const prisma = new PrismaClient();

async function runSeed() {
  try {
    const seedFilePath = path.join(__dirname, 'seed-data.sql');
    const seedSQL = fs.readFileSync(seedFilePath, 'utf-8');

    console.log('Ejecutando el script de seed...');

    // Dividir el archivo SQL en sentencias individuales
    const statements = seedSQL.split(';').map(stmt => stmt.trim()).filter(stmt => stmt);

    for (const statement of statements) {
      console.log(`Ejecutando: ${statement}`);
      await prisma.$executeRawUnsafe(statement);
    }

    console.log('Datos insertados correctamente en la base de datos.');
  } catch (error) {
    console.error('Error al ejecutar el script de seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runSeed();