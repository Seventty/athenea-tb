import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TwelveDataService {
  private readonly logger = new Logger(TwelveDataService.name);
  private readonly baseURL = 'https://api.twelvedata.com';
  private readonly apiKey = process.env.TWELVE_DATA_API_KEY;

  private async fetch(endpoint: string, params: Record<string, any>) {
    const url = `${this.baseURL}/${endpoint}`;
    const fullParams = { ...params, apikey: this.apiKey };

    try {
      const { data } = await axios.get(url, { params: fullParams });
      return data;
    } catch (err) {
      this.logger.error(`Error al consultar ${endpoint}`, err);
      return null;
    }
  }

  async getQuote(symbol: string) {
    return this.fetch('quote', { symbol });
  }

  async getIndicators(symbol: string, interval = '1h') {
    const [rsi, macd, ema] = await Promise.all([
      this.fetch('rsi', { symbol, interval, time_period: 14 }),
      this.fetch('macd', { symbol, interval }),
      this.fetch('ema', { symbol, interval, time_period: 20 }),
    ]);
    return { rsi, macd, ema };
  }

  async getSupportResistance(symbol: string, interval = '1h') {
    return this.fetch('support_resistance', { symbol, interval });
  }
}
