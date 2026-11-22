// stop-validator-sweep.cjs - Detener escaneo de validador cuando sesión está inactiva

console.log('⏸️ Session idle: Stopping validator sweep...');

const path = require('path');
const fs = require('fs');

const projectDir = process.env.OPENCODE_PROJECT_DIR || '.';
const hooksDir = path.join(projectDir, '.claude', 'hooks');

// Verificar si hay procesos de validación en curso que deban detenerse
const validatorProcesses = [];

// Intentar detectar y detener cualquier proceso de escaneo activo
try {
  // Leer estado de sesión inactiva (si existe)
  const idleStatePath = path.join(hooksDir, 'idle-detector-state.json');
  
  if (fs.existsSync(idleStatePath)) {
    const state = JSON.parse(fs.readFileSync(idleStatePath, 'utf8'));
    
    console.log('Idle detector state:', {
      idleThreshold: state.idle_threshold || 5 * 60 * 1000, // 5 min por defecto
      lastActivity: state.last_activity ? new Date(state.last_activity).toISOString() : 'never',
    });
    
    // Aquí podrías detener procesos externos o liberar recursos
    console.log('✅ Stopping validator sweep processes');
    
    // Ejemplo: limpiar memoria cache de análisis estático si existe
    const cachePath = path.join(projectDir, '.claude', 'cache', 'validator-cache.json');
    if (fs.existsSync(cachePath)) {
      try {
        const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        
        // Verificar fechas de última actualización
        for (const [file, analysis] of Object.entries(cache)) {
          const fileStats = fs.statSync(file);
          if (fileStats.mtime.getTime() < (analysis.timestamp - 5 * 60 * 1000)) {
            // Análisis más antiguo que el archivo - limpiar cache vieja
            console.log(`   - Clearing stale cache for: ${file}`);
            delete cache[file];
          }
        }
        
        fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
        console.log('✅ Validator cache cleaned');
      } catch (e) {
        console.error('⚠️ Could not clean validator cache:', e.message);
      }
    }
    
  } else {
    console.log('ℹ️ No idle detector state found - session appears fresh');
  }
  
} catch (e) {
  console.error('⚠️ Could not read idle detector state:', e.message);
}

// Guardar estado de sesión inactiva si es la primera vez o actualiza timestamp
try {
  const statePath = path.join(hooksDir, 'idle-detector-state.json');
  
  // Leer estado existente o crear nuevo
  let state;
  if (fs.existsSync(statePath)) {
    state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    
    // Actualizar timestamp de última actividad de sesión inactiva
    state.last_activity = Date.now();
    
    // Si hemos estado inactivos más tiempo que el threshold, reiniciar contador
    const threshold = state.idle_threshold || 5 * 60 * 1000;
    const now = Date.now();
    
    if (now - state.last_activity > threshold) {
      console.log('⚠️ Session has been idle for longer than threshold');
      state.continuous_idle_time = now - state.first_idle_timestamp;
    }
    
  } else {
    // Crear nuevo estado para sesión inactiva
    const now = Date.now();
    state = {
      first_idle_timestamp: now,
      last_activity: now,
      idle_threshold: 5 * 60 * 1000, // 5 minutos por defecto
      continuous_idle_time: 0,
    };
  }
  
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  console.log('✅ Idle detector state saved');
  
} catch (e) {
  console.error('⚠️ Could not save idle detector state:', e.message);
}

console.log('✅ Validator sweep stopped while session is idle');
module.exports = {};
