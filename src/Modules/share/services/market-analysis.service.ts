// market-analysis.service.ts
import { Injectable } from '@nestjs/common';
import { TwelveDataService } from './twelve-data.service';
import { ChatGptService, ChatMessage } from './chatgpt.service';

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
    day: 'numeric',
  });

  async generateAnalysis() {
    const [quoteNasdaq, quoteEurUsd, techNasdaq, techEurUsd] =
      await Promise.all([
        this.twelve.getQuote('NDX'),
        this.twelve.getQuote('EUR/USD'),
        this.twelve.getIndicators('NDX'),
        this.twelve.getIndicators('EUR/USD'),
      ]);

    const prompt: ChatMessage = {
      role: 'user',
      content: `
Actúa como un trader institucional y analista macroeconómico de alto nivel. Vas a recibir datos fundamentales y técnicos del día para generar un análisis completo y profesional, optimizado para ser enviado por Telegram usando texto plano y emojis, sin formato Markdown.

*REGLAS DE FORMATO (importante):*
- NO uses Markdown, ni *negritas*, _cursivas_, ~tachado~, \`inline code\`, ni ## encabezados.
- Usa solamente texto plano y emojis para darle estructura y vida al mensaje.
- Usa saltos de línea reales con \\n para separar bloques y hacerlo legible en Telegram.
- No uses caracteres conflictivos como *, _, ~, [, ], (, ), \\, {, }, <, >, |, #, =, +, -, ., ! ni MarkdownV2.
- Puedes usar emojis como título de sección (📊, 📈, 🎯, 🧠, etc.).
- Usa ">" como bloque visual tipo quote (opcional, solo si no hay errores).

*EJEMPLO DE FORMATO ESPERADO:*

⏳ Reporte de: Fecha del momento y hora en formato DD-MM-YYYY / HH:MM PM/AM

📰 CALENDARIO ECONÓMICO CLAVE  
Fecha: martes, 12 de agosto de 2025  
Evento esperado: IPC USA  
Impacto probable: Alta volatilidad en índices y pares con USD  

📈 NASDAQ 100  
Precio actual: 15,430.21 (+1.12%)  
Indicadores: RSI 68, MACD alcista, EMA20 actuando como soporte  
Soportes / Resistencias: S: 15,300 / R: 15,500  
Bias técnico: Alcista con sobrecompra leve  

📊 EUR/USD  
Precio actual: 1.0965 (+0.40%)  
RSI: 62  
MACD: cruz alcista reciente  
EMA20: soporte dinámico confirmado  
Bias: Alcista si el DXY sigue débil  

🎯 ESTRATEGIA SUGERIDA  
Oportunidad: EUR/USD en pullback a EMA20  
Hora ideal: Después del dato clave  
Setup: Esperar retroceso y confirmación para entrar largo  

🧠 CONCLUSIÓN  
Sesgo del día: Alcista en EUR/USD / Neutro en Nasdaq  
Oportunidad destacada: EUR/USD con confluencia técnica y fundamental  
Recomendación: Esperar confirmación post-evento antes de ejecutar entrada  

Ahora genera el análisis con ese formato exacto usando los siguientes datos:

{
  "preciosActuales": {
    "NDX": ${JSON.stringify(quoteNasdaq)},
    "EUR/USD": ${JSON.stringify(quoteEurUsd)}
  },
  "resumenTecnico": {
    "NDX": ${JSON.stringify(techNasdaq)},
    "EUR/USD": ${JSON.stringify(techEurUsd)}
  },
}
`,
    };

    const result = await this.chatGpt.complete([prompt]);
    return result;
  }
}
