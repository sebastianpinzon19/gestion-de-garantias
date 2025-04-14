# Warranty Management System

## Project Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Vercel Account (for deployment)

### Local Development

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Update database connection details
4. Install dependencies:
   ```bash
   npm install
   ```

5. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

### Vercel Deployment

1. Create a Neon PostgreSQL database
2. Update `.env` with Neon connection string
3. Set environment variables in Vercel project settings
4. Deploy to Vercel

### Environment Variables

- `LOCAL_DATABASE_URL`: Local PostgreSQL connection
- `VERCEL_DATABASE_URL`: Neon PostgreSQL connection
- `DATABASE_URL`: Active database connection
- `JWT_SECRET`: Secret for JWT authentication
- `NEXTAUTH_SECRET`: Secret for NextAuth

### Troubleshooting

- Ensure all environment variables are set
- Check database connectivity
- Verify Prisma migration status