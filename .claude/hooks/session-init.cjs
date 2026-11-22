// session-init.cjs - Inicialización de sesión principal para OpenCode

console.log('🚀 Session initialization started...');

const path = require('path');
const os = require('os');

// Obtener directorio del proyecto (OpenCode lo pasa en OPENCODE_PROJECT_DIR)
const projectDir = process.env.OPENCODE_PROJECT_DIR || '.';
const hooksDir = path.join(projectDir, '.claude', 'hooks');

console.log(`Project directory: ${projectDir}`);
console.log(`Hooks directory: ${hooksDir}`);

// 1. Crear directorio de hooks si no existe
if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
  console.log('📁 Created hooks directory:', hooksDir);
}

// 2. Cargar configuración opcional de hooks global (si existe)
let hookConfig = {};

const globalHooksPath = path.join(os.homedir(), '.config', 'opencode', '.claude', 'hooks.yaml');
if (fs.existsSync(globalHooksPath)) {
  try {
    hookConfig = require(globalHooksPath);
    console.log('✅ Loaded global hooks config');
  } catch (e) {
    console.error('⚠️ Could not load global hooks:', e.message);
  }
}

// 3. Inicializar estado de sesión si es necesario
const sessionId = process.env.OPENCODE_SESSION_ID || 'main';

// Guardar timestamp de inicio de sesión
const initStatePath = path.join(projectDir, '.claude', 'hooks', 'session-init-state.json');
try {
  fs.writeFileSync(
    initStatePath,
    JSON.stringify({
      sessionId,
      initialized: Date.now(),
      projectDir,
    }, null, 2)
  );
  console.log('✅ Session state saved');
} catch (e) {
  console.error('⚠️ Could not save session state:', e.message);
}

// 4. Cargar hooks de plugins si existen
const pluginInitScripts = [
  path.join(projectDir, '.claude', 'plugins', 'init.cjs'),  // Plugin personalizado
  path.join(hooksDir, 'plugins-init.cjs'),                    // Hook para cargar plugins
];

for (const script of pluginInitScripts) {
  if (fs.existsSync(script)) {
    try {
      require(script);
      console.log('✅ Loaded plugin init:', script);
    } catch (e) {
      console.error('⚠️ Plugin init error (ignored):', e.message);
    }
  }
}

// 5. Inicializar guardado de plan actual si existe
const planPath = path.join(projectDir, '.claude', 'plans', 'current.md');
if (fs.existsSync(planPath)) {
  try {
    const currentPlan = fs.readFileSync(planPath, 'utf8');
    console.log('📋 Current plan:', currentPlan.trim().substring(0, 100) + '...');
  } catch (e) {
    // Ignorar errores al leer el plan
  }
}

// 6. Ejecutar callbacks opcionales de inicialización
const initCallbacks = [
  path.join(hooksDir, 'on-session-init.cjs'),        // Callback específico
  path.join(projectDir, '.claude', 'hooks', 'session-init-async.mjs'),  // Async callback
];

for (const callback of initCallbacks) {
  if (fs.existsSync(callback)) {
    try {
      const cb = require(callback);
      if (typeof cb === 'function') {
        cb();
      }
      console.log('✅ Loaded session init callback:', callback);
    } catch (e) {
      console.error('⚠️ Callback init error (ignored):', e.message);
    }
  }
}

console.log('✅ Session initialization completed');
module.exports = {};
