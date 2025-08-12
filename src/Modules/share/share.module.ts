import { Module } from '@nestjs/common';
import { ChatGptService } from './services/chatgpt.service';
import { FmpService } from './services/fmp.service';
import { TwelveDataService } from './services/twelve-data.service';
import { MarketAnalysisService } from './services/market-analysis.service';
import { EscapeMarkdownService } from './services/escape-markdown.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [ConfigService, ChatGptService, FmpService, TwelveDataService, MarketAnalysisService, EscapeMarkdownService],
  exports: [ChatGptService, FmpService, TwelveDataService, MarketAnalysisService, EscapeMarkdownService]
})
export class ShareModule {}
