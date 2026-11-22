// descriptive-name.cjs - Asignar nombres descriptivos a archivos editados

console.log('📝 Assigning descriptive names to files...');

const path = require('path');
const fs = require('fs');

const projectDir = process.env.OPENCODE_PROJECT_DIR || '.';
const hooksDir = path.join(projectDir, '.claude', 'hooks');

// Leer contenido del archivo que se va a escribir
let payload = '';
try {
  payload = fs.readFileSync(0, 'utf8');
} catch (e) {
  // Si no hay input en stdin, no hacer nada
}

// Extraer nombre de archivo de metadata si está disponible
const fileNameMatch = payload.match(/"filename":"([^"]+)"/);
const fileName = fileNameMatch ? fileNameMatch[1] : 'unnamed';

console.log(`Processing file: ${fileName}`);

// Generar nombre descriptivo basado en contenido y tipo
let descriptiveName = '';

try {
  // Determinar extensión
  const ext = path.extname(fileName).toLowerCase();
  
  // Mapeo de extensiones a tipos descriptivos
  const typeMap = {
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.jsx': 'React Component',
    '.tsx': 'React+TS Component',
    '.json': 'JSON Config/Data',
    '.jsonc': 'JSON Config (VSCode)',
    '.md': 'Markdown Doc',
    '.mdx': 'MDX Doc',
    '.css': 'Stylesheet',
    '.scss': 'SCSS Styles',
    '.html': 'HTML Page',
    '.vue': 'Vue Component',
    '.svelte': 'Svelte Component',
    '.yaml': 'YAML Config',
    '.yml': 'YAML Config',
  };
  
  const fileType = typeMap[ext] || path.basename(fileName);
  
  // Generar nombre descriptivo simple
  descriptiveName = `${fileType}: ${fileName}`;
  
  console.log(`📋 Descriptive name: "${descriptiveName}"`);
  
} catch (e) {
  console.error('⚠️ Could not generate descriptive name:', e.message);
  descriptiveName = fileName;
}

// Guardar nombre descriptivo en un archivo opcional para referencia posterior
const metadataDir = path.join(projectDir, '.claude', 'hooks', 'metadata');
if (!fs.existsSync(metadataDir)) {
  fs.mkdirSync(metadataDir, { recursive: true });
}

const metadataPath = path.join(metadataDir, `${fileName}.meta`);
try {
  // Guardar nombre descriptivo si queremos persistirlo
  fs.writeFileSync(metadataPath, JSON.stringify({
    fileName,
    descriptiveName,
    timestamp: Date.now(),
  }, null, 2));
} catch (e) {
  console.error('⚠️ Could not save metadata:', e.message);
}

console.log('✅ Descriptive name assignment completed');
module.exports = {};
