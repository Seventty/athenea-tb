import { registerAs } from '@nestjs/config';
import { BotConfig } from '../share/interface/config.interface';

export default registerAs(
  'bot',
  (): BotConfig => ({
    token: process.env.TELEGRAM_BOT_TOKEN ?? (() => { throw new Error('TELEGRAM_BOT_TOKEN is not defined'); })(),
  }),
);
