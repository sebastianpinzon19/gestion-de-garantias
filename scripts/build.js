const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function runBuild() {
  console.log('🚀 Starting build process...');
  
  // Limpiar directorio de construcción
  const buildDir = path.join(__dirname, '..', 'out');
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
    console.log('🧹 Cleaned previous build directory');
  }

  // Ejecutar construcción de Next.js
  const buildProcess = exec('next build', { 
    env: { ...process.env, NODE_ENV: 'production' },
    maxBuffer: 1024 * 1024 * 10 // 10MB buffer
  });

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
      const outFiles = fs.readdirSync(buildDir);
      console.log('📁 Build artifacts:', outFiles);
    } else {
      console.error(`❌ Build failed with code ${code}`);
    }
  });
}
