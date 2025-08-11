import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './Modules/bot/bot.module';
import { AlertModule } from './Modules/alert/alert.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    ScheduleModule.forRoot(),
    BotModule,
    AlertModule,  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
