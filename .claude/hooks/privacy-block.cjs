// privacy-block.cjs - Protección de privacidad para archivos sensibles

console.error('⛔ Privacy block: Detecting sensitive files');

const path = require('path');
const fs = require('fs');

const projectDir = process.env.OPENCODE_PROJECT_DIR || '.';

// Patrones de nombres de archivos/pastas sensibles
const sensitivePatterns = [
  'password', 'secret', 'key', 'auth', 'token', 'credential',
  '.env', 'config', 'credentials', 'ssh', 'pgp', 'pem',
  'private', 'master', 'dev',
];

// Determinar archivo que se va a leer/editar/escribir
let filePath = '';
try {
  // Leer payload de stdin para obtener path del archivo
  const payload = fs.readFileSync(0, 'utf8');
  
  // Extraer nombres de archivo: buscar strings entre comillas después de "files":[
  const filesArrayStart = payload.indexOf('"files":[');
  if (filesArrayStart !== -1) {
    const afterFiles = payload.substring(filesArrayStart + 7); // +7 para saltar '"files":['
    
    // Buscar primera ocurrencia entre comillas (el primer archivo del array)
    const fileMatch = afterFiles.match(/"([^"]+)"/);
    if (fileMatch && fileMatch[1]) {
      filePath = fileMatch[1];
      console.error(`First file found: ${filePath}`);
    }
  } else {
    console.error('No files array found in payload');
  }
} catch (e) {
  // No hay payload disponible o error al leerlo
}

console.error(`File to process: ${filePath || '(not specified)'}`);

// Verificar si el archivo coincide con patrones sensibles
if (filePath === '' && !process.argv.includes('--skip-path-check')) {
  console.error('⚠️ No file path specified. Applying default privacy rules.');
} else if (!filePath) {
  // Si no hay path en argv pero tampoco en payload, continuar por defecto
  process.exit(0);
}

const isSensitive = sensitivePatterns.some(pattern => 
  filePath.toLowerCase().includes(pattern.toLowerCase())
);

if (isSensitive) {
  console.error(`❌ Sensitive file detected: "${filePath}"`);
  console.error('   Blocked to protect privacy.');
  process.exit(1); // Bloquear operaciones en archivos sensibles
} else {
  console.error('✅ File is not sensitive. Allowing operation.');
  process.exit(0); // Permitir operación segura
}
