import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

function runBuild() {
  console.log('🚀 Starting build process...');
  
  // Configuración para Vercel
  const isVercel = process.env.VERCEL === '1';
  
  // Configuración de construcción
  const buildOptions = {
    env: { 
      ...process.env, 
      NODE_ENV: 'production',
      ...(isVercel ? { VERCEL: '1' } : {})
    },
    maxBuffer: 1024 * 1024 * 10 // 10MB buffer
  };

  // Comando de construcción
  const buildCommand = isVercel 
    ? 'next build' 
    : 'next build && next export';

  console.log(`🔧 Build mode: ${isVercel ? 'Vercel' : 'Static Export'}`);

  // Ejecutar construcción
  const buildProcess = exec(buildCommand, buildOptions);

  // Manejar la salida del proceso
  buildProcess.stdout.on('data', (data) => {
    console.log(`📦 ${data.trim()}`);
  });

  buildProcess.stderr.on('data', (data) => {
    console.error(`❌ Build Error: ${data.trim()}`);
  });

  // Manejar finalización del proceso
  buildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Build completed successfully');
      
      // Verificar contenido del directorio de construcción
      const buildDir = path.join(process.cwd(), isVercel ? '.next' : 'out');
      
      try {
        const buildFiles = fs.readdirSync(buildDir);
        console.log('📁 Build artifacts:', buildFiles);
      } catch (error) {
        console.error('❌ Error reading build directory:', error);
      }
    } else {
      console.error(`❌ Build failed with code ${code}`);
      process.exit(code);
    }
  });
}

// Ejecutar construcción
runBuild();
