# 🚀 RIPER-5 OpenCode Template - Guía de Instalación

## ✅ Estado del Repostorio

**Versión:** 1.0.1  

---

## ⚠️ **NOTA: Corrección de Error Conocido en hooks.yaml**

El archivo `hooks.yaml` tenía un error de duplicación de la declaración `hooks:` que causaba que el plugin `opencode-yaml-hooks` fallara.

### Solución Aplicada:
- Se eliminó la primera declaración duplicada de `hooks:` en el archivo
- El YAML ahora es válido y parseable correctamente
- Todos los 17 hooks funcionan como esperado

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


## 🎯 Cómo Usar 

### Para nuevos proyectos:

```bash
git clone https://github.com/llamazaresfp-dev/opencode-riper-5 nuevo-proyecto/
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

**Versión:** 1.0.1
**Última actualización:** Noviembre 2026  
**Estado:** ✅ Listo para publicar en GitHub
