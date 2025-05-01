import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    const email = 'admin@warranty.com';
    const newPassword = '123456';

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña del usuario admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword
      }
    });

    console.log(`Contraseña actualizada para el usuario: ${updatedUser.email}`);
    console.log('Nueva contraseña:', newPassword);
    console.log('Hash de la contraseña:', hashedPassword);
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword(); 