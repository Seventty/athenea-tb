import { Injectable } from '@nestjs/common';

@Injectable()
export class EscapeMarkdownService {
  escapeMarkdownV2(text: string): string {
    const charsToEscape = /[_*[\]()~`>#+\-=|{}.!]/g;
    return text.replace(charsToEscape, (match) => `\\${match}`);
  }
}
