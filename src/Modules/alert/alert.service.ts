import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class AlertService {
  constructor(
    @InjectBot('Athenea') private readonly bot: Telegraf<Context>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, { timeZone: 'America/Santo_Domingo' })
  async handleCron() {
    const groupId = process.env.ECONOMYC_NEWSPAPER_GROUP_ID || "";
    console.log("Disque ejecutando mensaje cada minuto")
    await this.bot.telegram.sendMessage(groupId, 'Hello World desde cron 🕒', { message_thread_id: 3 });
  }
}
