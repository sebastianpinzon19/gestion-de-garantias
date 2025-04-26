#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function vercelBuild() {
  try {
    console.log('🚀 Starting Vercel build process...');

    // Verificar variables de entorno
    const requiredEnvVars = [
      'DATABASE_URL', 
      'VERCEL_DATABASE_URL', 
      'LOCAL_DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ];

    let missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
      process.exit(1);
    }

    // Verificar existencia de archivos de configuración
    const configFiles = [
      'prisma/schema.prisma',
      'next.config.js',
      'package.json'
    ];

    configFiles.forEach(file => {
      if (!fs.existsSync(path.resolve(process.cwd(), file))) {
        console.error(`❌ Missing configuration file: ${file}`);
        process.exit(1);
      }
    });

    // Instalar dependencias
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Generar Prisma Client
    console.log('🔧 Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Migrar base de datos (opcional)
    console.log('💾 Running database migrations...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    } catch (migrationError) {
      console.warn('⚠️ Migration failed, but continuing build:', migrationError.message);
    }

    // Construir la aplicación Next.js
    console.log('🏗️ Building Next.js application...');
    execSync('next build', { stdio: 'inherit' });

    // Verificar directorio de construcción
    const buildDir = path.resolve(process.cwd(), '.next');
    if (!fs.existsSync(buildDir)) {
      console.error('❌ Build directory not created');
      process.exit(1);
    }

    console.log('✅ Vercel build completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect(); // Cleanup PrismaClient
  }
}

vercelBuild();
