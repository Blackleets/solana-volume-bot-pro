# 📖 Guía de Uso - Solana Volume Bot V2

## 🎯 Introducción

Este bot tiene DOS modos principales:
1. **Volume Bot** - Para generar volumen orgánico
2. **Pump.fun Sniper** - Para snipear nuevos tokens

## 🚀 Primeros Pasos

### 1. Conectar Wallet (Opcional pero Recomendado)

- Click "Connect Wallet" en la esquina superior derecha
- Selecciona Phantom/Solflare
- Aprobar conexión

**Nota:** Esta wallet es solo para control. NO se usa para trading.

### 2. Generar Wallets del Bot

#### Ir a pestaña "💼 Wallets"

**Opción A: Generar Nuevas**
1. Ingresa cantidad (10, 100, 500, 1000... sin límite)
2. Click "✨ Generate Wallets"
3. **IMPORTANTE:** Descarga el JSON automáticamente
4. Guarda el archivo en lugar seguro

**Opción B: Importar Existentes**
1. Click "📥 Import JSON"
2. Selecciona archivo de wallets previo
3. Las wallets se cargan al sistema

---

## 📊 MODO 1: VOLUME BOT

### Objetivo
Generar volumen orgánico que parezca actividad real humana.

### Paso a Paso

#### 1. Fondear Wallets

**⚠️ CRÍTICO PARA ANTI-DETECCIÓN:**

**❌ MAL (Bot obvio):**
- Enviar 1.0 SOL a todas desde tu wallet principal
- Todas al mismo tiempo

**✅ BIEN (Orgánico):**
- Crear 3-5 wallets "fuente"
- Enviar cantidades variables: 0.5, 0.7, 1.2, 0.9, 1.5 SOL
- Espaciar envíos 10-30 minutos

**Ejemplo:**
```
10:00 AM - Wallet fuente A → 20 wallets (0.5-1.5 SOL c/u)
10:20 AM - Wallet fuente B → 20 wallets (0.3-1.2 SOL c/u)
10:45 AM - Wallet fuente C → 20 wallets (0.7-1.8 SOL c/u)
```

#### 2. Configurar Token

En Dashboard:
1. Pega la dirección del token (CA)
2. Configura trade amounts:
   - Min: 0.01 SOL
   - Max: 0.05 SOL
3. Delays:
   - Min: 15 segundos
   - Max: 180 segundos

#### 3. Activar Anti-Detección

**Asegúrate que esté ON:**
- ✅ Randomización avanzada
- ✅ Errores intencionales (3%)
- ✅ Holders permanentes (15%)
- ✅ Pausas aleatorias
- ✅ Varianza alta (80%)

#### 4. Simular Antes de Empezar

1. Ve a pestaña "🧮 Simulator"
2. Configura:
   - Wallets: Tu cantidad
   - SOL per wallet: Promedio
   - Duration: 1-24 horas
3. Click "▶️ Run Simulation"
4. Revisa:
   - Volumen proyectado
   - Fees estimados
   - Risk de detección

#### 5. Iniciar Bot

1. Vuelve a "📈 Dashboard"
2. Selecciona modo "📊 Volume Bot"
3. Click "🟢 Start Bot"
4. Monitorea logs en tiempo real

#### 6. Monitorear

**Stats en vivo:**
- Total Volume
- Trades Executed
- Volume per Hour

**Logs:**
- Verde = Trade exitoso
- Amarillo = Warning (normal)
- Rojo = Error (si es >5%, revisar)

#### 7. Detener

Click "🔴 Stop Bot" cuando:
- Alcanzaste objetivo de volumen
- Se acabó el SOL
- Necesitas ajustar config

---

## 🎯 MODO 2: PUMP.FUN SNIPER

### Objetivo
Snipear nuevos tokens en pump.fun para profit rápido.

### Paso a Paso

#### 1. Preparar Wallets

- Genera 50-100 wallets
- Fondea cada una con 0.5-1.0 SOL
- Más wallets = Más poder de snipe

#### 2. Activar Monitoreo

1. Cambia a modo "🎯 Pump Sniper"
2. El bot empieza a monitorear pump.fun automáticamente
3. Verás "🟢 MONITORING ACTIVE"

#### 3. Configurar Filtros

En Dashboard:
- Min Liquidity: 5 SOL
- Max Liquidity: 100 SOL
- Max Holders: 20

**Por qué filtros:**
- Muy baja liq = Precio crashea fácil
- Muy alta liq = Difícil mover precio
- Muchos holders = Ya no estás early

#### 4. Auto-Snipe ON/OFF

**Auto-Snipe ON:**
- Bot compra automáticamente cuando detecta token que pasa filtros
- Sin intervención humana
- Más rápido

**Auto-Snipe OFF (Manual):**
- Bot te alerta de nuevos tokens
- Tú decides si snipear o skip
- Más control

#### 5. Monitorear Feed

En "📡 Contract Monitor" verás:
- Nuevos tokens detectados en tiempo real
- Nombre, CA, liquidez, holders
- Tiempo desde lanzamiento

**Para cada token:**
- 🎯 Snipe Now - Compra con tus wallets
- ❌ Skip - Ignora este token

#### 6. Fast Trading Manual

En "⚡ Fast Trading":

**Buy Now:**
1. Pega CA del token
2. Configura amount per wallet
3. Selecciona # de wallets
4. Click "🟢 BUY NOW"
5. Ejecuta en 2-3 segundos

**Dump All:**
1. Click "🔴 DUMP ALL"
2. Confirma
3. Vende de TODAS las wallets en 5-15 segundos
4. Recupera SOL + profit

#### 7. Estrategia Recomendada

**Quick Flip (Bajo riesgo):**
```
1. Token nuevo detectado
2. Auto-snipe con 50 wallets × 0.5 SOL = 25 SOL
3. Precio sube 50-100%
4. Dump all a los 2-3 minutos
5. Profit: 10-20 SOL (+40-80%)
```

**Moon Shot (Alto riesgo):**
```
1. Token nuevo detectado
2. Auto-snipe con 20 wallets × 0.5 SOL = 10 SOL
3. Esperas pump orgánico de otros
4. Si sube 500%+ → Dump all
5. Si empieza a caer → Emergency dump
6. Profit potencial: 40+ SOL o pérdida total
```

---

## 🧮 USO DEL SIMULADOR

### Para qué sirve

Antes de iniciar el bot, el simulador te muestra:
- Cuánto volumen generarás
- Cuánto SOL necesitas
- Cuánto perderás en fees
- Cómo se verá el gráfico
- Risk de detección

### Cómo usar

1. Ve a "🧮 Simulator"
2. Configura:
   - Wallets: 100
   - SOL per wallet: 0.5
   - Duration: 24 hours
3. Click "▶️ Run Simulation"
4. Analiza resultados:
   - "Total Volume: 400 SOL"
   - "Fee Loss: 40 SOL"
   - "Detection Risk: ✅ Safe"
5. Ajusta si es necesario

---

## 📚 GUÍA ANTI-DETECCIÓN

### Léela COMPLETA antes de empezar

La guía incluye:

**Sección 1: Introducción**
- Por qué importa
- Qué detectan

**Sección 2: Bubble Maps**
- Cómo funcionan
- Qué buscan
- Ejemplos visuales

**Sección 3: Paso a Paso**
- Configuración óptima
- Cómo fondear
- Qué evitar

**Sección 4: Escenarios**
- Token nuevo (bajo presupuesto)
- Push moderado
- Volumen profesional

**Sección 5: Checklist**
- Lista pre-ejecución
- Verifica TODOS los puntos

### Consejos Clave

1. **Fondeo es lo MÁS importante**
   - Cantidades variables
   - Múltiples fuentes
   - Espaciado en tiempo

2. **Activa TODA la anti-detección**
   - Randomización
   - Errores intencionales
   - Holders
   - Pausas

3. **Calidad > Velocidad**
   - Mejor 50 SOL orgánico que 500 SOL obvio
   - Paciencia = Éxito

---

## ⚠️ Errores Comunes y Soluciones

### Error: "No wallets available"
**Solución:** Genera wallets primero en pestaña Wallets

### Error: "Insufficient balance"
**Solución:** Fondea las wallets con SOL

### Error: "Swap failed"
**Solución:** 
- Verifica que token CA sea correcto
- Chequea liquidez del pool
- Aumenta slippage

### Volumen muy bajo
**Solución:**
- Aumenta # de wallets activas
- Reduce delays (mínimo 15 seg)
- Verifica que wallets tengan balance

### Detectado como bot
**Solución:**
- **LEE LA GUÍA ANTI-DETECCIÓN**
- Fondea correctamente (CRÍTICO)
- Activa todas las features anti-detección

### Auto-snipe no funciona
**Solución:**
- Verifica que bot esté en modo Sniper
- Chequea que monitoring esté active
- Revisa filtros (tal vez demasiado restrictivos)

---

## 💡 Tips Pro

### Volume Bot

1. **Start slow:** Primeras 2 horas con menos wallets activas
2. **Peak hours:** Más actividad durante horarios US/EU
3. **Gradual:** No pasar de 0 a 100% actividad instant
4. **Mix it up:** Algunos días más, algunos menos
5. **Profit farm:** Deja que algunas compras suban antes de vender

### Pump.fun Sniper

1. **Be early:** Primeros 10 segundos = Mayor profit
2. **Quick exit:** Si token no pumpa en 5 min, dump
3. **Size matters:** 20-50 SOL buy puede mover 2-5 SOL liq pools
4. **RPC premium:** Invierte en RPC rápido para ventaja
5. **Stop loss:** Si baja -20%, dump y next

---

## 📊 Métricas de Éxito

### Volume Bot

**Bueno:**
- Volumen generado > 20x SOL inicial
- <10% pérdida en fees
- No detectado en bubble maps
- Actividad aparenta orgánica

**Excelente:**
- Volumen generado > 30x SOL inicial
- <8% pérdida en fees
- Profit positivo (gracias a farming)
- Holders reales empiezan a seguir

### Pump.fun Sniper

**Bueno:**
- 3/10 snipes = Profit
- ROI promedio: +20-40%
- Quick exits (<5 min hold)

**Excelente:**
- 5/10 snipes = Profit
- ROI promedio: +50-100%
- Algunos 10x catches

---

## 🆘 ¿Necesitas Ayuda?

1. Lee esta guía completa
2. Lee la guía anti-detección
3. Revisa logs para errores específicos
4. Abre issue en GitHub con:
   - Qué intentas hacer
   - Qué error ves
   - Screenshot si es posible

---

**¡Buena suerte y happy trading!** 🚀
