const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyPassword() {
  try {
    console.log('Verificando conexión con la base de datos...');
    await prisma.$connect();
    console.log('Conexión exitosa.');

    console.log('Obteniendo usuario admin@example.com...');
    const user = await prisma.users.findUnique({
      where: { email: 'admin@example.com' },
    });

    if (!user) {
      console.error('El usuario admin@example.com no existe en la base de datos.');
      return;
    }

    console.log('Verificando contraseña...');
    const isPasswordValid = await bcrypt.compare('admin123', user.password);

    if (isPasswordValid) {
      console.log('La contraseña es válida.');
    } else {
      console.error('La contraseña es inválida.');
    }
  } catch (error) {
    console.error('Error al verificar la contraseña:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPassword();