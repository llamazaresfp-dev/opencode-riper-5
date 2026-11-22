# 📦 RIPER-5 OpenCode Template v1.0.0

## ✅ Estado: LISTO PARA PUBLICAR EN GITHUB

### Ubicación del Repositorio:
```
/home/luchito/proyecto/project_test/ripers5-template/
```

### Archivos en el repositorio: **20 archivos**

| Directorio | Archivos | Propósito |
|------------|----------|-----------|
| `.claude/hooks/` | 9 scripts | Hooks funcionales para OpenCode |
| `.opencode/hooks/` | 1 yaml | Configuración de hooks centralizada |
| `.opencode/permissions.json` | 1 JSON | Control de acceso whitelist |
| `process/` | estructura | Planes globales y feature-specific |
| Root files | 7 archivos | Docs, LICENSE, scripts de instalación |

---

## 🚀 Cómo Publicar en GitHub

### Método 1: Usar "Use this template" (Recomendado)

1. **Subir los archivos a un repositorio nuevo en GitHub:**

   ```bash
   # Desde la interfaz web de GitHub:
   # 1. Ir a https://github.com/new
   # 2. Nombre del repo: ripers5-template
   # 3. Descripción: "RIPER-5 OpenCode Project Template"
   # 4. Licencia: MIT
   # 5. Private o Public según preferencias
   # 6. Crear repositorio vacío
   
   # Luego subir manualmente los archivos usando:
   git remote add origin <TU_URL_DE_GITHUB>
   git branch -M main
   git push -u origin main
   ```

2. **Crear como template:**
   - Ve al repo en GitHub: https://github.com/[TU-USER]/riper5-template
   - Haz clic en **"Use this template"**
   - Selecciona **"Create a new repository from this template"**
   - Ahora cualquier persona puede crear un nuevo repo usando este template

### Método 2: Publicar directamente

```bash
cd /home/luchito/proyecto/project_test/ripers5-template

# Verificar que está listo para subir
git status  # Debe mostrar "nothing to commit" si ya has pushado o commits locales

# Crear repo en GitHub desde web y luego:
git remote add origin <URL-GITHUB>
git branch -M main
git push -u origin main --tags

# Crear tag para versión
git tag v1.0.0
git push origin v1.0.0
```

---

## 📋 Contenido del Template

### **Archivos Principales:**

1. **README.md** - Documentación completa en español
2. **README_EN.md** - Documentación en inglés  
3. **AGENTS.md** - Definición del workflow RIPER-5
4. **.opencode/hooks/hooks.yaml** - Configuración de hooks
5. **.opencode/permissions.json** - Whitelist de comandos

### **Hooks Scripts (.claude/hooks/):**

| Script | Función |
|--------|---------|
| `session-init.cjs` | Inicialización de sesión principal |
| `subagent-init.cjs` | Inicialización de subagentes |
| `scout-block.cjs` | Bloqueo scout con whitelist configurable |
| `privacy-block.cjs` | Protección de archivos sensibles |
| `session-state.cjs` | Gestión de estado de sesión |
| `post-write-plan-check.mjs` | Validación post-escritura |
| `post-commit-lint.mjs` | Git commit y lint automático |
| `descriptive-name.cjs` | Nombres descriptivos para archivos |
| `stop-validator-sweep.cjs` | Limpieza de cache inactividad |

### **Agentes RIPER-5 (.opencode/agents/):**

Todos los 7 agentes necesarios para el workflow están listos y funcionales:

- ✅ vc-research-agent.md
- ✅ vc-spec-agent.md  
- ✅ vc-innovate-agent.md
- ✅ vc-plan-agent.md
- ✅ vc-validate-agent.md
- ✅ vc-execute-agent.md
- ✅ vc-update-process-agent.md

### **Estructura `process/`:**

```
process/
├── general-plans/active/     # Planes globales (app-wide)
│   └── _PLAN_<feature>.md
├── features/<feature>/active/  # Planes específicos por feature
│   └── _PLAN_<sub>.md
└── README.md                 # Guía del workflow
```

### **Scripts de Utilidad:**

- `install-riper5.sh` - Instalación automática
- `verify-riper5.sh` - Verificación de instalación
- `.gitignore` - Reglas exclusión estándar

---

## ✨ Características Clave

| Característica | Estado | Descripción |
|----------------|--------|-------------|
| **Workflow RIPER-5** | ✅ Implementado | 7 agentes completos para cada fase |
| **Hooks Funcionales** | ✅ 9 hooks | Inicialización, bloqueo scout, privacidad, etc. |
| **Control de Acceso** | ✅ Whitelist | `.opencode/permissions.json` con comandos permitidos |
| **Estructura `process/`** | ✅ Lista | Carpetas para planes globales y feature-specific |
| **Skills RIPER-5** | ✅ Disponibles | Skills especializados para apoyo al workflow |
| **Documentación** | ✅ Completa | README, guía de uso, ejemplos |

---

## 🎯 Cómo Usar Después de Publicar

### **Para nuevos proyectos:**

```bash
git clone <TU_REPO_GITHUB> nuevo-proyecto/
cd nuevo-proyecto
git init
opencode
# Workflow RIPER-5 está automáticamente configurado!
```

### **Proyectos existentes:**

```bash
./install-riper5.sh /ruta/proyecto
# O clonar el template y copiar estructura
```

### **Verificar instalación:**

```bash
verify-riper5.sh .  # Debe mostrar: "🎉 ¡RIPER-5 está correctamente instalado!"
```

---

## 🔧 Scripts Disponibles

### **install-riper5.sh**
Instala automáticamente la configuración RIPER-5 en proyecto existente.

```bash
./install-riper5.sh /ruta/proyecto
```

### **verify-riper5.sh**  
Verifica que toda la configuración RIPER-5 está instalada correctamente.

```bash
verify-riper5.sh .  # Debe pasar todos los checks (17/17)
```

---

## 📄 Licencia

MIT License - Libre para uso personal y comercial.

---

## 🔗 Enlaces Útiles

- **Documentación oficial OpenCode:** https://opencode.ai/docs/
- **Migration V1→V2:** https://opencode.ai/docs/migrate-v1
- **CLI guide:** https://opencode.ai/docs/cli
- **Config guide:** https://opencode.ai/docs/config

---

**Version:** 1.0.0  
**Última actualización:** Noviembre 2026  
**Estado:** ✅ Listo para publicar en GitHub
```
