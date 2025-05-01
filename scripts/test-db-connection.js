const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDbConnection() {
  try {
    console.log('Verificando conexión con la base de datos...');
    await prisma.$connect();
    console.log('Conexión exitosa.');

    console.log('Obteniendo estructura de la tabla `users`...');
    const usersTable = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';`;
    console.log('Estructura de la tabla `users`:', usersTable);

    console.log('Obteniendo datos de ejemplo de la tabla `users`...');
    const users = await prisma.users.findMany({ take: 5 });
    console.log('Datos de ejemplo:', users);
  } catch (error) {
    console.error('Error al verificar la conexión o consultar la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDbConnection();