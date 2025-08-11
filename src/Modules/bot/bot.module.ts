import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: 'Athenea',
      imports: [],
      inject: [],
      useFactory: () => {
        if (!process.env.TELEGRAM_BOT_TOKEN) {
          throw new Error('TELEGRAM_BOT_TOKEN environment variable is not set');
        }
        return {
          token: process.env.TELEGRAM_BOT_TOKEN,
          middlewares: [LoggerMiddleware],
        };
      },
    }),
  ],
  exports: [TelegrafModule],
})
export class BotModule {}
