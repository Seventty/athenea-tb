import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

export type ChatRole = 'system' | 'user' | 'assistant';
export interface ChatMessage { role: ChatRole; content: string; }

@Injectable()
export class ChatGptService {
  private readonly logger = new Logger(ChatGptService.name);
  private readonly http: AxiosInstance;
  private readonly apiKey: string;
  private readonly model: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.model = process.env.OPENAI_MODEL || 'gpt-4.1';

    if (!this.apiKey) {
      throw new Error('❌ OPENAI_API_KEY no está configurada en process.env');
    }

    this.logger.log(`✅ ChatGPT inicializado con modelo: ${this.model}`);
    this.logger.debug(`🔐 Usando API key que termina en: ${this.apiKey.slice(-4)}`);

    this.http = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async complete(messages: ChatMessage[], temperature = 0.4): Promise<string> {
    try {
      const { data } = await this.http.post('/chat/completions', {
        model: this.model,
        temperature,
        messages,
      });

      const text: string =
        data?.choices?.[0]?.message?.content?.trim?.() ?? '';

      if (!text) {
        this.logger.warn('⚠️ Respuesta vacía del modelo');
        return 'No obtuve respuesta del modelo.';
      }

      return text;
    } catch (err: any) {
      if (err?.response?.status === 429) {
        this.logger.error(`🚫 Rate limit (429) alcanzado`, err?.response?.data);
      } else {
        this.logger.error(`❌ Error llamando OpenAI: ${err?.message}`, err?.stack);
      }
      return 'Ocurrió un error al consultar la IA. Intenta de nuevo en unos segundos.';
    }
  }

  async promptToText(userPrompt: string, systemPrompt?: string): Promise<string> {
    const msgs: ChatMessage[] = [];
    if (systemPrompt) {
      msgs.push({ role: 'system', content: systemPrompt });
    }
    msgs.push({ role: 'user', content: userPrompt });
    return this.complete(msgs);
  }
}
