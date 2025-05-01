const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function encryptPasswords() {
  try {
    // Obtener todos los usuarios
    const users = await prisma.users.findMany();

    for (const user of users) {
      // Si la contraseña ya está encriptada, omitir
      if (user.password && user.password.startsWith('$2b$')) {
        console.log(`Contraseña ya encriptada para el usuario: ${user.email}`);
        continue;
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Actualizar la contraseña en la base de datos
      await prisma.users.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      console.log(`Contraseña encriptada para el usuario: ${user.email}`);
    }

    // Asegurarse de que el usuario admin@example.com exista
    const admin = await prisma.users.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        id: String(Date.now()), // Generar un ID único basado en la marca de tiempo
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        password: await bcrypt.hash('admin123', 10),
      },
    });

    console.log(`Usuario admin@example.com configurado correctamente.`);
  } catch (error) {
    console.error('Error al encriptar contraseñas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

encryptPasswords();