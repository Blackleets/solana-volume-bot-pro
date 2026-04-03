# 🚀 GUÍA DE DEPLOYMENT: GITHUB + VERCEL

## 📋 REQUISITOS PREVIOS

Antes de comenzar, asegúrate de tener:

- [x] Cuenta de GitHub (https://github.com/signup)
- [x] Cuenta de Vercel (https://vercel.com/signup)
- [x] Git instalado en tu computadora
- [x] Tu proyecto funcionando localmente

---

## 1️⃣ PREPARACIÓN DEL PROYECTO

### Paso 1: Navegar al proyecto

```bash
cd /home/claude/solana-volume-bot-pro
```

### Paso 2: Verificar que tienes todos los archivos

```bash
ls -la
```

Deberías ver:
- ✅ `backend/` (carpeta)
- ✅ `frontend/` (carpeta)
- ✅ `package.json`
- ✅ `vercel.json`
- ✅ `.gitignore`
- ✅ `README.md`

---

## 2️⃣ CREAR REPOSITORIO EN GITHUB

### Opción A: Desde la Web (Más Fácil)

1. **Ir a GitHub:**
   - Abre https://github.com
   - Inicia sesión

2. **Crear Nuevo Repositorio:**
   - Click en el botón verde **"New"** (esquina superior derecha)
   - O ve a: https://github.com/new

3. **Configurar Repositorio:**
   - **Repository name:** `solana-volume-bot-pro`
   - **Description:** (opcional) "Professional Solana Volume Bot with Dashboard"
   - **Public** o **Private:** Tu elección
     - ⚠️ Si es público, todos pueden ver el código
     - ✅ Recomiendo **Private** para bots de trading
   - ❌ **NO** marques "Add a README file"
   - ❌ **NO** marques "Add .gitignore"
   - ❌ **NO** selecciones licencia
   - Click **"Create repository"**

4. **Copiar la URL del repositorio:**
   - Verás una página con instrucciones
   - Copia la URL que aparece (ejemplo: `https://github.com/TU_USUARIO/solana-volume-bot-pro.git`)

### Opción B: Desde GitHub CLI (Avanzado)

```bash
# Instalar GitHub CLI primero
# https://cli.github.com/

# Crear repositorio
gh repo create solana-volume-bot-pro --private --source=. --remote=origin
```

---

## 3️⃣ SUBIR PROYECTO A GITHUB

### Paso 1: Inicializar Git en tu proyecto

```bash
cd /home/claude/solana-volume-bot-pro

# Inicializar repositorio git
git init
```

**Resultado esperado:**
```
Initialized empty Git repository in /home/claude/solana-volume-bot-pro/.git/
```

### Paso 2: Configurar Git (si es primera vez)

```bash
# Configurar tu nombre
git config --global user.name "Tu Nombre"

# Configurar tu email (el mismo de GitHub)
git config --global user.email "tu.email@ejemplo.com"
```

### Paso 3: Agregar archivos al staging

```bash
# Agregar TODOS los archivos
git add .

# Verificar qué se agregó
git status
```

**Resultado esperado:**
```
On branch main
Changes to be committed:
  new file:   .gitignore
  new file:   README.md
  new file:   backend/package.json
  new file:   backend/server.js
  new file:   frontend/package.json
  ...
```

### Paso 4: Hacer el primer commit

```bash
git commit -m "Initial commit: Solana Volume Bot with Dashboard"
```

**Resultado esperado:**
```
[main (root-commit) abc1234] Initial commit: Solana Volume Bot with Dashboard
 20 files changed, 2500 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 README.md
 ...
```

### Paso 5: Conectar con GitHub

Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub:

```bash
git remote add origin https://github.com/TU_USUARIO/solana-volume-bot-pro.git

# Verificar que se agregó correctamente
git remote -v
```

**Resultado esperado:**
```
origin  https://github.com/TU_USUARIO/solana-volume-bot-pro.git (fetch)
origin  https://github.com/TU_USUARIO/solana-volume-bot-pro.git (push)
```

### Paso 6: Cambiar rama a 'main' (si es necesario)

```bash
# Verificar rama actual
git branch

# Si dice 'master', cambiar a 'main'
git branch -M main
```

### Paso 7: Subir código a GitHub

```bash
git push -u origin main
```

**Si te pide autenticación:**

#### Para HTTPS:
- **Usuario:** Tu nombre de usuario de GitHub
- **Contraseña:** Usar un **Personal Access Token**, NO tu contraseña

**Crear Personal Access Token:**
1. Ve a: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. **Note:** "Vercel Deployment"
4. **Expiration:** 90 days (o lo que prefieras)
5. **Select scopes:** Marca "repo" (todos los permisos de repositorio)
6. Click "Generate token"
7. **COPIA EL TOKEN** (solo se muestra una vez)
8. Úsalo como contraseña cuando Git te lo pida

#### Para SSH (Alternativa):
```bash
# Cambiar a SSH
git remote set-url origin git@github.com:TU_USUARIO/solana-volume-bot-pro.git

# Configurar SSH key (si no tienes)
ssh-keygen -t ed25519 -C "tu.email@ejemplo.com"
cat ~/.ssh/id_ed25519.pub  # Copiar y agregar a GitHub
```

**Resultado esperado después de push:**
```
Enumerating objects: 25, done.
Counting objects: 100% (25/25), done.
Delta compression using up to 8 threads
Compressing objects: 100% (20/20), done.
Writing objects: 100% (25/25), 50.12 KiB | 5.01 MiB/s, done.
Total 25 (delta 2), reused 0 (delta 0), pack-reused 0
To https://github.com/TU_USUARIO/solana-volume-bot-pro.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### Paso 8: Verificar en GitHub

1. Ve a: `https://github.com/TU_USUARIO/solana-volume-bot-pro`
2. Deberías ver todos tus archivos
3. ✅ Proyecto subido exitosamente!

---

## 4️⃣ DESPLEGAR EN VERCEL

### Paso 1: Crear cuenta en Vercel

1. Ve a: https://vercel.com/signup
2. Click en **"Continue with GitHub"**
3. Autoriza Vercel para acceder a tu GitHub
4. Completa el registro

### Paso 2: Importar Proyecto

1. **En Vercel Dashboard:**
   - Click en **"Add New..."** → **"Project"**
   - O ve directamente a: https://vercel.com/new

2. **Importar Repositorio de GitHub:**
   - Si es la primera vez, click en **"Install Vercel"** en GitHub
   - Selecciona tu cuenta de GitHub
   - Elige:
     - **"All repositories"** (todos)
     - O **"Only select repositories"** → selecciona `solana-volume-bot-pro`
   - Click **"Install"**

3. **Seleccionar Proyecto:**
   - Busca `solana-volume-bot-pro` en la lista
   - Click en **"Import"**

### Paso 3: Configurar Proyecto

**En la página de configuración:**

1. **Project Name:**
   - Deja: `solana-volume-bot-pro`
   - O personaliza (ejemplo: `my-volume-bot`)

2. **Framework Preset:**
   - Debería detectar: **"Create React App"**
   - Si no, selecciona: **"Other"**

3. **Root Directory:**
   - Deja: `./` (raíz del proyecto)

4. **Build and Output Settings:**

   Para el **Frontend**:
   ```
   Build Command: cd frontend && npm install && npm run build
   Output Directory: frontend/build
   Install Command: npm install
   ```

   ⚠️ **IMPORTANTE:** Vercel NO puede ejecutar ambos (frontend + backend) con la configuración estándar. Necesitamos un enfoque diferente.

### ENFOQUE CORRECTO: Dos Deployments Separados

#### Deployment 1: Frontend (React Dashboard)

1. **Crear nuevo proyecto en Vercel:**
   - Nombre: `solana-volume-bot-frontend`
   - Framework: **Create React App**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

2. **Variables de Entorno para Frontend:**
   - Click en **"Environment Variables"**
   - Agregar:
     ```
     REACT_APP_API_URL = https://tu-backend.vercel.app/api
     ```
   - (Actualizar después de desplegar backend)

3. **Click en "Deploy"**

#### Deployment 2: Backend (Express API)

1. **Crear OTRO proyecto en Vercel:**
   - Nombre: `solana-volume-bot-backend`
   - Framework: **Other**
   - Root Directory: `backend`
   - Build Command: (dejar vacío)
   - Output Directory: (dejar vacío)

2. **Configurar como Serverless Function:**

Necesitamos crear un archivo especial para Vercel:

Crear `backend/api/index.js`:

```javascript
// Este archivo envuelve tu server.js para Vercel
const app = require('../server');

module.exports = app;
```

Y modificar `backend/server.js` para exportar la app:

```javascript
// Al final del archivo, cambiar:
// app.listen(PORT, () => { ... });

// Por:
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
```

3. **Variables de Entorno para Backend:**
   - No agregar wallets aquí (inseguro)
   - Solo configuración general

---

## 5️⃣ CONFIGURACIÓN DE VARIABLES DE ENTORNO

### ⚠️ IMPORTANTE SOBRE SEGURIDAD

**NUNCA subas a GitHub o Vercel:**
- ❌ Private keys de wallets
- ❌ Seed phrases
- ❌ API keys privadas

### Variables Seguras para Vercel

**Para el Backend:**

1. En Vercel Dashboard → Tu proyecto backend → Settings → Environment Variables
2. Agregar:

```
NODE_ENV = production
PORT = 5000
```

**Para el Frontend:**

1. En Vercel Dashboard → Tu proyecto frontend → Settings → Environment Variables
2. Agregar:

```
REACT_APP_API_URL = https://tu-backend-deployment.vercel.app/api
```

### Gestión de Wallets (Recomendado)

**Opción 1: Generar wallets en la interfaz**
- Usar el botón "Generate Wallets" en el dashboard
- Guardar las private keys localmente
- Importarlas cuando necesites

**Opción 2: Variable de entorno encriptada**
- Encriptar tus private keys
- Guardar la clave de encriptación en Vercel
- Desencriptar en runtime

**Opción 3: Vault externo (Más seguro)**
- Usar servicios como:
  - HashiCorp Vault
  - AWS Secrets Manager
  - Google Secret Manager
- Acceder a las wallets vía API

---

## 6️⃣ ACTUALIZAR CÓDIGO PARA VERCEL

### Modificar Frontend para usar API de Vercel

Edita `frontend/src/App.js`:

```javascript
// Cambiar:
const API_URL = 'http://localhost:5000/api';

// Por:
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Modificar Backend para CORS

Edita `backend/server.js`:

```javascript
// Agregar después de las importaciones:
const cors = require('cors');

// Configurar CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://tu-frontend.vercel.app'  // Reemplazar con tu URL
  ],
  credentials: true
}));
```

### Rebuild y Redeploy

```bash
# Hacer commit de los cambios
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

