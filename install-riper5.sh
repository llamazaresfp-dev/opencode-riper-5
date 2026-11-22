#!/bin/bash
# install-riper5.sh - Instalar configuración RIPER-5 en proyecto existente

set -e

PROJECT_DIR="${1:-.}"
TEMPLATE_DIR="$(dirname "$0")"

echo "=============================================="
echo "   🚀 Instalando Workflow RIPER-5"
echo "=============================================="
echo ""
echo "Proyecto objetivo: $PROJECT_DIR"
echo "Template desde:     $TEMPLATE_DIR"
echo ""

if [ ! -d "$TEMPLATE_DIR/.opencode" ]; then
    echo "⚠️  Error: No se encontró la estructura RIPER-5 en el template"
    echo "   Asegúrate de clonar el repositorio completo"
    exit 1
fi

# Copiar estructura .opencode si no existe
if [ ! -d "$PROJECT_DIR/.opencode" ]; then
    echo "📁 Creando .opencode/..."
    mkdir -p "$PROJECT_DIR/.opencode"
else
    echo "✅ .opencode/ ya existe"
fi

# Copiar hooks.yaml
echo "⚙️  Configurando hooks..."
if [ ! -f "$PROJECT_DIR/.opencode/hooks/hooks.yaml" ]; then
    cp "$TEMPLATE_DIR/.opencode/hooks/hooks.yaml" "$PROJECT_DIR/.opencode/hooks/"
    echo "   ✅ hooks.yaml instalado"
else
    echo "   ⚠️  hooks.yaml ya existe (no sobrescrito)"
fi

# Copiar permissions.json
echo "🔒 Configurando control de acceso..."
if [ ! -f "$PROJECT_DIR/.opencode/permissions.json" ]; then
    cp "$TEMPLATE_DIR/.opencode/permissions.json" "$PROJECT_DIR/.opencode/"
    echo "   ✅ permissions.json instalado"
else
    echo "   ⚠️  permissions.json ya existe (no sobrescrito)"
fi

# Copiar scripts de hooks
echo "📜 Instalando scripts de hooks..."
HOOKS_SRC="$TEMPLATE_DIR/.claude/hooks"
HOOKS_DST="$PROJECT_DIR/.claude/hooks"

mkdir -p "$HOOKS_DST"

for script in "$HOOKS_SRC"/*.cjs "$HOOKS_SRC"/*.mjs; do
    if [ -f "$script" ]; then
        basename=$(basename "$script")
        dest="$HOOKS_DST/$basename"
        
        # Solo copiar si no existe o es más nuevo en el template
        if [ ! -f "$dest" ] || [ "$(stat -c %y "$script" | cut -d. -f1)" = "$(stat -c %y "$dest" | cut -d. -f1)$(stat -c %y "$script" | cut -d. -f2)"* ]; then
            cp "$script" "$dest"
            echo "   ✅ $basename"
        else
            echo "   ⚠️  $basename ya existe (no sobrescrito)"
        fi
    fi
done

# Copiar AGENTS.md si no existe
echo "📚 Configurando documentación..."
if [ ! -f "$PROJECT_DIR/AGENTS.md" ]; then
    cp "$TEMPLATE_DIR/AGENTS.md" "$PROJECT_DIR/"
    echo "   ✅ AGENTS.md instalado"
fi

# Crear estructura process/
echo "📁 Creando estructura process/..."
mkdir -p "$PROJECT_DIR/process/general-plans/active" \
         "$PROJECT_DIR/process/features" \
         "$PROJECT_DIR/.opencode/scripts/process-workflow"

echo ""
echo "=============================================="
echo "   ✅ RIPER-5 Instalado!"
echo "=============================================="
echo ""
echo "Próximos pasos:"
echo "1. Abre OpenCode en el proyecto: opencode"
echo "2. Crea tu primer feature o plan global"
echo "3. Sigue el workflow: RESEARCH → SPEC → INNOVATE → PLAN → VALIDATE → EXECUTE"
echo ""
