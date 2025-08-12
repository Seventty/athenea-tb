import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { EscapeMarkdownService } from '../share/services/escape-markdown.service';
import { MarketAnalysisService } from '../share/services/market-analysis.service';

@Injectable()
export class AlertService {
  constructor(
    @InjectBot('Athenea') private readonly bot: Telegraf<Context>,
    private readonly llm: MarketAnalysisService,
    private escapeMarkdownService: EscapeMarkdownService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, { timeZone: 'America/Santo_Domingo' })
  async handleCron() {
    const groupId = process.env.ECONOMYC_NEWSPAPER_GROUP_ID || '';
    const analysis = await this.llm.generateAnalysis();

    const parsed = this.escapeMarkdownService.escapeMarkdownV2(analysis);

    await this.bot.telegram.sendMessage(groupId, parsed, {
      parse_mode: 'MarkdownV2',
      message_thread_id: 3,
    });
  }
}
