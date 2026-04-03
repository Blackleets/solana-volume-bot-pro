# 🌐 GUÍA PASO A PASO: DEPLOYMENT EN VERCEL

## 📋 ÍNDICE
1. [Preparación](#preparación)
2. [Crear Cuenta en Vercel](#crear-cuenta-en-vercel)
3. [Deployment del Frontend](#deployment-del-frontend)
4. [Deployment del Backend](#deployment-del-backend)
5. [Conectar Frontend con Backend](#conectar-frontend-con-backend)
6. [Variables de Entorno](#variables-de-entorno)
7. [Obtener URLs Públicas](#obtener-urls-públicas)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## 1️⃣ PREPARACIÓN

### Requisitos Previos
- ✅ Código subido a GitHub
- ✅ Cuenta de Vercel (o crear una)
- ✅ Proyecto funcionando localmente

### Verificar en GitHub
1. Ve a: `https://github.com/TU_USUARIO/solana-volume-bot-pro`
2. Verifica que ves todos los archivos
3. Deberías ver:
   - `backend/` carpeta
   - `frontend/` carpeta
   - `README.md`
   - `package.json`

---

## 2️⃣ CREAR CUENTA EN VERCEL

### Paso 1: Registro

1. **Ve a Vercel:**
   - URL: https://vercel.com/signup

2. **Continuar con GitHub:**
   - Click en **"Continue with GitHub"**
   - Autoriza Vercel
   - Completa tu perfil

3. **Verificación:**
   - Verifica tu email si es necesario

### Paso 2: Conectar GitHub

1. **En Vercel Dashboard:**
   - Deberías ver: "Import Git Repository"

2. **Instalar Vercel en GitHub:**
   - Click en **"Install"** o **"Configure"**
   - Selecciona tu cuenta de GitHub
   - Elige acceso:
     - **"All repositories"** (todos)
     - O **"Only select repositories"** → selecciona `solana-volume-bot-pro`
   - Click **"Install & Authorize"**

---

## 3️⃣ DEPLOYMENT DEL FRONTEND (React Dashboard)

### Paso 1: Importar Proyecto

1. **En Vercel Dashboard:**
   - Click en **"New Project"**
   - Busca `solana-volume-bot-pro`
   - Click en **"Import"**

2. **Configurar Proyecto:**
   - **Project Name:** `solana-bot-frontend` (o el que prefieras)
   - **Framework Preset:** Selecciona **"Create React App"**
   - **Root Directory:** Click **"Edit"** → Selecciona **`frontend`**
   
3. **Build Settings:**
   - **Build Command:** `npm run build` (auto-detectado)
   - **Output Directory:** `build` (auto-detectado)
   - **Install Command:** `npm install` (auto-detectado)

4. **Environment Variables (por ahora dejar vacío):**
   - Lo configuraremos después

5. **Deploy:**
   - Click en **"Deploy"**
   - Espera 2-3 minutos

### Paso 2: Obtener URL del Frontend

Después del deployment:
- Verás: **"Congratulations! 🎉"**
- Copia la URL: `https://solana-bot-frontend.vercel.app` (ejemplo)
- **Guarda esta URL**, la necesitarás después

### Paso 3: Verificar Frontend (Provisional)

1. Click en **"Visit"** o ve a la URL
2. El dashboard cargará pero **no funcionará completamente** aún
3. Esto es normal (falta el backend)

---

## 4️⃣ DEPLOYMENT DEL BACKEND (Express API)

### ⚠️ IMPORTANTE: Limitaciones de Vercel para Backend

Vercel está diseñado para **serverless functions**, no para servidores persistentes.

**Esto significa:**
- ✅ El API funcionará
- ❌ El bot NO puede correr 24/7
- ❌ Las wallets NO persisten (se borran en cada request)
- ❌ El estado del bot se reinicia

**Para producción real, considera:**
- Railway (https://railway.app)
- Render (https://render.com)
- Fly.io (https://fly.io)
- VPS tradicional

**Pero para el dashboard y testing, Vercel funciona.**

### Paso 1: Crear Nuevo Proyecto para Backend

1. **En Vercel Dashboard:**
   - Click en **"New Project"**
   - Busca de nuevo `solana-volume-bot-pro`
   - Click en **"Import"**

2. **Configurar Proyecto:**
   - **Project Name:** `solana-bot-backend`
   - **Framework Preset:** **"Other"**
   - **Root Directory:** Click **"Edit"** → Selecciona **`backend`**

3. **Build Settings:**
   - **Build Command:** (dejar vacío)
   - **Output Directory:** (dejar vacío)
   - **Install Command:** `npm install`

4. **Deploy:**
   - Click en **"Deploy"**
   - Espera 2-3 minutos

### Paso 2: Obtener URL del Backend

Después del deployment:
- Copia la URL: `https://solana-bot-backend.vercel.app` (ejemplo)
- **Guarda esta URL**

---

## 5️⃣ CONECTAR FRONTEND CON BACKEND

Ahora que tienes ambas URLs, conecta el frontend al backend.

### Paso 1: Configurar Variable de Entorno en Frontend

1. **Ve a Frontend Project en Vercel:**
   - Dashboard → `solana-bot-frontend` → **Settings**

2. **Environment Variables:**
   - Click en **"Environment Variables"**
   - Click en **"Add"**

3. **Agregar Variable:**
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://solana-bot-backend.vercel.app/api`
     - ⚠️ **IMPORTANTE:** Reemplaza con tu URL real del backend
     - ⚠️ Agrega `/api` al final
   - **Environment:** Marca las 3 (Production, Preview, Development)
   - Click **"Save"**

### Paso 2: Redeploy Frontend

1. **Ve a Deployments:**
   - En el proyecto frontend → **Deployments**

2. **Redeploy:**
   - Click en los 3 puntos **"..."** del último deployment
   - Click en **"Redeploy"**
   - Click en **"Redeploy"** de nuevo para confirmar

3. **Espera:**
   - 1-2 minutos para el rebuild

---

## 6️⃣ CONFIGURAR CORS EN BACKEND

El backend necesita permitir requests desde el frontend.

### Opción A: Actualizar Código y Redeploy

**En tu código local:**

1. **Edita `backend/server.js`:**

```javascript
// Encuentra esta línea:
app.use(cors());

// Reemplázala por:
const allowedOrigins = [
  'http://localhost:3000',
  'https://solana-bot-frontend.vercel.app',  // Tu URL del frontend
  'https://tu-dominio-custom.com'  // Si tienes dominio custom
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
```

2. **Commit y Push:**

```bash
git add backend/server.js
git commit -m "Update CORS for Vercel deployment"
git push origin main
```

3. **Auto-Deploy:**
   - Vercel detectará el push
   - Hará redeploy automático
   - Espera 1-2 minutos

### Opción B: Variable de Entorno (Más Flexible)

**En Vercel Backend Project:**

1. Settings → Environment Variables
2. Agregar:
   - **Name:** `ALLOWED_ORIGINS`
   - **Value:** `https://solana-bot-frontend.vercel.app,http://localhost:3000`

3. Modificar código para leer esta variable:

```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];
```

---

## 7️⃣ OBTENER Y COMPARTIR URLs PÚBLICAS

### Frontend URL (Dashboard)
```
https://solana-bot-frontend.vercel.app
```

### Backend URL (API)
```
https://solana-bot-backend.vercel.app
```

### URLs con Dominio Custom (Opcional)

1. **En Vercel Dashboard:**
   - Ve a tu proyecto → **Settings** → **Domains**

2. **Agregar Dominio:**
   - Click en **"Add"**
   - Ingresa tu dominio
   - Sigue instrucciones para configurar DNS

---

## 8️⃣ VARIABLES DE ENTORNO (SEGURIDAD)

### ⚠️ REGLAS DE ORO

**NUNCA agregar en Variables de Entorno:**
- ❌ Private keys de wallets
- ❌ Seed phrases
- ❌ Contraseñas
- ❌ Tokens secretos

**¿Por qué?**
- Vercel es serverless (no persiste estado)
- Las wallets se perderían en cada request
- Riesgo de exposición

### Variables Seguras para el Frontend

```
REACT_APP_API_URL = https://tu-backend.vercel.app/api
```

### Variables Seguras para el Backend

```
NODE_ENV = production
PORT = 5000
```

### ¿Cómo Manejar Wallets en Vercel?

**Opción 1: Generar en el Dashboard (Recomendado)**
- Usa el botón "Generate Wallets"
- Guarda las keys localmente
- No las subas a Vercel

**Opción 2: Base de Datos Externa**
- MongoDB Atlas
- PostgreSQL (Supabase)
- Firebase
- Almacena wallets cifradas

**Opción 3: Wallet Management Service**
- Usar un servicio dedicado
- Solo el frontend se despliega en Vercel
- El backend con wallets en servidor dedicado

---

## 9️⃣ TESTING DEL DEPLOYMENT

### Test 1: Frontend Carga

1. Ve a: `https://tu-frontend.vercel.app`
2. Deberías ver:
   - ✅ Dashboard con gradientes purple/pink
   - ✅ Header "Solana Volume Bot Dashboard"
   - ✅ Botones de control
   - ✅ Stats cards mostrando "0"

### Test 2: API Conectada

1. **Abre DevTools:**
   - Presiona **F12**
   - Ve a tab **"Console"**

2. **Verifica Conexión:**
   - Deberías ver requests a tu backend
   - Si hay errores CORS, vuelve a configurar

3. **Prueba Funcionalidad:**
   - Click en "Configure Bot"
   - Debería abrir el modal
   - Click en "Manage Wallets"
   - Debería abrir el modal

### Test 3: Generar Wallets

1. Click en **"Manage Wallets"**
2. Genera 1 wallet de prueba
3. Si funciona:
   - ✅ Backend está respondiendo
   - ✅ Frontend está conectado correctamente

---

## 🐛 TROUBLESHOOTING

### Error: "API request failed"

**Causa:** Frontend no puede conectarse al backend

**Solución:**
1. Verifica `REACT_APP_API_URL` en frontend
2. Debe ser: `https://tu-backend.vercel.app/api`
3. Redeploy frontend después de cambiar

### Error: CORS

**Síntomas:**
```
Access to fetch at 'https://...' from origin 'https://...' 
has been blocked by CORS policy
```

**Solución:**
1. Verifica CORS en `backend/server.js`
2. Agrega la URL del frontend al array de allowed origins
3. Push cambios a GitHub
4. Espera auto-deploy

### Error: "404 Not Found" en Backend

**Causa:** Vercel no puede encontrar el servidor

**Solución:**
1. Verifica que `backend/vercel.json` existe
2. Verifica que `server.js` está en la carpeta `backend/`
3. Redeploy

### Frontend muestra página en blanco

**Causa:** Build falló o variables de entorno faltantes

**Solución:**
1. Ve a Deployments → Ver logs
2. Busca errores en el build
3. Verifica que `REACT_APP_API_URL` está configurado
4. Redeploy

### Bot no persiste el estado

**Causa:** Vercel es serverless

**Solución:**
- Esto es esperado en Vercel
- Para persistencia real, usa Railway o VPS
- Vercel es solo para UI/testing

---

## 📋 CHECKLIST FINAL

Antes de considerar completo:

### Frontend
- [ ] Proyecto desplegado en Vercel
- [ ] URL pública funciona
- [ ] Dashboard carga correctamente
- [ ] No hay errores en consola (F12)
- [ ] Variable `REACT_APP_API_URL` configurada

### Backend
- [ ] Proyecto desplegado en Vercel
- [ ] URL pública responde
- [ ] CORS configurado
- [ ] API endpoints funcionan
- [ ] No requiere variables sensibles

### Integración
- [ ] Frontend se conecta al backend
- [ ] Modales abren correctamente
- [ ] Se pueden generar wallets
- [ ] Stats se actualizan (aunque sea en 0)
- [ ] Logs panel muestra mensajes

### Seguridad
- [ ] NO hay private keys en código
- [ ] NO hay private keys en variables de entorno
- [ ] .gitignore incluye archivos sensibles
- [ ] Repositorio es privado (recomendado)

---

## 🎯 PRÓXIMOS PASOS

### Para Uso en Producción Real

1. **Migrar Backend a Servidor Dedicado:**
   - Railway (gratis tier disponible)
   - Render (gratis tier disponible)
   - Fly.io
   - DigitalOcean/Linode VPS

2. **Configurar Base de Datos:**
   - Para persistir wallets
   - Para guardar histórico
   - MongoDB o PostgreSQL

3. **Implementar Autenticación:**
   - Para proteger el dashboard
   - Auth0, Clerk, o custom

4. **Monitoreo:**
   - Logs centralizados
   - Alertas
   - Métricas

---

## 🎉 ¡FELICITACIONES!

Tu Solana Volume Bot ahora está:
- ✅ En GitHub (código fuente)
- ✅ En Vercel (accesible públicamente)
- ✅ Con dashboard funcional
- ✅ Con API conectada

**URLs para compartir:**
- Dashboard: `https://tu-frontend.vercel.app`
- API: `https://tu-backend.vercel.app`

---

**Siguiente paso:** Ver `GITHUB_VERCEL_GUIDE.md` para comandos completos de Git
