const prisma = require('../lib/prisma.js');

async function seedMenuItems() {
  const menuItems = [
    { name: 'Inicio', link: '/dashboard' },
    { name: 'Usuarios', link: '/dashboard/admin/users' },
    { name: 'Garantías', link: '/dashboard/admin/warranties' },
    { name: 'Configuración', link: '/dashboard/admin/settings' },
  ];

  try {
    for (const item of menuItems) {
      await prisma.menuItem.create({ data: item });
    }
    console.log('Datos de menú insertados correctamente.');
  } catch (error) {
    console.error('Error al insertar datos de menú:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMenuItems();