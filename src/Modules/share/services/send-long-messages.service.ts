import { Injectable } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';
import { EscapeMarkdownService } from './escape-markdown.service';

@Injectable()
export class SendLongMessagesService {
  constructor(private readonly escapeMarkdownService: EscapeMarkdownService) {}

  public async sendLongMessage(
    bot: Telegraf<Context>,
    chatId: string,
    message: string,
    options: any = {},
  ) {
    const chunks = this.splitIntoChunks(message, 4096);

    for (const chunk of chunks) {
      await bot.telegram.sendMessage(chatId, chunk, options);
    }
  }

  public splitIntoChunks(text: string, maxLength: number): string[] {
    const parts: string[] = [];
    let current = '';

    for (const line of text.split('\n')) {
      if ((current + '\n' + line).length > maxLength) {
        parts.push(current);
        current = line;
      } else {
        current += '\n' + line;
      }
    }

    if (current) {
      parts.push(current);
    }

    return parts;
  }
}
