#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function vercelBuild() {
  try {
    console.log('Starting Vercel build process...');

    // Verificar variables de entorno
    const requiredEnvVars = [
      'DATABASE_URL', 
      'VERCEL_DATABASE_URL', 
      'LOCAL_DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ];

    requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        console.warn(`⚠️ Warning: ${varName} environment variable is not set`);
      }
    });

    // Generar Prisma Client
    console.log('Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Migrar base de datos (opcional, comentar si no se requiere)
    console.log('Running database migrations...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    } catch (migrationError) {
      console.error('Migration failed, but continuing build:', migrationError.message);
    }

    // Construir la aplicación Next.js
    console.log('Building Next.js application...');
    execSync('next build', { stdio: 'inherit' });

    console.log('✅ Vercel build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

vercelBuild();
