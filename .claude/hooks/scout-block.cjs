// scout-block.cjs - Bloqueo de exploración Scout con whitelist configurable

console.error('🔍 Scout block: Checking command against whitelist...');

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// El script se ejecuta desde la carpeta del proyecto raíz
// Por defecto asumimos que estamos en el mismo directorio donde está hooks.yaml
const projectDir = process.env.OPENCODE_PROJECT_DIR || '.';

// Leer configuración de permisos si existe
const permissionsPath = path.join(projectDir, '.opencode', 'permissions.json');
let allowedPatterns = [];
let blockedPatterns = [];

if (fs.existsSync(permissionsPath)) {
  try {
    const perms = require(permissionsPath);
    
    // Si scout está permitido, cargar whitelist de comandos
    if (perms.allow_scout) {
      allowedPatterns.push(...(perms.scout_allowed_commands || []));
      
      // También cargar whitelist de archivos permitidos para lectura
      if (perms.read_whitelist) {
        console.error(`✅ Read whitelist: ${perms.read_whitelist.join(', ')}`);
      }
    } else {
      console.error('⛔ Scout globally disabled by permissions');
    }
    
    // Cargar comandos bloqueados por defecto
    if (perms.blocked_commands) {
      blockedPatterns.push(...perms.blocked_commands);
    }
  } catch (e) {
    console.error(`⚠️ Could not read permissions:`, e.message);
  }
}

// Determinar comando que se va a ejecutar
let command = '';
try {
  // Leer payload de stdin para obtener comando
  const payload = fs.readFileSync(0, 'utf8');
  
  // Intentar extraer comando del payload (formato típico de OpenCode)
  if (payload.includes('"command"')) {
    const match = payload.match(/"command":"([^"]+)"/);
    if (match) {
      command = match[1];
    }
  } else if (payload.includes("'command'")) {
    const match = payload.match(/'command':'([^']+)'/);
    if (match) {
      command = match[1];
    }
  }
  
  // Si el comando es glob o grep, extraer argumentos para verificar archivos
  if (!command && payload.includes('"args"')) {
    try {
      const argsMatch = payload.match(/"args":[\s]*([^\]]+)/);
      if (argsMatch) {
        const args = JSON.parse(`[${argsMatch[1].replace(/^\[/, '[').replace(/\]$/, '}')}]`);
        command = 'glob'; // Para herramientas como glob, usar comando genérico
      }
    } catch (e) {}
  }
} catch (e) {
  // No hay payload disponible
}

console.error(`Command to check: ${command || '(empty)'}`);
console.error(`Allowed patterns: ${allowedPatterns.length > 0 ? allowedPatterns.join(', ') : '(none)'}`);

// Verificar comandos bloqueados primero
const isBlocked = blockedPatterns.some(pattern => {
  const regex = new RegExp(`^${pattern.replace(/\*/g, '.*').replace(/\?/g, '.')}`);
  return regex.test(command);
});

if (isBlocked) {
  console.error('❌ Command matches blocked pattern:', command);
  process.exit(1);
}

// Si hay whitelist de comandos permitidos, verificar contra ella
if (allowedPatterns.length > 0) {
  const isAllowed = allowedPatterns.some(pattern => {
    // Permitir patrones glob o comandos exactos
    if (pattern.includes('**')) return true; // Glob patterns son siempre aceptables
    
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*').replace(/\?/g, '.')}`);
    return regex.test(command);
  });
  
  if (isAllowed) {
    console.error(`✅ Command allowed by whitelist: ${command}`);
    process.exit(0);
  } else {
    // No está en whitelist - permitir operaciones estándar del sistema de archivos
    if (['glob', 'grep', 'ls', 'find', 'cat'].includes(command)) {
      console.error(`⚠️ Command not in whitelist but appears safe: ${command}`);
      process.exit(0);
    }
  }
}

// Comandos estándar del sistema de archivos - permitir por defecto
if (!['glob', 'grep', 'ls', 'find', 'cat', 'git'].includes(command)) {
  // Para herramientas de exploración como glob/grep, permitir si están relacionadas con archivos seguros
  const isSafeFileOp = command.match(/^glob|grep/);
  
  if (isSafeFileOp) {
    console.error(`✅ Safe file operation: ${command}`);
    process.exit(0);
  } else {
    console.error('⛔ Unknown or potentially unsafe operation');
    process.exit(1);
  }
}

console.error('✅ Scout check passed (standard file operation)');
process.exit(0);
