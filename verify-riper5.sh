#!/bin/bash
# verify-riper5.sh - Verificar si RIPER-5 está instalado correctamente

echo "=============================================="
echo "   🧪 Verificación de Instalación RIPER-5"
echo "=============================================="
echo ""

PROJECT_DIR="${1:-.}"

if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Error: Directorio no existe: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR" || exit 1

CHECKS=0
PASSED=0
FAILED=0

check_status() {
    if [ -f "$PROJECT_DIR/$1" ] || [ -d "$PROJECT_DIR/$1" ]; then
        echo "   ✅ $2"
        PASSED=$((PASSED + 1))
    else
        echo "   ❌ $2 (FALTA)"
        FAILED=$((FAILED + 1))
    fi
    CHECKS=$((CHECKS + 1))
}

echo "--- ARCHIVOS CLAVE ---"
check_status "AGENTS.md" "Archivo de workflow RIPER-5"
check_status ".opencode/hooks/hooks.yaml" "Configuración de hooks"
check_status ".opencode/permissions.json" "Control de acceso whitelist"

echo ""
echo "--- AGENTS RIPER-5 ---"
for agent in research spec innovate plan validate execute update-process; do
    if [ -f ".opencode/agents/vc-$agent-agent.md" ]; then
        echo "   ✅ vc-$agent-agent.md"
        PASSED=$((PASSED + 1))
    else
        echo "   ❌ vc-$agent-agent.md (FALTA)"
        FAILED=$((FAILED + 1))
    fi
    CHECKS=$((CHECKS + 1))
done

echo ""
echo "--- HOOKS SCRIPTS ---"
for script in session-init.cjs subagent-init.cjs scout-block.cjs privacy-block.cjs; do
    if [ -f ".claude/hooks/$script" ]; then
        echo "   ✅ $script"
        PASSED=$((PASSED + 1))
    else
        echo "   ❌ $script (FALTA)"
        FAILED=$((FAILED + 1))
    fi
    CHECKS=$((CHECKS + 1))
done

echo ""
echo "--- ESTRUCTURA PROCESS ---"
check_status "process/" "Directorio principal"
check_status "process/general-plans/active" "Carpetas para planes globales"
check_status "process/features" "Carpetas para feature-specific plans"

echo ""
echo "=============================================="
echo "   RESULTADO: $PASSED/$CHECKS verificado"
echo "=============================================="

if [ $FAILED -eq 0 ]; then
    echo ""
    echo "🎉 ¡RIPER-5 está correctamente instalado!"
    exit 0
else
    echo ""
    echo "⚠️  Faltan componentes. Ejecuta:"
    echo "   ./install-riper5.sh . o clona el repositorio"
    exit 1
fi
