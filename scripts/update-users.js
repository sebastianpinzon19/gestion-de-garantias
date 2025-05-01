import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUsers() {
  try {
    // Actualizar todos los usuarios
    const users = await prisma.user.findMany();

    console.log(`Found ${users.length} users to update`);

    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          updatedAt: user.createdAt || new Date() // Usar createdAt o la fecha actual
        }
      });
      console.log(`Updated user ${user.email}`);
    }

    console.log('All users updated successfully');
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUsers(); 