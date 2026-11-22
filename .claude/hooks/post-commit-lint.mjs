// post-commit-lint.mjs - Ejecutar Git commit y lint después de bash

console.log('🔧 Post-bash: Running git commit and lint checks...');

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const projectDir = process.env.OPENCODE_PROJECT_DIR || '.';
const hooksDir = join(projectDir, '.claude', 'hooks');

// Leer payload de comando ejecutado
let payload = '';
try {
  const buf = readFileSync(0);
  payload = buf.toString('utf8');
} catch (e) {
  console.error('⚠️ Could not read bash payload:', e.message);
}

// Extraer comando ejecutado
const commandMatch = payload.match(/"command":"([^"]+)"/);
const executedCommand = commandMatch ? commandMatch[1] : '';

console.log(`Executed command: ${executedCommand}`);

// Determinar si el comando fue parte de un flujo Git/Lint esperado
const isGitRelated = executedCommand.includes('git') && 
                      (executedCommand.includes('commit') || 
                       executedCommand.includes('push') ||
                       executedCommand.includes('diff'));

const isLintRelated = executedCommand.includes('/eslint') || 
                      executedCommand.includes('/biome') || 
                      executedCommand.includes('/oxlint');

const isTestRelated = executedCommand.includes('test') ||
                      executedCommand.includes('vitest') ||
                      executedCommand.includes('jest') ||
                      executedCommand.includes('ava');

console.log(`Detected: ${isGitRelated ? 'Git' : ''}${isLintRelated ? ', Lint' : ''}${isTestRelated ? ', Test' : ''}`);

// Definir scripts de lint disponibles
const availableLinters = [];

if (existsSync(join(projectDir, '.eslintrc.json'))) {
  availableLinters.push({
    name: 'eslint',
    command: 'npx eslint --quiet .',
    config: '.eslintrc.json',
  });
}

if (existsSync(join(projectDir, 'biome.jsonc'))) {
  availableLinters.push({
    name: 'biome',
    command: 'biome check --write-only',
    config: 'biome.jsonc',
  });
}

if (existsSync(join(projectDir, '.oxlintrc.json'))) {
  availableLinters.push({
    name: 'oxlint',
    command: 'npx oxlint .',
    config: '.oxlintrc.json',
  });
}

// Ejecutar lint solo si el comando original fue Git/Lint/Test
if (isGitRelated || isLintRelated || isTestRelated) {
  console.log('📋 Running post-commit lint/check...');
  
  for (const linter of availableLinters) {
    try {
      console.log(`   - Running ${linter.name}...`);
      
      // Ejecutar con --fix si el package.json tiene script de fix
      const pkgPath = join(projectDir, 'package.json');
      if (existsSync(pkgPath)) {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
        
        // Intentar run lint automáticamente si existe
        if (pkg.scripts && (pkg.scripts.lint || pkg.scripts.fix || pkg.scripts['lint:fix'])) {
          const lintScript = pkg.scripts.lint || pkg.scripts.fix || pkg.scripts['lint:fix'];
          console.log(`   - Running: npm run ${lintScript.replace(/:/, ' ')}`);
          
          execSync(`npm run ${lintScript.replace(/:/, ' ')}`, {
            stdio: 'inherit',
            cwd: projectDir,
            timeout: 60000, // Timeout de 1 minuto para lint
          });
        }
      }
      
    } catch (e) {
      console.error(`   ⚠️ ${linter.name} check failed (or not needed):`, e.message);
      // No bloquear el flujo - lint fallido es OK si es opcional
    }
  }
}

// Intentar crear commit automático con cambios no guardados si existe .claude/commit-autosave.json
const autosaveConfigPath = join(projectDir, '.claude', 'commit-autosave.json');
if (existsSync(autosaveConfigPath)) {
  try {
    const config = JSON.parse(readFileSync(autosaveConfigPath, 'utf8'));
    
    if (config.auto_commit && !executedCommand.includes('git add')) {
      console.log('⚠️ Auto-commit enabled but no uncommitted files detected');
      
      // Ejecutar git status para ver si hay cambios
      try {
        const status = execSync('git status --porcelain', { cwd: projectDir, encoding: 'utf8' });
        
        if (status.trim()) {
          console.log('📝 Uncommitted changes detected:');
          console.log(status);
          
          // Añadir y crear commit automático si está permitido
          if (config.auto_commit) {
            try {
              execSync('git add .', { cwd: projectDir });
              const lastCommit = execSync('git log -1 --pretty=%B', { cwd: projectDir, encoding: 'utf8' }).trim();
              const message = `Auto-commit: Updated files\n${lastCommit}`;
              execSync(`git commit -m "${message}"`, { cwd: projectDir });
              console.log('✅ Auto-commit completed');
            } catch (e) {
              console.error('❌ Auto-commit failed:', e.message);
            }
          }
        } else {
          console.log('✅ No uncommitted changes');
        }
      } catch (e) {
        console.error('⚠️ Could not run git status/commit:', e.message);
      }
    }
  } catch (e) {
    console.error('⚠️ Could not read autosave config:', e.message);
  }
}

console.log('✅ Post-commit lint completed');
module.exports = {};
