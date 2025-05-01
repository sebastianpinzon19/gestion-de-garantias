const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Elementos del menú para administradores
    const adminMenuItems = [
      {
        name: 'Dashboard',
        link: '/dashboard',
        icon: 'dashboard',
        order: 1,
        role: 'admin',
      },
      {
        name: 'Warranties',
        link: '/dashboard/warranties',
        icon: 'warranty',
        order: 2,
        role: 'admin',
      },
      {
        name: 'Users',
        link: '/dashboard/users',
        icon: 'users',
        order: 3,
        role: 'admin',
      },
      {
        name: 'Settings',
        link: '/dashboard/settings',
        icon: 'settings',
        order: 4,
        role: 'admin',
      },
    ];

    // Elementos del menú para vendedores
    const sellerMenuItems = [
      {
        name: 'Dashboard',
        link: '/dashboard',
        icon: 'dashboard',
        order: 1,
        role: 'seller',
      },
      {
        name: 'My Warranties',
        link: '/dashboard/my-warranties',
        icon: 'warranty',
        order: 2,
        role: 'seller',
      },
    ];

    // Crear elementos del menú
    await prisma.menuItem.createMany({
      data: [...adminMenuItems, ...sellerMenuItems],
    });

    console.log('Elementos del menú creados exitosamente');
  } catch (error) {
    console.error('Error al sembrar los elementos del menú:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 