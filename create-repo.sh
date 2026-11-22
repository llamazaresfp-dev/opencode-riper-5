#!/bin/bash
# Script para crear y subir el repositorio a GitHub

echo "=========================================="
echo "   📦 Creando Repositorio RIPER-5 para GitHub"
echo "=========================================="
echo ""

REPO_DIR="$(pwd)"
REMOTE_NAME="origin"
GITHUB_USER="${GITHUB_USER:-}"
REPO_NAME="riper5-template"

echo "Configuración:"
echo "  Directorio: $REPO_DIR"
echo "  Nombre repo: $REPO_NAME"
echo ""

# Verificar que el repositorio está listo
echo "📋 Verificando estructura..."
bash verify-riper5.sh . | tail -3

echo ""
echo "⚠️  Pasos para subir a GitHub:"
echo ""
echo "1. Ve a https://github.com/new en tu navegador"
echo ""
echo "2. Selecciona 'Use this template'"
echo "3. Crea un nuevo repositorio con:"
echo "   - Nombre: ripers5-template"
echo "   - Descripción: OpenCode project with RIPER-5 workflow"
echo "   - Licencia: MIT"
echo ""
echo "4. O usa Git CLI (si tienes cuenta de GitHub):"
echo ""
echo "   git remote add origin https://github.com/TU-USER/riper5-template.git"
echo "   git branch -M main"
echo "   git push -u origin main --tags"
echo ""
echo "5. Una vez subido, ve a Settings → Danger Zone → Convert repository to template"
echo ""
echo "¡Listo! Ahora puedes crear nuevos proyectos con RIPER-5!"

