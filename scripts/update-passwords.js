const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Hashear la contraseña del admin
    const adminPassword = await bcrypt.hash('123456', 10);
    console.log('Admin password hash:', adminPassword);
    
    const admin = await prisma.user.update({
      where: { email: 'admin@warranty.com' },
      data: { password: adminPassword }
    });
    console.log('✅ Contraseña del admin actualizada');
    console.log('Admin actualizado:', {
      email: admin.email,
      passwordHash: admin.password
    });

    // Hashear la contraseña del técnico
    const techPassword = await bcrypt.hash('123456', 10);
    console.log('Tech password hash:', techPassword);
    
    const tech = await prisma.user.update({
      where: { email: 'tech@warranty.com' },
      data: { password: techPassword }
    });
    console.log('✅ Contraseña del técnico actualizada');
    console.log('Técnico actualizado:', {
      email: tech.email,
      passwordHash: tech.password
    });

  } catch (error) {
    console.error('Error actualizando contraseñas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 