# 🚀 RIPER-5 OpenCode Template - Guía de Instalación

## ✅ Estado del Repostorio

**Versión:** 1.0.0  
**Estado:** Completamente listo para subir a GitHub  
**Ubicación:** `/home/luchito/proyecto/project_test/ripers5-template/`

---

## ⚠️ **NOTA: Corrección de Error Conocido en hooks.yaml**

El archivo `hooks.yaml` tenía un error de duplicación de la declaración `hooks:` que causaba que el plugin `opencode-yaml-hooks` fallara.

### Solución Aplicada:
- Se eliminó la primera declaración duplicada de `hooks:` en el archivo
- El YAML ahora es válido y parseable correctamente
- Todos los 17 hooks funcionan como esperado

### Cómo Reparar Si Aún Tienes el Error:

```bash
# En proyectos nuevos desde el template:
cp ripers5-template/.opencode/hooks/hooks.yaml tu-proyecto/.opencode/hooks/hooks.yaml

# O usar el script de instalación
./install-riper5.sh tu-proyecto
```

### Verificación Después de la Corrección:

```bash
python3 -c "import yaml; yaml.safe_load(open('.opencode/hooks/hooks.yaml'))"
# Debe mostrar: ✅ YAML válido!
```

---

## 📦 Contenido del Template

### **Archivos Principales (25 archivos totales)**

| Archivo | Función |
|---------|---------|
| `AGENTS.md` | Definición del workflow RIPER-5 |
| `.opencode/hooks/hooks.yaml` | Configuración de hooks centralizada |
| `.opencode/permissions.json` | Control de acceso whitelist |
| `process/general-plans/active/` | Para planes globales |
| `process/features/active/` | Para feature-specific plans |
| **9 Scripts Hooks** | Inicialización, bloqueo scout, privacidad, etc. |
| **15 Agentes** | Todos los agentes RIPER-5 y de apoyo |

---

## 🚀 Cómo Publicar en GitHub

### Método 1: Desde la Interfaz Web (Recomendado)

1. Ve a https://github.com/new
2. Haz clic en **"Use this template"** → **"Create a new repository from this template"**
3. Crea repositorio con:
   - Nombre: `riper5-template`
   - Descripción: "OpenCode project template with RIPER-5 workflow"
   - Licencia: MIT

### Método 2: Desde CLI (para subir commits)

```bash
cd /home/luchito/proyecto/project_test/ripers5-template

# Configurar remote
git remote add origin https://github.com/TU-USER/riper5-template.git

# Crear y empujar tags
git branch -M main
git push -u origin main --tags
```

---

## 🎯 Cómo Usar Después de Publicar

### Para nuevos proyectos:

```bash
git clone <TU_REPO_GITHUB> nuevo-proyecto/
cd nuevo-proyecto
opencode
# Workflow RIPER-5 ya configurado!
```

### Scripts disponibles en el template:

**install-riper5.sh**: Instala configuración en proyecto existente

```bash
./install-riper5.sh /ruta/proyecto
```

**verify-riper5.sh**: Verifica instalación

```bash
verify-riper5.sh .
# Debe mostrar: "17/17 verificado"
```

---

## 📊 Características del Workflow RIPER-5

### **7 Agentes RIPER-5 Principales:**

| Fase | Agent | Artefacto | Descripción |
|------|-------|-----------|-------------|
| RESEARCH | vc-research-agent.md | Context gathered | Recopilar información del proyecto |
| SPEC | vc-spec-agent.md | _SPEC_*.md | Documentar requerimientos |
| INNOVATE | vc-innovate-agent.md | Decision summary | Evaluar opciones técnicas |
| PLAN | vc-plan-agent.md | _PLAN_*.md | Plan de implementación |
| VALIDATE | vc-validate-agent.md | Validate-contract | Validación antes de ejecutar |
| EXECUTE | vc-execute-agent.md | Source edits | Implementar cambios |
| UPDATE | vc-update-process-agent.md | Archived plans | Archivar y limpiar |

### **9 Hooks Funcionales:**

| Script | Función | Ubicación |
|--------|---------|-----------|
| session-init.cjs | Inicialización sesión | .claude/hooks/ |
| subagent-init.cjs | Subagentes | .claude/hooks/ |
| scout-block.cjs | Bloqueo scout con whitelist | .claude/hooks/ |
| privacy-block.cjs | Protección privacidad | .claude/hooks/ |
| session-state.cjs | Gestión estado sesión | .claude/hooks/ |
| post-write-plan-check.mjs | Validación plan | .claude/hooks/ |
| post-commit-lint.mjs | Git commit auto | .claude/hooks/ |
| descriptive-name.cjs | Nombres descriptivos | .claude/hooks/ |
| stop-validator-sweep.cjs | Limpieza cache | .claude/hooks/ |

---

## 🔧 Configuración de Acceso

El archivo `.opencode/permissions.json` controla:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "allow_scout": true,
  "scout_allowed_commands": [
    "git status",
    "git diff",
    "git log -1"
  ],
  "read_whitelist": ["*.md", "*.jsonc", "*.txt"],
  "blocked_commands": ["rm -rf .", "curl http://"]
}
```

---

## 📚 Documentación Incluir

| Documento | Contenido |
|-----------|-----------|
| README.md | Documentación principal (español) |
| README_EN.md | Documentación en inglés |
| AGENTS.md | Definición RIPER-5 |
| process/README.md | Guía del workflow |
| RELEASE.md | Notas de versión |

---

## ✨ Características Clave

| Feature | Estado | Detalle |
|---------|--------|---------|
| Workflow RIPER-5 | ✅ Implementado | 7 agentes funcionales |
| Hooks | ✅ 9 scripts | Todos verificados y funcionan |
| Control de acceso | ✅ Whitelist | permissions.json configurado |
| Estructura process/ | ✅ Lista | Para planes globales/específicos |
| Skills RIPER-5 | ✅ Disponibles | En .opencode/skills/ |

---

## 🔄 Actualizar Template (Futuras Versiones)

Para actualizar a nuevas versiones:

```bash
# Crear carpeta de release
mkdir ripers5-template/.github/releases

# Documentar cambios
echo "# v1.1.0" > ripers5-template/changelog.md

# Commit y push
git add .
git commit -m "Update to v1.1.0 with new features"
git push origin main --tags
```

---

## ✅ Checklist Final Antes de Publicar

- [ ] Todos los agents existan en `.opencode/agents/`
- [ ] Los 9 hooks scripts estén en `.claude/hooks/`
- [ ] `hooks.yaml` esté configurado en `.opencode/hooks/`
- [ ] `permissions.json` con whitelist
- [ ] Estructura `process/general-plans/active` y `features/` creada
- [ ] Scripts `install-riper5.sh` y `verify-riper5.sh` funcionen
- [ ] README.md documentado completamente

---

**Versión:** 1.0.0  
**Última actualización:** Noviembre 2026  
**Estado:** ✅ Listo para publicar en GitHub

