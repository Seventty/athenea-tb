import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { EscapeMarkdownService } from '../share/services/escape-markdown.service';
import { MarketAnalysisService } from '../share/services/market-analysis.service';
import { SendLongMessagesService } from '../share/services/send-long-messages.service';

@Injectable()
export class AlertService {
  constructor(
    @InjectBot('Athenea') private readonly bot: Telegraf<Context>,
    private readonly llm: MarketAnalysisService,
    private sendLongMessageService: SendLongMessagesService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, { timeZone: 'America/Santo_Domingo' })
  async handleCron() {
    const groupId = process.env.ECONOMYC_NEWSPAPER_GROUP_ID || '';
    const raw = await this.llm.generateAnalysis();

    await this.sendLongMessageService.sendLongMessage(this.bot, groupId, raw, {
      message_thread_id: 3,
    });
  }
}
