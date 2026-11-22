// subagent-init.cjs - Inicialización de subagentes para OpenCode

console.log('🔄 Subagent initialization started...');

const path = require('path');
const os = require('os');

// Obtener directorio del proyecto
const projectDir = process.env.OPENCODE_PROJECT_DIR || '.';
const hooksDir = path.join(projectDir, '.claude', 'hooks');

console.log(`Project directory: ${projectDir}`);

// 1. Verificar que subagentes están permitidos
const permissionsPath = path.join(projectDir, '.opencode', 'permissions.json');
if (fs.existsSync(permissionsPath)) {
  try {
    const permissions = require(permissionsPath);
    
    if (!permissions.allow_subagents) {
      console.error('⛔ Subagents are disabled by permissions');
      // No hacer nada, el subagente se creará sin capacidad completa
    } else {
      console.log('✅ Subagents allowed by permissions');
    }
  } catch (e) {
    console.error('⚠️ Could not read permissions:', e.message);
  }
}

// 2. Cargar configuración de subagentes si existe
const subagentConfigPath = path.join(hooksDir, 'subagent-config.json');
let subagentConfig = {};

if (fs.existsSync(subagentConfigPath)) {
  try {
    subagentConfig = require(subagentConfigPath);
    console.log('✅ Loaded subagent config:', Object.keys(subagentConfig).join(', '));
  } catch (e) {
    console.error('⚠️ Could not load subagent config:', e.message);
  }
}

// 3. Aplicar configuración de subagente a variables de entorno
if (Object.keys(subagentConfig).length > 0) {
  for (const [key, value] of Object.entries(subagentConfig)) {
    process.env[`SUBAGENT_${key.toUpperCase()}`] = String(value);
    console.log(`🌍 Set SUBAGENT_${key.toUpperCase()}=${value}`);
  }
}

// 4. Inicializar estado del subagente
const subagentStatePath = path.join(projectDir, '.claude', 'hooks', 'subagent-state.json');
try {
  const state = {
    sessionId: process.env.OPENCODE_SESSION_ID || 'unknown',
    subagentId: process.env.SUBAGENT_ID || 'unknown',
    initialized: Date.now(),
  };
  
  fs.writeFileSync(subagentStatePath, JSON.stringify(state, null, 2));
  console.log('✅ Subagent state saved');
} catch (e) {
  console.error('⚠️ Could not save subagent state:', e.message);
}

// 5. Cargar plugins de subagente si existen
const pluginInitPath = path.join(hooksDir, 'plugins-init.cjs');
if (fs.existsSync(pluginInitPath)) {
  try {
    require(pluginInitPath);
    console.log('✅ Loaded plugin init for subagent');
  } catch (e) {
    console.error('⚠️ Plugin init error:', e.message);
  }
}

// 6. Ejecutar callbacks de inicialización de subagente
const subagentInitCallbacks = [
  path.join(hooksDir, 'on-subagent-init.cjs'),
  path.join(projectDir, '.claude', 'hooks', 'subagent-init-async.mjs'),
];

for (const callback of subagentInitCallbacks) {
  if (fs.existsSync(callback)) {
    try {
      const cb = require(callback);
      if (typeof cb === 'function') {
        cb();
      }
      console.log('✅ Loaded subagent init callback');
    } catch (e) {
      console.error('⚠️ Subagent callback error:', e.message);
    }
  }
}

console.log('✅ Subagent initialization completed');
module.exports = {};
