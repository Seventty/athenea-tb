import { Injectable } from '@nestjs/common';

@Injectable()
export class EscapeMarkdownService {
  constructor() {}

  escapeMarkdownV2(text: string): string {
    return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&').replace(/\n/g, '\n');
  }
}
