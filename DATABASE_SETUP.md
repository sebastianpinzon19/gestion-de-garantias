# Database Setup Guide

## Local PostgreSQL Setup

1. Install PostgreSQL
2. Open PostgreSQL command-line tool (psql)
3. Run these commands:

```sql
-- Create database
CREATE DATABASE warranty_system;

-- Create user (if not exists)
CREATE USER postgres WITH PASSWORD '1019983857.';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE warranty_system TO postgres;
```

## Prisma Migrations

After setting up the database, run:

```bash
npx prisma migrate dev --name init
```

## Environment Configuration

1. Copy `.env.example` to `.env`
2. Update `DATABASE_URL` with your connection details
3. For Vercel, replace `VERCEL_DATABASE_URL` with your Neon database connection string

## Switching Between Local and Vercel Databases

- Local development: `DATABASE_URL` uses `LOCAL_DATABASE_URL`
- Vercel deployment: Update `DATABASE_URL` to `VERCEL_DATABASE_URL`

## Troubleshooting

- Ensure PostgreSQL is running
- Check database credentials
- Verify network connectivity
