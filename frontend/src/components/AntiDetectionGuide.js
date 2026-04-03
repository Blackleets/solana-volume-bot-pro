import React, { useState } from 'react';

const AntiDetectionGuide = () => {
  const [activeSection, setActiveSection] = useState('intro');

  const sections = {
    intro: {
      title: '📚 Introducción',
      content: (
        <div>
          <h3>¿Por qué es importante la anti-detección?</h3>
          <p>
            Los bubble maps y sistemas de análisis de holders pueden detectar patrones de bots
            y marcar tu token como "manipulado artificialmente". Esto puede:
          </p>
          <ul>
            <li>❌ Ahuyentar inversores reales</li>
            <li>❌ Bajar la confianza del token</li>
            <li>❌ Ser marcado en DEX Screener</li>
            <li>❌ Aparecer en listas de "tokens con bots"</li>
          </ul>
          <p>
            <strong>Esta guía te enseña a generar volumen de forma que parezca 100% orgánico.</strong>
          </p>
        </div>
      )
    },
    bubbleMaps: {
      title: '🔍 Cómo funcionan los Bubble Maps',
      content: (
        <div>
          <h3>¿Qué detectan los Bubble Maps?</h3>
          
          <div className="detection-grid">
            <div className="detection-item bad">
              <h4>🚨 SEÑALES DE ALERTA</h4>
              <ul>
                <li>Todas las wallets fondeadas desde la misma dirección</li>
                <li>Todas con exactamente 1.0 SOL</li>
                <li>Compras simultáneas (todas al mismo tiempo)</li>
                <li>Cantidades idénticas (0.05, 0.05, 0.05...)</li>
                <li>Patrón perfecto secuencial</li>
              </ul>
            </div>

            <div className="detection-item good">
              <h4>✅ PARECE ORGÁNICO</h4>
              <ul>
                <li>Wallets fondeadas desde múltiples fuentes</li>
                <li>Balances variables (0.5, 1.2, 0.8, 1.5 SOL)</li>
                <li>Compras espaciadas en el tiempo</li>
                <li>Cantidades diferentes (0.047, 0.063, 0.038...)</li>
                <li>Timing aleatorio verdadero</li>
              </ul>
            </div>
          </div>

          <div className="example-box">
            <h4>Ejemplo Visual:</h4>
            <pre className="code-block bad">
❌ OBVIO BOT:
Wallet 1: 1.0 SOL → Compra 0.05 SOL → 10:00:00
Wallet 2: 1.0 SOL → Compra 0.05 SOL → 10:00:10  
Wallet 3: 1.0 SOL → Compra 0.05 SOL → 10:00:20
Wallet 4: 1.0 SOL → Compra 0.05 SOL → 10:00:30
            </pre>

            <pre className="code-block good">
✅ PARECE HUMANO:
Wallet 1: 0.7 SOL → Compra 0.047 SOL → 10:00:00
Wallet 2: 1.2 SOL → Compra 0.063 SOL → 10:02:15
Wallet 3: 0.9 SOL → Compra 0.038 SOL → 10:03:42
Wallet 4: 1.5 SOL → Compra 0.071 SOL → 10:08:23
            </pre>
          </div>
        </div>
      )
    },
    stepByStep: {
      title: '✅ Guía Paso a Paso',
      content: (
        <div>
          <h3>Configuración Óptima Anti-Detección</h3>

          <div className="step">
            <h4>PASO 1: Generar Wallets</h4>
            <div className="step-content">
              <p><strong>Cantidad recomendada:</strong></p>
              <ul>
                <li>Volumen bajo (hasta 50 SOL): 10-30 wallets</li>
                <li>Volumen medio (50-500 SOL): 50-150 wallets</li>
                <li>Volumen alto (500+ SOL): 200-500 wallets</li>
              </ul>
              <p className="tip">
                💡 <strong>Tip:</strong> Más wallets = Más difícil de detectar, pero también más SOL necesitas para fondear
              </p>
            </div>
          </div>

          <div className="step">
            <h4>PASO 2: Fondear Wallets (CRÍTICO)</h4>
            <div className="step-content">
              <p><strong>❌ MAL (Obvio bot):</strong></p>
              <ul>
                <li>Todas con 1.0 SOL exacto</li>
                <li>Todas fondeadas desde tu wallet principal</li>
                <li>Todas al mismo tiempo</li>
              </ul>

              <p><strong>✅ BIEN (Orgánico):</strong></p>
              <ul>
                <li>Cantidades variables: 0.5, 0.7, 1.2, 0.9, 1.5, 0.8 SOL</li>
                <li>Fondear desde 3-5 wallets diferentes</li>
                <li>Espaciar el fondeo: 10-30 minutos entre grupos</li>
              </ul>

              <div className="example-table">
                <h5>Ejemplo de fondeo inteligente:</h5>
                <table>
                  <thead>
                    <tr>
                      <th>Wallets</th>
                      <th>Fondeo desde</th>
                      <th>Cantidad</th>
                      <th>Timing</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1-20</td>
                      <td>Wallet A</td>
                      <td>0.5-1.5 SOL (variable)</td>
                      <td>10:00 AM</td>
                    </tr>
                    <tr>
                      <td>21-40</td>
                      <td>Wallet B</td>
                      <td>0.3-1.2 SOL (variable)</td>
                      <td>10:20 AM</td>
                    </tr>
                    <tr>
                      <td>41-60</td>
                      <td>Wallet C</td>
                      <td>0.7-1.8 SOL (variable)</td>
                      <td>10:45 AM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="step">
            <h4>PASO 3: Configurar Trading</h4>
            <div className="step-content">
              <p><strong>Activa TODAS estas opciones:</strong></p>
              <div className="checklist">
                <div className="checklist-item">
                  <input type="checkbox" defaultChecked disabled />
                  <label>Randomización avanzada (delays 15-180 seg)</label>
                </div>
                <div className="checklist-item">
                  <input type="checkbox" defaultChecked disabled />
                  <label>Cantidades variables (±80% variance)</label>
                </div>
                <div className="checklist-item">
                  <input type="checkbox" defaultChecked disabled />
                  <label>Errores intencionales (3% de trades "fallan")</label>
                </div>
                <div className="checklist-item">
                  <input type="checkbox" defaultChecked disabled />
                  <label>Holders permanentes (15% de wallets)</label>
                </div>
                <div className="checklist-item">
                  <input type="checkbox" defaultChecked disabled />
                  <label>Pausas aleatorias (5-30 min, 2-4 veces/día)</label>
                </div>
              </div>
            </div>
          </div>

          <div className="step">
            <h4>PASO 4: Evitar Errores Comunes</h4>
            <div className="step-content">
              <div className="dos-donts">
                <div className="dont">
                  <h5>❌ NUNCA HAGAS:</h5>
                  <ul>
                    <li>Que todas las wallets compren al mismo tiempo</li>
                    <li>Usar patrón secuencial (1,2,3,4,5...)</li>
                    <li>Cantidades perfectas (0.05, 0.05, 0.05...)</li>
                    <li>Delays exactos (10seg, 10seg, 10seg...)</li>
                  </ul>
                </div>
                <div className="do">
                  <h5>✅ SIEMPRE HAZLO:</h5>
                  <ul>
                    <li>Timing completamente aleatorio</li>
                    <li>Algunas wallets NO tradean (holders)</li>
                    <li>Cantidades ultra variables</li>
                    <li>Rotación impredecible de wallets</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    scenarios: {
      title: '🎯 Configuración por Escenario',
      content: (
        <div>
          <h3>Escenarios Comunes</h3>

          <div className="scenario">
            <h4>📈 Escenario 1: Token Nuevo (bajo presupuesto)</h4>
            <div className="scenario-config">
              <p><strong>Objetivo:</strong> Generar volumen inicial orgánico</p>
              <ul>
                <li>Wallets: 10-20</li>
                <li>SOL total: 10-15 SOL</li>
                <li>Duración: 3-6 horas</li>
                <li>Volumen esperado: 30-50 SOL</li>
              </ul>
              <p className="config-tip">
                ✅ Perfecto para tokens nuevos que empiezan. Parece actividad real inicial.
              </p>
            </div>
          </div>

          <div className="scenario">
            <h4>🚀 Escenario 2: Push Moderado</h4>
            <div className="scenario-config">
              <p><strong>Objetivo:</strong> Aumentar volumen sin ser obvio</p>
              <ul>
                <li>Wallets: 50-100</li>
                <li>SOL total: 50-100 SOL</li>
                <li>Duración: 12-24 horas</li>
                <li>Volumen esperado: 300-500 SOL</li>
              </ul>
              <p className="config-tip">
                ✅ Balance perfecto entre volumen alto y apariencia orgánica.
              </p>
            </div>
          </div>

          <div className="scenario">
            <h4>💎 Escenario 3: Volumen Profesional</h4>
            <div className="scenario-config">
              <p><strong>Objetivo:</strong> Volumen masivo totalmente orgánico</p>
              <ul>
                <li>Wallets: 200-500</li>
                <li>SOL total: 200-500 SOL</li>
                <li>Duración: 48-72 horas</li>
                <li>Volumen esperado: 2,000-5,000 SOL</li>
              </ul>
              <p className="config-tip">
                ✅ Indistinguible de actividad real. Requiere paciencia y capital.
              </p>
            </div>
          </div>
        </div>
      )
    },
    checklist: {
      title: '📋 Checklist Pre-Ejecución',
      content: (
        <div>
          <h3>Antes de Iniciar el Bot</h3>
          <p>Verifica TODOS estos puntos:</p>

          <div className="final-checklist">
            <div className="checklist-section">
              <h4>Wallets</h4>
              <div className="checklist-item">
                <input type="checkbox" />
                <label>Generé suficientes wallets (mínimo 10)</label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" />
                <label>Fondé con cantidades VARIABLES (no todas iguales)</label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" />
                <label>Fondé desde MÚLTIPLES wallets fuente (no solo una)</label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" />
                <label>Espacié el fondeo en el tiempo (no todo junto)</label>
              </div>
            </div>

            <div className="checklist-section">
              <h4>Configuración</h4>
              <div className="checklist-item">
                <input type="checkbox" />
                <label>Activé modo "Anti-Detection"</label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" />
                <label>Delays: 15-180 segundos (aleatorio)</label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" />
                <label>Cantidades: ±80% varianza</label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" />
                <label>Errores intencionales: ON</label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" />
                <label>15% de wallets como holders</label>
              </div>
            </div>

            <div className="checklist-section">
              <h4>Antes de Empezar</h4>
              <div className="checklist-item">
                <input type="checkbox" />
                <label>Guardé las private keys en lugar seguro</label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" />
                <label>Verifiqué el token address correcto</label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" />
                <label>Pool tiene suficiente liquidez (mín $50k)</label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" />
                <label>Hice una simulación para ver proyección</label>
              </div>
            </div>
          </div>

          <div className="final-warning">
            <h4>⚠️ Advertencia Final</h4>
            <p>
              Si NO cumples estos puntos, el bot SERÁ DETECTADO y marcado como artificial.
              Tómate el tiempo necesario para configurar todo correctamente.
            </p>
            <p>
              <strong>Recuerda:</strong> Calidad sobre velocidad. Mejor generar 50 SOL de volumen
              orgánico que 500 SOL obvios de bot.
            </p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="anti-detection-guide">
      <h2>📚 Guía Completa Anti-Detección</h2>
      <p className="guide-subtitle">
        Todo lo que necesitas saber para generar volumen sin ser detectado
      </p>

      <div className="guide-layout">
        {/* Sidebar */}
        <div className="guide-sidebar">
          <h3>Contenido</h3>
          {Object.keys(sections).map(key => (
            <button
              key={key}
              className={`sidebar-item ${activeSection === key ? 'active' : ''}`}
              onClick={() => setActiveSection(key)}
            >
              {sections[key].title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="guide-content">
          <h2>{sections[activeSection].title}</h2>
          {sections[activeSection].content}
        </div>
      </div>
    </div>
  );
};

export default AntiDetectionGuide;
