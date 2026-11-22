# 🔧 Pre-Commit Script para RIPER-5 Template

## Ejecutar antes de subir a GitHub:

```bash
#!/bin/bash
echo "=== PRE-COMMIT VERIFICACIONES ==="

# 1. Verificar todos los archivos están presentes
echo ""
echo "📋 Verificando estructura..."
bash verify-riper5.sh .

# Debe mostrar: "🎉 ¡RIPER-5 está correctamente instalado!" y 17/17 verificado

# 2. Crear commit message descriptivo
COMMIT_MSG="v1.0.0: RIPER-5 OpenCode workflow template - Complete setup"
git commit -m "$COMMIT_MSG"
echo ""
echo "✅ Ready for GitHub push!"

# 3. Configurar remote (si necesario)
git remote add origin https://github.com/TU-USER/riper5-template.git 2>/dev/null || true

# 4. Empujar a GitHub
git branch -M main
git push -u origin main --tags

echo ""
echo "🎉 Template subido a GitHub!"
```

---

**Para subir al repositorio en GitHub:**

1. Ve a https://github.com/new
2. Crea nuevo repo (puede ser vacío)
3. Luego: `git remote add origin TU_URL_Y git push -u origin main`

---

**Opción alternativa:** Usar la interfaz web de GitHub:
- Ir a **Use this template** → **Create a new repository from this template**
- Elegir nombre y crear repo desde aquí
