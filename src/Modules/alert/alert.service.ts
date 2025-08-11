/* import { Start, Update, Sender, Command } from 'nestjs-telegraf';
import { UpdateType } from 'src/common/decorators/update-type.decorator';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types'; */

import { Ctx, Update } from 'nestjs-telegraf';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';

@Update()
@Injectable()
export class AlertService {
  constructor() {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    console.log('Hello World - cada minuto');
  }
}
