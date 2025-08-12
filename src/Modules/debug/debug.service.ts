// debug.service.ts
import { ChatGptService } from '../share/services/chatgpt.service';
import { TwelveDataService } from '../share/services/twelve-data.service';
import { Command, Ctx, Update } from 'nestjs-telegraf';

@Update()
export class DebugService {
  constructor(
    private readonly twelve: TwelveDataService,
    private chatgptService: ChatGptService
  ) {}

  @Command('debug_quote')
  async debugQuote(@Ctx() ctx: any) {
    const symbol = ctx.message.text.split(' ')[1] || 'NDX';

    const data = await this.twelve.getQuote(symbol);
    return ctx.replyWithMarkdownV2(
      `*Quote ${symbol}:*\n\`\`\`\n${JSON.stringify(data, null, 2)}\n\`\`\``
    );
  }

  @Command('debug_indicators')
  async debugIndicators(@Ctx() ctx: any) {
    const symbol = ctx.message.text.split(' ')[1] || 'NDX';
    
    const data = await this.twelve.getIndicators(symbol);
    return ctx.replyWithMarkdownV2(
      `*Indicadores:*\n\`\`\`\n${JSON.stringify(data, null, 2)}\n\`\`\``
    );
  }

  @Command('debug_gpt')
  async debugGpt(@Ctx() ctx: any) {
    const parts = ctx.message.text.split(' ').slice(1);

    if (parts.length === 0) {
      return ctx.reply('Debes escribir un prompt. Ej: `/debug_gpt ¿Qué es el Nasdaq?`', {
        parse_mode: 'Markdown',
      });
    }

    const prompt = parts.join(' ');

    const response = await this.chatgptService.promptToText(prompt);

    const reply = response.length > 4000
      ? response.slice(0, 3990) + '...'
      : response;

    return ctx.reply(reply, { parse_mode: 'Markdown' });
  }

}
