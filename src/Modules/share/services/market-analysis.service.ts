// market-analysis.service.ts
import { Injectable } from '@nestjs/common';
import { TwelveDataService } from './twelve-data.service';
import { ChatGptService } from './chatgpt.service';

@Injectable()
export class MarketAnalysisService {
  constructor(
    private readonly twelve: TwelveDataService,
    private readonly chatGpt: ChatGptService,
  ) {}

   fecha = new Date();

  fullDate = this.fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  async generateAnalysis() {
    const [quoteNasdaq, quoteEurUsd, techNasdaq, techEurUsd] =
      await Promise.all([
        this.twelve.getQuote('NDX'),
        this.twelve.getQuote('EUR/USD'),
        this.twelve.getIndicators('NDX'),
        this.twelve.getIndicators('EUR/USD'),
      ]);

    const fullPrompt = {
      role: 'user' as const,
      content: `Actúa como un trader institucional y analista macroeconómico de alto nivel. Vas a recibir datos fundamentales y técnicos del día para generar un análisis completo, detallado y accionable para operar índices bursátiles y pares de divisas. Quiero que observes la información y luego generes un informe de mercado estructurado como se indica a continuación. Usa lenguaje profesional, conciso y enfocado en decisiones de trading. Sé preciso, analítico y evita opiniones vagas.

El formato del análisis debe ser el siguiente:

## 📰 Calendario Económico Clave
Resume brevemente los eventos de alto impacto del día ${this.fullDate}. Explica cuál evento podría mover el mercado y por qué. Enfócate especialmente en datos de EE.UU. y Europa si están presentes.

## 📈 Análisis Técnico y Sentimiento

### NASDAQ 100
- Precio actual, % cambio
- RSI, MACD, EMAs
- Niveles de soporte y resistencia
- Resumen técnico y bias esperado
- ¿Está sobrecomprado o sobrevendido?
- ¿Hay momentum? ¿Divergencia técnica?

### EUR/USD
- Mismo análisis técnico que Nasdaq
- ¿Qué relación tiene con el DXY hoy?

### Otros activos destacados (si están disponibles)
- Analiza solo si tienen movimiento relevante (alto cambio porcentual o volumen)

## 🎯 Estrategia sugerida
Con base en la data anterior:
- ¿Qué activos tienen mayor probabilidad de moverse?
- ¿Qué dirección sugiere el análisis técnico?
- ¿Cuál sería la mejor hora para operar? ¿Antes o después de un evento?
- ¿Qué tipo de setup buscar? (ruptura, pullback, rango)

## 🧠 Conclusión
Cierra con un resumen ejecutivo: cuál es el sesgo del día para cada activo, qué oportunidades se abren y qué riesgos evitar.

### ⚠️ Reglas:
- Si algún activo muestra confluencia clara entre técnico y fundamental, resáltalo como oportunidad prioritaria.
- Si hay conflicto entre indicadores, explica y recomienda esperar confirmación.

### 📥 Datos de entrada
Los siguientes bloques de datos son los que vas a procesar:
- calendarioEconomico
- resumenTecnico
- indicadores
- nivelesSoporteResistencia
- preciosActuales
- momentumObservado

Analízalos como un analista institucional, y entrega el análisis detallado como se solicitó."
      
      {
        "preciosActuales": {
          "NDX": ${JSON.stringify(quoteNasdaq)},
          "EUR/USD": ${JSON.stringify(quoteEurUsd)}
        },
        "resumenTecnico": {
          "NDX": ${JSON.stringify(techNasdaq)},
          "EUR/USD": ${JSON.stringify(techEurUsd)}
        },
        
      }`,
    };

    const result = await this.chatGpt.complete([fullPrompt]);
    return result;
  }
}
