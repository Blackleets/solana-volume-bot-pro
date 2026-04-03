# 🚀 Guía de Deployment - Solana Volume Bot V2

## 📋 Opciones de Deployment

### Opción 1: Local (Desarrollo/Uso Personal)
### Opción 2: Vercel (Frontend) + Render (Backend)
### Opción 3: Railway (Todo en uno)
### Opción 4: VPS (Control total)

---

## 🏠 OPCIÓN 1: LOCAL (MÁS FÁCIL PARA EMPEZAR)

### Requisitos
- Node.js 16+ instalado
- Git instalado

### Pasos

**1. Clonar/Descargar proyecto**

```bash
git clone https://github.com/Blackleets/volume-bot-v2
cd volume-bot-v2
```

**2. Instalar Backend**

```bash
cd backend
npm install
```

**3. Iniciar Backend**

```bash
npm start
```

Backend corriendo en `http://localhost:5000`

**4. Instalar Frontend (nueva terminal)**

```bash
cd frontend
npm install
```

**5. Iniciar Frontend**

```bash
npm start
```

Frontend corriendo en `http://localhost:3000`

**6. Abrir en navegador**

```
http://localhost:3000
```

✅ **Listo para usar!**

---

## ☁️ OPCIÓN 2: VERCEL + RENDER (RECOMENDADO)

### Frontend en Vercel (Gratis)

**1. Crear cuenta en Vercel**
- Ve a https://vercel.com
- Sign up con GitHub

**2. Conectar GitHub repo**
- New Project
- Import tu repositorio
- Root Directory: `frontend`
- Framework Preset: `Create React App`

**3. Variables de entorno**
```
REACT_APP_API_URL=https://tu-backend.onrender.com/api
```

**4. Deploy**
- Click Deploy
- Espera 2-3 minutos
- ✅ Frontend listo

### Backend en Render (Gratis con límites)

**1. Crear cuenta en Render**
- Ve a https://render.com
- Sign up con GitHub

**2. Crear Web Service**
- New → Web Service
- Connect tu repositorio
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

**3. Variables de entorno**
```
PORT=5000
```

**4. Deploy**
- Click Create Web Service
- Espera 3-5 minutos
- ✅ Backend listo

**5. Actualizar Frontend**
- Ve a Vercel
- Settings → Environment Variables
- Actualiza `REACT_APP_API_URL` con la URL de Render
- Redeploy

---

## 🚂 OPCIÓN 3: RAILWAY (TODO EN UNO)

**1. Crear cuenta**
- https://railway.app
- Sign up con GitHub

**2. New Project**
- Deploy from GitHub repo
- Select repository

**3. Configure Backend**
- Add service: backend
- Root Directory: `/backend`
- Start Command: `npm start`
- Add domain

**4. Configure Frontend**
- Add service: frontend
- Root Directory: `/frontend`
- Build Command: `npm run build`
- Start Command: `npm start`
- Variables: `REACT_APP_API_URL=<backend-url>/api`
- Add domain

**5. Deploy**
- Ambos servicios se deployean automáticamente
- ✅ Listo

---

## 🖥️ OPCIÓN 4: VPS (DIGITALOCEAN/AWS/ETC)

### Requisitos
- VPS Ubuntu 22.04
- 2GB RAM mínimo
- Acceso SSH

### Pasos

**1. Conectar por SSH**

```bash
ssh root@tu-ip
```

**2. Instalar Node.js**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**3. Instalar PM2**

```bash
npm install -g pm2
```

**4. Clonar proyecto**

```bash
git clone https://github.com/Blackleets/volume-bot-v2
cd volume-bot-v2
```

**5. Setup Backend**

```bash
cd backend
npm install
pm2 start server.js --name volume-bot-backend
pm2 save
pm2 startup
```

**6. Setup Frontend**

```bash
cd ../frontend
npm install
npm run build
```

**7. Instalar Nginx**

```bash
sudo apt install nginx
```

**8. Configurar Nginx**

```bash
sudo nano /etc/nginx/sites-available/volume-bot
```

Pegar:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        root /root/volume-bot-v2/frontend/build;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**9. Activar sitio**

```bash
sudo ln -s /etc/nginx/sites-available/volume-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**10. Firewall**

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

✅ **Accede via http://tu-ip**

---

## 🔒 SSL (HTTPS) - Opcional pero Recomendado

### Con Certbot (Gratis)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

Sigue las instrucciones. Certbot configurará SSL automáticamente.

---

## 🔧 Troubleshooting

### Backend no conecta

**Verifica:**
```bash
curl http://localhost:5000/api/health
```

Debería responder: `{"status":"ok"}`

### Frontend no carga

**Verifica consola del navegador:**
- F12 → Console
- Mira errores de CORS o network

**Solución CORS:**
En `backend/server.js`:
```javascript
app.use(cors({
  origin: 'https://tu-frontend.vercel.app'
}));
```

### Wallets no se generan

**Verifica instalación:**
```bash
cd backend
npm list @solana/web3.js
npm list bs58
```

Si falta alguna:
```bash
npm install @solana/web3.js bs58 --save
```

---

## 📊 Monitoreo

### Ver logs (PM2)

```bash
pm2 logs volume-bot-backend
pm2 monit
```

### Ver status

```bash
pm2 status
```

### Restart

```bash
pm2 restart volume-bot-backend
```

---

## 🔄 Actualizar Código

### Local

```bash
git pull
cd backend && npm install
cd ../frontend && npm install
```

Reiniciar servicios.

### Vercel/Render

- Push a GitHub
- Auto-deploy automático

### VPS

```bash
cd /root/volume-bot-v2
git pull
cd backend && npm install
pm2 restart volume-bot-backend
cd ../frontend && npm install && npm run build
sudo systemctl reload nginx
```

---

## 💡 Tips

1. **Usa PM2 en producción** - Auto-restart si crashea
2. **Activa SSL** - Navegadores modernos lo requieren para Wallet Connect
3. **Backups** - Guarda tus wallets exportados
4. **Monitoreo** - Revisa logs regularmente
5. **Updates** - Mantén dependencias actualizadas

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa logs
2. Verifica network connectivity
3. Chequea variables de entorno
4. Abre un issue en GitHub

---

**¡Éxito con tu deployment!** 🚀
