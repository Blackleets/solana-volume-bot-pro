#!/bin/bash

# 🚀 Script Automatizado para Subir a GitHub
# Autor: Solana Volume Bot Pro
# Descripción: Automatiza el proceso de subir el proyecto a GitHub

echo "======================================"
echo "🚀 SOLANA VOLUME BOT - GitHub Upload"
echo "======================================"
echo ""

# Verificar si Git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado!"
    echo "Instala Git desde: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git encontrado: $(git --version)"
echo ""

# Solicitar información del usuario
read -p "📝 Ingresa tu nombre de usuario de GitHub: " GITHUB_USER
read -p "📝 Ingresa tu email de GitHub: " GITHUB_EMAIL

# Configurar Git
echo ""
echo "⚙️  Configurando Git..."
git config --global user.name "$GITHUB_USER"
git config --global user.email "$GITHUB_EMAIL"
echo "✅ Git configurado"

# Verificar si ya existe un repositorio
if [ -d ".git" ]; then
    echo ""
    echo "⚠️  Ya existe un repositorio Git en este directorio"
    read -p "¿Deseas reinicializarlo? (s/n): " REINIT
    if [ "$REINIT" = "s" ]; then
        rm -rf .git
        echo "✅ Repositorio anterior eliminado"
    fi
fi

# Inicializar Git
if [ ! -d ".git" ]; then
    echo ""
    echo "📦 Inicializando repositorio Git..."
    git init
    echo "✅ Repositorio inicializado"
fi

# Agregar archivos
echo ""
echo "📁 Agregando archivos al staging..."
git add .
echo "✅ Archivos agregados"

# Verificar archivos
echo ""
echo "📋 Archivos a subir:"
git status --short

# Crear commit
echo ""
read -p "📝 Mensaje del commit (o Enter para usar mensaje por defecto): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Initial commit: Solana Volume Bot with Dashboard"
fi

git commit -m "$COMMIT_MSG"
echo "✅ Commit creado"

# Configurar rama main
echo ""
echo "🌿 Configurando rama main..."
git branch -M main
echo "✅ Rama configurada"

# Configurar remote
echo ""
echo "🔗 Configurando repositorio remoto..."
REPO_URL="https://github.com/${GITHUB_USER}/solana-volume-bot-pro.git"
echo "URL del repositorio: $REPO_URL"

# Verificar si ya existe remote
if git remote | grep -q "origin"; then
    echo "⚠️  Remote 'origin' ya existe"
    read -p "¿Deseas actualizarlo? (s/n): " UPDATE_REMOTE
    if [ "$UPDATE_REMOTE" = "s" ]; then
        git remote set-url origin $REPO_URL
        echo "✅ Remote actualizado"
    fi
else
    git remote add origin $REPO_URL
    echo "✅ Remote agregado"
fi

# Mostrar instrucciones
echo ""
echo "======================================"
echo "📋 PRÓXIMOS PASOS:"
echo "======================================"
echo ""
echo "1️⃣  Ve a GitHub y crea un repositorio:"
echo "   https://github.com/new"
echo ""
echo "   Nombre: solana-volume-bot-pro"
echo "   Tipo: Private (recomendado)"
echo "   NO marques: README, .gitignore, ni licencia"
echo ""
echo "2️⃣  Después de crear el repositorio, presiona Enter aquí..."
read -p ""

# Subir a GitHub
echo ""
echo "🚀 Subiendo código a GitHub..."
echo "⚠️  Se te pedirá tu usuario y token de acceso personal"
echo ""
echo "📝 Para crear un Personal Access Token:"
echo "   1. Ve a: https://github.com/settings/tokens"
echo "   2. 'Generate new token' → 'Generate new token (classic)'"
echo "   3. Marca 'repo' (todos los permisos)"
echo "   4. Genera y COPIA el token"
echo "   5. Úsalo como contraseña cuando Git te lo pida"
echo ""

git push -u origin main

# Verificar resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "✅ ¡ÉXITO! Código subido a GitHub"
    echo "======================================"
    echo ""
    echo "🔗 Tu repositorio:"
    echo "   https://github.com/${GITHUB_USER}/solana-volume-bot-pro"
    echo ""
    echo "📋 Próximos pasos:"
    echo "   1. Ve a tu repositorio en GitHub"
    echo "   2. Verifica que todos los archivos están ahí"
    echo "   3. Continúa con el deployment en Vercel"
    echo ""
else
    echo ""
    echo "======================================"
    echo "❌ Error al subir a GitHub"
    echo "======================================"
    echo ""
    echo "Posibles causas:"
    echo "1. El repositorio no existe en GitHub"
    echo "2. Credenciales incorrectas"
    echo "3. Token sin permisos suficientes"
    echo ""
    echo "Solución:"
    echo "1. Verifica que creaste el repositorio en GitHub"
    echo "2. Usa un Personal Access Token, no tu contraseña"
    echo "3. El token debe tener permisos 'repo'"
    echo ""
fi