Vercel detectará los cambios y hará auto-deploy!

---

## 7️⃣ OBTENER URLS PÚBLICAS

### Después del deployment:

1. **Frontend URL:**
   - Vercel te dará: `https://solana-volume-bot-frontend.vercel.app`
   - O personalizada: `https://tu-dominio-custom.com`

2. **Backend URL:**
   - Vercel te dará: `https://solana-volume-bot-backend.vercel.app`

3. **Actualizar Frontend con Backend URL:**
   - Ve a Frontend project → Settings → Environment Variables
   - Actualiza `REACT_APP_API_URL` con la URL real del backend
   - Redeploy el frontend

---

## 8️⃣ COMANDOS DE GIT PARA FUTURAS ACTUALIZACIONES

```bash
# Ver estado
git status

# Agregar cambios
git add .

# Commit
git commit -m "Descripción de cambios"

# Subir a GitHub
git push origin main

# Vercel hará auto-deploy automáticamente!
```

---

## 🎯 RESUMEN DE COMANDOS COMPLETOS

```bash
# 1. INICIALIZAR GIT
cd /home/claude/solana-volume-bot-pro
git init
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# 2. PRIMER COMMIT
git add .
git commit -m "Initial commit: Solana Volume Bot"

# 3. CONECTAR A GITHUB (reemplazar TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/solana-volume-bot-pro.git
git branch -M main
git push -u origin main

# 4. FUTURAS ACTUALIZACIONES
git add .
git commit -m "Update: descripción"
git push origin main
```

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### Error: "failed to push some refs"
```bash
git pull origin main --rebase
git push origin main
```

