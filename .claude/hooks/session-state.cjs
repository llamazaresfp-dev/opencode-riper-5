// session-state.cjs - Actualizar estado de sesión después de cambios de archivo

console.log('📝 Updating session state after file changes...');

const path = require('path');
const fs = require('fs');

const projectDir = process.env.OPENCODE_PROJECT_DIR || '.';
const hooksDir = path.join(projectDir, '.claude', 'hooks');

// Leer payload de cambios de archivo
let payload = '';
try {
  payload = fs.readFileSync(0, 'utf8');
} catch (e) {
  // No hay payload en stdin - continuar sin información específica
}

// Extraer archivos cambiados del payload
const changedFiles = [];
if (payload.includes('"files"')) {
  const filesMatch = payload.match(/"files":[\s]*([^\]]+)/);
  if (filesMatch) {
    try {
      const filesArray = JSON.parse(`[${filesMatch[1].replace(/^\[/, '[').replace(/\]$/, '}')}]`);
      changedFiles.push(...filesArray || []);
    } catch (e) {
      // Ignorar errores de parsing
    }
  }
}

console.log('Changed files:', changedFiles.join(', '));

// Guardar estado actual del archivo
const stateDir = path.join(projectDir, '.claude', 'hooks', 'state');
if (!fs.existsSync(stateDir)) {
  fs.mkdirSync(stateDir, { recursive: true });
}

// Crear snapshot de cambios recientes
const stateFile = path.join(stateDir, 'recent-changes.json');
try {
  const existingState = fs.existsSync(stateFile) 
    ? JSON.parse(fs.readFileSync(stateFile, 'utf8'))
    : { changes: [] };
  
  // Agregar nuevo cambio con timestamp
  existingState.changes.push({
    files: changedFiles,
    timestamp: Date.now(),
    toolName: payload.includes('"tool"') 
      ? JSON.parse(payload.match(/"tool":"([^"]+)"/)?.[1] || 'unknown')
      : 'unknown',
  });
  
  // Mantener solo últimos 50 cambios para no saturar el archivo
  existingState.changes = existingState.changes.slice(-50);
  
  fs.writeFileSync(stateFile, JSON.stringify(existingState, null, 2));
  console.log('✅ Saved recent changes to state');
} catch (e) {
  console.error('⚠️ Could not save state:', e.message);
}

// Verificar si cambios afectan archivos específicos de interés
const trackingFiles = [
  path.join(projectDir, '.claude', 'plans', 'current.md'),  // Plan actual
  path.join(projectDir, '.claude', 'todo-list.txt'),         // Lista de tareas
];

for (const trackFile of trackingFiles) {
  if (fs.existsSync(trackFile)) {
    try {
      const content = fs.readFileSync(trackFile, 'utf8');
      console.log(`📋 ${path.basename(trackFile)} status:`, 
        content.length > 50 ? content.substring(0, 50) + '...' : content);
    } catch (e) {
      // Ignorar errores
    }
  }
}

console.log('✅ Session state updated');
module.exports = {};
