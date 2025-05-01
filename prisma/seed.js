const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Limpiar datos existentes
    await prisma.menuItem.deleteMany();
    await prisma.warranty.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('🧹 Base de datos limpiada');

    // Crear usuarios
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@warranty.com',
        name: 'Admin User',
        role: 'admin',
        password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNuWkW', // 123456
      },
    });

    const techUser = await prisma.user.create({
      data: {
        email: 'tech@warranty.com',
        name: 'Technician User',
        role: 'technician',
        password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNuWkW', // 123456
      },
    });

    console.log('👥 Usuarios creados');

    const now = new Date();

    // Crear garantías de ejemplo
    const warranty1 = await prisma.warranty.create({
      data: {
        id: 'war_1',
        customerName: 'John Doe',
        customerPhone: '555-1234',
        ownerName: 'Jane Doe',
        ownerPhone: '555-5678',
        address: '123 Main St, Anytown, USA',
        brand: 'Samsung',
        model: 'QLED 4K TV',
        serial: 'SN123456',
        purchaseDate: new Date('2023-01-15'),
        invoiceNumber: 'INV001',
        damagedPart: 'Power Supply',
        damagedPartSerial: 'PS123',
        damageDate: new Date('2023-06-20'),
        damageDescription: 'TV not turning on, no power indicator',
        customerSignature: 'signature1',
        warrantyStatus: 'pending',
        updatedAt: now
      },
    });

    const warranty2 = await prisma.warranty.create({
      data: {
        id: 'war_2',
        customerName: 'Mike Smith',
        customerPhone: '555-4321',
        address: '456 Oak Ave, Somewhere, USA',
        brand: 'LG',
        model: 'OLED TV',
        serial: 'SN789012',
        purchaseDate: new Date('2023-02-20'),
        invoiceNumber: 'INV002',
        damagedPart: 'Screen Panel',
        damagedPartSerial: 'SP456',
        damageDate: new Date('2023-07-10'),
        damageDescription: 'Dead pixels in the center of the screen',
        customerSignature: 'signature2',
        warrantyStatus: 'in_progress',
        updatedAt: now
      },
    });

    console.log('📝 Garantías creadas');

    // Crear elementos del menú
    const menuItems = await prisma.menuItem.createMany({
      data: [
        { id: 'menu_1', name: 'Dashboard', link: '/dashboard', icon: 'dashboard', order: 1, role: 'admin' },
        { id: 'menu_2', name: 'Warranties', link: '/warranties', icon: 'warranty', order: 2, role: 'admin' },
        { id: 'menu_3', name: 'Users', link: '/users', icon: 'users', order: 3, role: 'admin' },
        { id: 'menu_4', name: 'Reports', link: '/reports', icon: 'reports', order: 4, role: 'admin' },
        { id: 'menu_5', name: 'Dashboard', link: '/dashboard', icon: 'dashboard', order: 1, role: 'technician' },
        { id: 'menu_6', name: 'Warranties', link: '/warranties', icon: 'warranty', order: 2, role: 'technician' },
        { id: 'menu_7', name: 'My Tasks', link: '/tasks', icon: 'tasks', order: 3, role: 'technician' }
      ],
  });

    console.log('📱 Elementos del menú creados');
    console.log('✅ Seed data created successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
