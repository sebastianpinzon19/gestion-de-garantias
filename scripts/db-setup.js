const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Optional: Seed initial data
    const userCount = await prisma.user.count()
    if (userCount === 0) {
      await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
          password: 'hashedpassword' // Use proper password hashing in production
        }
      })
      console.log('🌱 Initial admin user created')
    }
  } catch (error) {
    console.error('❌ Database setup error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
