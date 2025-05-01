const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  try {
    // Crear usuario administrador
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: 'admin@example.com',
        name: 'Administrator',
        password: hashedPassword,
        role: 'admin',
        updatedAt: new Date(),
      },
    });

    console.log('Usuario administrador creado:', admin);
  } catch (error) {
    console.error('Error al sembrar la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 