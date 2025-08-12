// debug.module.ts
import { Module } from '@nestjs/common';
import { DebugService } from './debug.service';
import { TwelveDataService } from '../share/services/twelve-data.service';
import { FmpService } from '../share/services/fmp.service';
import { EscapeMarkdownService } from '../share/services/escape-markdown.service';
import { ChatGptService } from '../share/services/chatgpt.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [DebugService, ConfigService, TwelveDataService, FmpService, EscapeMarkdownService, ChatGptService],
  exports: [DebugService]
})
export class DebugModule {}
