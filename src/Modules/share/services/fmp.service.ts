// fmp.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FmpService {
  private readonly logger = new Logger(FmpService.name);
  private readonly baseURL = 'https://financialmodelingprep.com/api/v3';
  private readonly apiKey = process.env.FMP_API_KEY;

  private async fetch(endpoint: string, params: Record<string, any> = {}) {
    const url = `${this.baseURL}/${endpoint}`;
    try {
      const { data } = await axios.get(url, {
        params: { ...params, apikey: this.apiKey },
      });
      return data;
    } catch (err) {
      this.logger.error(`Error en ${endpoint}`, err);
      return null;
    }
  }

  async getEconomicCalendar(from: string, to: string) {
    return this.fetch('economic_calendar', { from, to });
  }

  async getEarningsCalendar(from: string, to: string) {
    return this.fetch('earning_calendar', { from, to });
  }

  async getNews(limit = 10) {
    return this.fetch('stock_news', { limit });
  }

  async getIndicesStatus() {
    return this.fetch('stock_market/indexes');
  }
}
