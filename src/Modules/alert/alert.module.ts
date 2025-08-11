import { BotModule } from '../bot/bot.module';
import { AlertService } from './alert.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [BotModule],
  providers: [AlertService],
})
export class AlertModule {}
