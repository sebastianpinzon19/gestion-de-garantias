import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  try {
    // Crear algunas garantías de prueba
    const warranties = [
      {
        id: uuidv4(),
        customerName: "John Doe",
        address: "123 Main St, City",
        brand: "Samsung",
        customerPhone: "555-0123",
        customerSignature: "John Doe",
        damageDate: new Date(),
        damageDescription: "Screen not working",
        damagedPart: "Display",
        invoiceNumber: "INV-001",
        model: "Galaxy S21",
        purchaseDate: new Date(2023, 11, 1),
        serial: "SN123456",
        warrantyStatus: "pending"
      },
      {
        id: uuidv4(),
        customerName: "Jane Smith",
        address: "456 Oak Ave, Town",
        brand: "Apple",
        customerPhone: "555-0124",
        customerSignature: "Jane Smith",
        damageDate: new Date(),
        damageDescription: "Battery issues",
        damagedPart: "Battery",
        invoiceNumber: "INV-002",
        model: "iPhone 13",
        purchaseDate: new Date(2023, 10, 15),
        serial: "SN789012",
        warrantyStatus: "approved"
      }
    ];

    for (const warranty of warranties) {
      await prisma.warranty.create({
        data: {
          ...warranty,
          updatedAt: new Date()
        }
      });
    }

    console.log('Warranties seeded successfully');
  } catch (error) {
    console.error('Error seeding warranties:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 