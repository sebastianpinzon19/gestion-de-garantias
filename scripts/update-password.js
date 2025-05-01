const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updatePassword() {
  try {
    console.log('Verificando conexión con la base de datos...');
    await prisma.$connect();
    console.log('Conexión exitosa.');

    console.log('Actualizando contraseña para admin@example.com...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.users.update({
      where: { email: 'admin@example.com' },
      data: { password: hashedPassword },
    });

    console.log('Contraseña actualizada correctamente.');
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();