### Error: "Permission denied (publickey)"
- Usar HTTPS en vez de SSH
- O configurar SSH key en GitHub

### Error: "refusing to merge unrelated histories"
```bash
git pull origin main --allow-unrelated-histories
```

### Vercel deployment failed
- Revisar logs en Vercel Dashboard
- Verificar que package.json tiene los scripts correctos
- Verificar variables de entorno

### CORS errors en producción
- Agregar la URL de Vercel al array de CORS en backend
- Verificar que API_URL en frontend es correcto

---

## 🎉 CHECKLIST FINAL

Antes de considerar terminado:

- [ ] Repositorio creado en GitHub
- [ ] Código subido exitosamente
- [ ] Frontend desplegado en Vercel
- [ ] Backend desplegado en Vercel
- [ ] URLs públicas funcionando
- [ ] CORS configurado correctamente
- [ ] Variables de entorno configuradas
- [ ] Frontend se conecta al backend
- [ ] Dashboard carga correctamente
- [ ] Wallets se pueden generar
- [ ] Bot se puede iniciar/detener
- [ ] NO hay private keys expuestas

---

## 📞 SOPORTE

Si tienes problemas:

1. Revisa los logs en Vercel Dashboard
2. Revisa la consola del navegador (F12)
3. Verifica que las URLs son correctas
4. Asegúrate que CORS está configurado

---

## 🔐 NOTA IMPORTANTE DE SEGURIDAD

**Para uso en producción con wallets reales:**

1. **NO uses Vercel para el backend con wallets reales**
   - Vercel es serverless → las wallets no persisten
   - Mejor usar: Railway, Render, o VPS dedicado

2. **Usa el dashboard de Vercel solo para monitoreo**
   - Ejecuta el bot en un servidor dedicado
   - Usa el dashboard solo para ver estadísticas

3. **Para producción real:**
   - Despliega frontend en Vercel (solo UI)
   - Despliega backend en Railway/Render/VPS
   - Conecta frontend al backend en servidor dedicado

---

**¡Listo! Tu proyecto ahora está en GitHub y desplegado en Vercel! 🚀**
