import { Module } from '@nestjs/common';
import { ChatGptService } from './services/chatgpt.service';
import { FmpService } from './services/fmp.service';
import { TwelveDataService } from './services/twelve-data.service';
import { MarketAnalysisService } from './services/market-analysis.service';
import { EscapeMarkdownService } from './services/escape-markdown.service';
import { ConfigService } from '@nestjs/config';
import { SendLongMessagesService } from './services/send-long-messages.service';

@Module({
  imports: [],
  providers: [ConfigService, ChatGptService, FmpService, TwelveDataService, MarketAnalysisService, EscapeMarkdownService, SendLongMessagesService],
  exports: [ChatGptService, FmpService, TwelveDataService, MarketAnalysisService, EscapeMarkdownService, SendLongMessagesService]
})
export class ShareModule {}
