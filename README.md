# 🔥 Solana Volume Bot V2 - Sistema Dual Completo

Sistema profesional de trading automático para Solana con dos modos:
- **Volume Bot**: Generación de volumen orgánico con anti-detección avanzada
- **Pump.fun Sniper**: Auto-sniper para nuevos tokens + Fast trading

## ✨ Características

### 🎯 Modo Volume Bot
- ✅ Generación de volumen orgánico indistinguible de actividad real
- ✅ Anti-detección avanzada (bubble maps, holder analysis)
- ✅ Wallets ilimitadas (genera cuantas quieras)
- ✅ Sistema de holders (15% wallets solo compran, nunca venden)
- ✅ Randomización verdadera (delays, cantidades, timing)
- ✅ Errores intencionales (3% trades "fallan" - parece humano)
- ✅ Pausas aleatorias (5-30 min, 2-4 veces/día)
- ✅ Profit farming (compra, espera, vende con ganancia)

### 🎯 Modo Pump.fun Sniper
- ✅ Monitoreo en tiempo real de pump.fun (WebSocket)
- ✅ Auto-snipe configurable con filtros
- ✅ Fast trading manual (Buy/Sell/Dump All)
- ✅ Ejecución paralela ultra-rápida (50+ wallets simultáneos)
- ✅ Live profit tracking
- ✅ Emergency dump (vende todo en 5-15 segundos)

### 🛠️ Herramientas Incluidas
- 📊 **Simulador de Volumen**: Previsualiza gráficos y costos
- 🧮 **Calculadora**: Planifica estrategia según objetivo
- 📚 **Guía Anti-Detección**: Paso a paso en español
- 💼 **Wallet Manager**: Import/Export JSON, balances, etiquetas
- 🔗 **Wallet Connect**: Integración con Phantom/Solflare

## 🚀 Quick Start

### Backend

```bash
cd backend
npm install
npm start
```

Backend corriendo en `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend corriendo en `http://localhost:3000`

## 📦 Estructura del Proyecto

```
volume-bot-v2/
├── backend/
│   ├── server.js          # API principal con dual mode
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletConnect.js
│   │   │   ├── WalletManager.js
│   │   │   ├── VolumeSimulator.js
│   │   │   ├── ContractMonitor.js
│   │   │   ├── FastTrading.js
│   │   │   └── AntiDetectionGuide.js
│   │   ├── App.js         # Componente principal
│   │   └── App.css        # Estilos completos
│   └── package.json
│
└── docs/
    ├── DEPLOYMENT.md      # Guía de deployment
    ├── USAGE.md           # Guía de uso
    └── API.md             # Documentación API
```

## 🔧 Configuración

### Variables de Entorno

**Backend (.env):**
```
PORT=5000
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Configuración Anti-Detección

El bot incluye configuración avanzada anti-detección:

```javascript
antiDetection: {
  enabled: true,
  holderPercentage: 15,      // 15% wallets solo compran
  intentionalErrors: true,    // 3% trades "fallan"
  errorRate: 0.03,
  randomPauses: true,
  pauseDuration: [300000, 1800000],  // 5-30 min
  trueRandomness: true,
  varianceHigh: 0.8          // ±80% varianza en cantidades
}
```

## 📊 Uso Básico

### 1. Generar Wallets

```bash
POST /api/wallets
{
  "action": "generate",
  "count": 100
}
```

### 2. Configurar Bot

```bash
POST /api/config
{
  "volumeBot": {
    "tokenAddress": "TOKEN_CA",
    "minTrade": 0.01,
    "maxTrade": 0.05,
    ...
  }
}
```

### 3. Iniciar Bot

```bash
POST /api/start
```

## 🎯 Modos de Operación

### Volume Bot (Orgánico)

Ideal para:
- Generar volumen en tokens establecidos
- Subir stats en DEX screener
- Actividad orgánica prolongada
- Anti-detección total

### Pump.fun Sniper (Agresivo)

Ideal para:
- Nuevos lanzamientos
- Trading rápido
- Profit inmediato
- Control manual total

## 🛡️ Anti-Detección

El sistema incluye múltiples capas de anti-detección:

1. **Wallets holders** (15% solo compran, nunca venden)
2. **Randomización verdadera** (exponential distribution)
3. **Errores intencionales** (3% trades cancelados)
4. **Pausas aleatorias** (parecer humano)
5. **Cantidades variables** (±80% varianza)
6. **Timing orgánico** (delays 15-180 seg)
7. **Rotación Pareto** (80/20 rule - algunas wallets muy activas)

## 📚 Documentación Completa

- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Guía de deployment
- [USAGE.md](./docs/USAGE.md) - Guía de uso completa
- [API.md](./docs/API.md) - Documentación API

## ⚠️ Disclaimer

Este software es solo para propósitos educativos. El uso de bots de trading puede violar los términos de servicio de algunos exchanges. Úsalo bajo tu propio riesgo.

## 📝 License

MIT License - Ver archivo LICENSE

## 🤝 Soporte

Para soporte o preguntas, abre un issue en GitHub.

---

**Desarrollado con 🔥 por Blackleets**
