const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testManualQuery() {
  try {
    console.log('Verificando conexión con la base de datos...');
    await prisma.$connect();
    console.log('Conexión exitosa.');

    console.log('Ejecutando consulta manual en la tabla `users`...');
    const result = await prisma.$queryRaw`SELECT * FROM "users" LIMIT 5;`;
    console.log('Resultado de la consulta:', result);
  } catch (error) {
    console.error('Error al ejecutar la consulta manual:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testManualQuery();