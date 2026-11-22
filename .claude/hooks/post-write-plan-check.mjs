// post-write-plan-check.mjs - Comprobar plan después de escribir archivos

console.log('📋 Checking plan after file write...');

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const projectDir = process.env.OPENCODE_PROJECT_DIR || '.';
const hooksDir = join(projectDir, '.claude', 'hooks');

// Leer payload de OpenCode
let payload = '';
try {
  // En MJS, leer stdin como Buffer y convertir a string
  const buf = readFileSync(0);
  payload = buf.toString('utf8');
} catch (e) {
  console.error('⚠️ Could not read write payload:', e.message);
}

// Extraer archivos cambiados
const changedFiles = [];
try {
  if (payload.includes('"files"')) {
    const filesMatch = payload.match(/"files":[\s]*([^\]]+)/);
    if (filesMatch) {
      const text = filesMatch[1].replace(/^\[/, '[').replace(/\]$/, '');
      changedFiles.push(...JSON.parse(text));
    }
  }
} catch (e) {
  console.error('⚠️ Could not parse changed files');
}

console.log('Changed files after write:', changedFiles.join(', '));

// Leer plan actual si existe
const planPath = join(projectDir, '.claude', 'plans', 'current.md');
let currentPlan = '';

if (existsSync(planPath)) {
  try {
    currentPlan = readFileSync(planPath, 'utf8');
    console.log('📄 Current plan loaded:', currentPlan.trim().substring(0, 200));
    
    // Verificar si hay acciones pendientes en el plan
    const pendingActions = currentPlan.match(/- \[ ] ([^]+)/g) || [];
    if (pendingActions.length > 0) {
      console.log(`⚠️ ${pendingActions.length} action(s) still pending in plan:`);
      for (const action of pendingActions) {
        console.log(`   - ${action.trim()}`);
      }
      
      // Opcional: intentar completar acciones pendientes
      // Para evitar bloquear el flujo, solo loggear por ahora
    }
    
  } catch (e) {
    console.error('⚠️ Could not read plan:', e.message);
  }
}

// Verificar integridad de archivos escritos
const fileIntegrityChecks = [];

for (const file of changedFiles) {
  if (!file || !fs.existsSync(file)) continue;
  
  // Comprobar si archivo es JS/TS y ejecutar typecheck si está disponible
  const ext = path.extname(file).toLowerCase();
  const isCodeFile = ['.js', '.jsx', '.ts', '.tsx'].includes(ext);
  
  if (isCodeFile) {
    // Intentar typecheck rápido con tsc si existe
    const tscPath = join(projectDir, 'node_modules', '.bin', 'tsc');
    if (existsSync(tscPath)) {
      fileIntegrityChecks.push({
        file,
        check: 'TypeScript compilation',
        command: `${tscPath} ${file}`,
      });
    }
    
    // Intentar eslint si está disponible
    const eslintPath = join(projectDir, 'node_modules', '.bin', 'eslint');
    if (existsSync(eslintPath)) {
      fileIntegrityChecks.push({
        file,
        check: 'ESLint linting',
        command: `${eslintPath} ${file}`,
      });
    }
  }
}

// Ejecutar comprobaciones de integridad si existen (opcionalmente en modo silencioso)
if (fileIntegrityChecks.length > 0) {
  console.log(`🔧 Would run ${fileIntegrityChecks.length} integrity checks (optional)`);
  
  for (const check of fileIntegrityChecks) {
    // Ejecutar con flag --silent para no mostrar salida detallada
    try {
      const startTime = Date.now();
      execSync(check.command, { 
        stdio: 'pipe',  // Silencioso por defecto
        timeout: 30000,  // Timeout de 30 segundos
        cwd: projectDir,
      });
      
      const duration = Date.now() - startTime;
      console.log(`✅ ${check.check} completed for ${check.file} (${duration}ms)`);
    } catch (e) {
      console.error(`❌ ${check.check} failed for ${check.file}:`, e.message);
      // No bloquear el flujo por fallos de lint/typecheck - son sugerencias opcionales
    }
  }
}

// Guardar informe de verificación de plan si se desea persistir
const reportPath = join(projectDir, '.claude', 'hooks', 'plan-check-report.json');
try {
  const report = {
    timestamp: Date.now(),
    changedFiles,
    planExists: existsSync(planPath),
    pendingActions: currentPlan ? (currentPlan.match(/- \[ ] ([^]+)/g) || []).length : 0,
    checksRun: fileIntegrityChecks.length,
    status: 'completed',
  };
  
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('✅ Plan check report saved');
} catch (e) {
  console.error('⚠️ Could not save plan check report:', e.message);
}

console.log('✅ Post-write plan check completed');
module.exports = {};
